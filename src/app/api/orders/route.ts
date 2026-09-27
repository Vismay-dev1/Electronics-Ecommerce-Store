import { productImage } from "@/lib/catalog-images";
import { randomUUID } from "node:crypto";
import { inArray } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders, products } from "@/db/schema";
import { ensureSeeded } from "@/db/seed";
import { discountFor, normaliseCode } from "@/lib/promo";
import { SHIPPING_METHODS, TAX_RATE } from "@/lib/types";

export const dynamic = "force-dynamic";

type IncomingLine = {
  productId: number;
  quantity: number;
  color?: string | null;
};

function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

function generateOrderNumber(): string {
  return `LOY-${randomUUID()}`;
}

function shippingFor(methodId: string, subtotalCents: number): number {
  const method = SHIPPING_METHODS.find((item) => item.id === methodId);
  if (!method) return SHIPPING_METHODS[0].priceCents;
  if (method.freeOverCents !== null && subtotalCents >= method.freeOverCents) {
    return 0;
  }
  return method.priceCents;
}

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL)
    return Response.json(
      {
        error:
          "This is a preview store. Ordering and review submissions are unavailable until a database is connected.",
      },
      { status: 503 },
    );
  try {
    await ensureSeeded();
    const payload = (await request.json()) as Record<string, unknown>;

    const rawLines = Array.isArray(payload?.lines) ? payload.lines : [];
    if (
      !rawLines.length ||
      rawLines.length > 100 ||
      rawLines.some(
        (line) =>
          !line ||
          !Number.isSafeInteger(line.productId) ||
          line.productId < 1 ||
          !Number.isSafeInteger(line.quantity) ||
          line.quantity < 1 ||
          line.quantity > 20 ||
          (line.color != null && typeof line.color !== "string"),
      )
    )
      return Response.json(
        { error: "Please provide valid bag items and quantities (1–20)." },
        { status: 400 },
      );
    const lines: IncomingLine[] = rawLines;

    const email = clean(payload.email, 160).toLowerCase();
    const fullName = clean(payload.fullName, 120);
    const address1 = clean(payload.address1, 160);
    const address2 = clean(payload.address2, 160);
    const city = clean(payload.city, 90);
    const region = clean(payload.region, 90);
    const postalCode = clean(payload.postalCode, 24);
    const country = clean(payload.country, 80) || "India";
    const phone = clean(payload.phone, 40);
    const giftNote = clean(payload.giftNote, 280);
    const shippingMethod = clean(payload.shippingMethod, 24) || "standard";
    const promoCode = normaliseCode(clean(payload.promoCode, 16));

    if (!SHIPPING_METHODS.some((method) => method.id === shippingMethod)) {
      return Response.json(
        { error: "Choose a valid shipping method." },
        { status: 400 },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return Response.json(
        { error: "A valid email address is required." },
        { status: 400 },
      );
    }
    if (
      fullName.length < 2 ||
      address1.length < 4 ||
      city.length < 2 ||
      postalCode.length < 3
    ) {
      return Response.json(
        { error: "Please complete your delivery address." },
        { status: 400 },
      );
    }

    const ids = Array.from(new Set(lines.map((line) => line.productId)));

    const productRows = await db
      .select({
        id: products.id,
        slug: products.slug,
        name: products.name,
        priceCents: products.priceCents,
        stock: products.stock,
        colors: products.colors,
      })
      .from(products)
      .where(inArray(products.id, ids));

    const byId = new Map(productRows.map((row) => [row.id, row]));

    const resolved = lines
      .map((line) => {
        const product = byId.get(line.productId);
        if (!product) return null;
        return { product, quantity: line.quantity, color: line.color ?? null };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    if (resolved.length !== lines.length) {
      return Response.json(
        { error: "We couldn't find those products any more." },
        { status: 400 },
      );
    }

    const quantities = new Map<number, number>();
    for (const item of resolved) {
      const quantity = (quantities.get(item.product.id) ?? 0) + item.quantity;
      quantities.set(item.product.id, quantity);
      if (
        quantity > Math.min(20, item.product.stock) ||
        (item.color && !item.product.colors?.includes(item.color))
      ) {
        return Response.json(
          {
            error:
              "A selected quantity or color is unavailable. Please update your bag.",
          },
          { status: 400 },
        );
      }
    }

    const subtotalCents = resolved.reduce(
      (total, item) => total + item.product.priceCents * item.quantity,
      0,
    );
    const discountCents = discountFor(promoCode, subtotalCents);
    const discountedSubtotal = Math.max(0, subtotalCents - discountCents);
    const shippingCents = shippingFor(shippingMethod, discountedSubtotal);
    const taxCents = Math.round(discountedSubtotal * TAX_RATE);
    const totalCents = discountedSubtotal + shippingCents + taxCents;
    const orderNumber = generateOrderNumber();

    const order = await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(orders)
        .values({
          orderNumber,
          email,
          fullName,
          address1,
          address2,
          city,
          region,
          postalCode,
          country,
          phone,
          shippingMethod,
          giftNote,
          promoCode,
          discountCents,
          subtotalCents,
          shippingCents,
          taxCents,
          totalCents,
          status: "confirmed",
        })
        .returning({ id: orders.id, orderNumber: orders.orderNumber });

      if (!created) throw new Error("Order insert failed");

      await tx.insert(orderItems).values(
        resolved.map((item) => ({
          orderId: created.id,
          productId: item.product.id,
          name: item.color
            ? `${item.product.name} · ${item.color}`
            : item.product.name,
          slug: item.product.slug,
          imageUrl: productImage(item.product.name),
          unitPriceCents: item.product.priceCents,
          quantity: item.quantity,
        })),
      );

      return created;
    });

    return Response.json(
      {
        ok: true,
        orderNumber: order.orderNumber,
        totals: {
          subtotalCents,
          discountCents,
          shippingCents,
          taxCents,
          totalCents,
        },
      },
      { status: 201 },
    );
  } catch {
    return Response.json(
      { error: "We couldn't place that order. Please try again." },
      { status: 500 },
    );
  }
}
