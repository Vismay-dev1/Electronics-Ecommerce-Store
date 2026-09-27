import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";

export const dynamic = "force-dynamic";

function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) return Response.json({ error: "This is a preview store. Ordering and review submissions are unavailable until a database is connected." }, { status: 503 });
  try {
    await ensureSeeded();
    const payload = (await request.json()) as Record<string, unknown>;

    const productId = Number(payload.productId);
    const rating = Number(payload.rating);
    const author = clean(payload.author, 60);
    const location = clean(payload.location, 60);
    const title = clean(payload.title, 90);
    const body = clean(payload.body, 900);

    if (!Number.isInteger(productId) || productId <= 0) {
      return Response.json({ error: "A valid product is required." }, { status: 400 });
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return Response.json({ error: "Please choose a star rating." }, { status: 400 });
    }
    if (author.length < 2) {
      return Response.json({ error: "Please add your name." }, { status: 400 });
    }
    if (title.length < 3) {
      return Response.json({ error: "Please add a short headline." }, { status: 400 });
    }
    if (body.length < 12) {
      return Response.json(
        { error: "Reviews need at least 12 characters." },
        { status: 400 },
      );
    }

    const [product] = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);
    if (!product) {
      return Response.json({ error: "Product not found." }, { status: 404 });
    }

    const [inserted] = await db
      .insert(reviews)
      .values({
        productId,
        author,
        location,
        rating,
        title,
        body,
        verified: false,
        helpfulCount: 0,
      })
      .returning({ id: reviews.id });

    await db.execute(sql`
      update products p set
        rating = coalesce(r.avg_rating, 0),
        review_count = coalesce(r.total, 0)
      from (
        select product_id, round(avg(rating)::numeric, 2)::real as avg_rating, count(*)::int as total
        from reviews where product_id = ${productId} group by product_id
      ) r
      where r.product_id = p.id
    `);

    return Response.json({ ok: true, id: inserted?.id ?? null }, { status: 201 });
  } catch {
    return Response.json(
      { error: "We couldn't save that review. Please try again." },
      { status: 500 },
    );
  }
}
