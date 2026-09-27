import { sql } from "drizzle-orm";
import { db } from "./index";
import {
  collections,
  productImages,
  products,
  reviews,
} from "./schema";
import {
  buildGeneratedReviews,
  imageAlt,
  px,
  seedCollections,
  seedProducts,
} from "./seed-data";

let seedPromise: Promise<void> | null = null;

async function tablesExist(): Promise<boolean> {
  const result = await db.execute<{ exists: boolean }>(
    sql`select exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'products') as exists`,
  );
  return Boolean(result.rows[0]?.exists);
}

async function runSeed(): Promise<void> {
  if (!(await tablesExist())) return;

  const existing = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(products);
  if ((existing[0]?.count ?? 0) > 0) return;

  await db.insert(collections).values(seedCollections).onConflictDoNothing();

  for (const item of seedProducts) {
    const generated =
      item.reviews && item.reviews.length > 0
        ? []
        : buildGeneratedReviews(item, 3 + (item.slug.length % 3));
    const allReviews = [...(item.reviews ?? []), ...generated];

    const inserted = await db
      .insert(products)
      .values({
        slug: item.slug,
        name: item.name,
        tagline: item.tagline,
        description: item.description,
        category: item.category,
        audience: item.audience,
        priceCents: item.priceCents,
        compareAtCents: item.compareAtCents ?? null,
        badge: item.badge ?? null,
        stock: item.stock ?? 48,
        colors: item.colors,
        highlights: item.highlights,
        specs: item.specs,
        featured: item.featured ?? false,
        isNewArrival: item.isNewArrival ?? false,
        bestseller: item.bestseller ?? false,
      })
      .onConflictDoNothing()
      .returning({ id: products.id });

    const productId = inserted[0]?.id;
    if (!productId) continue;

    await db.insert(productImages).values(
      item.gallery.map((imageId, index) => ({
        productId,
        url: px(imageId, index === 0 ? 1000 : 1400),
        alt: imageAlt(item.name, index),
        position: index,
      })),
    );

    if (allReviews.length > 0) {
      await db.insert(reviews).values(
        allReviews.map((review) => ({
          productId,
          author: review.author,
          location: review.location,
          rating: review.rating,
          title: review.title,
          body: review.body,
          verified: review.verified ?? true,
          helpfulCount: review.helpfulCount ?? 0,
          createdAt: new Date(Date.now() - review.daysAgo * 86_400_000),
        })),
      );
    }
  }

  await db.execute(sql`
    update products p set
      rating = coalesce(r.avg_rating, 0),
      review_count = coalesce(r.total, 0)
    from (
      select product_id, round(avg(rating)::numeric, 2)::real as avg_rating, count(*)::int as total
      from reviews group by product_id
    ) r
    where r.product_id = p.id
  `);
}

export function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = runSeed().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }
  return seedPromise;
}
