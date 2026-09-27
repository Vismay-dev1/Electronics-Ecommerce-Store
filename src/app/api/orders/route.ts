import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders, productImages, products } from "@/db/schema";
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
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const random = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `LOY-${stamp}${random}`;
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
  try {
    await ensureSeeded();
    const payload = (await request.json()) as Record<string, unknown>;

    const rawLines = Array.isArray(payload.lines) ? payload.lines : [];
    const lines: IncomingLine[] = rawLines
      .map((line) => line as Record<string, unknown>)
      .map((line) => ({
        productId: Number(line.productId),
        quantity: Math.max(
          1,
          Math.min(20, Math.round(Number(line.quantity) || 0)),
        ),
        color: typeof line.color === "string" ? line.color : null,
      }))
      .filter(
        (line) =>
          Number.isInteger(line.productId) &&
          line.productId > 0 &&
          line.quantity > 0,
      );

    if (lines.length === 0) {
      return Response.json({ error: "Your bag is empty." }, { status: 400 });
    }

    const email = clean(payload.email, 160).toLowerCase();
    const fullName = clean(payload.fullName, 120);
    const address1 = clean(payload.address1, 160);
    const address2 = clean(payload.address2, 160);
    const city = clean(payload.city, 90);
    const region = clean(payload.region, 90);
    const postalCode = clean(payload.postalCode, 24);
    const country = clean(payload.country, 80) || "United States";
    const phone = clean(payload.phone, 40);
    const giftNote = clean(payload.giftNote, 280);
    const shippingMethod = clean(payload.shippingMethod, 24) || "standard";
    const promoCode = normaliseCode(clean(payload.promoCode, 16));

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
      })
      .from(products)
      .where(inArray(products.id, ids));

    const imageRows = await db
      .select({
        productId: productImages.productId,
        url: productImages.url,
      })
      .from(productImages)
      .where(
        and(
          inArray(productImages.productId, ids),
          eq(productImages.position, 0),
        ),
      );
    const imageMap = new Map(
      imageRows.map((row) => [row.productId, row.url]),
    );
    const byId = new Map(productRows.map((row) => [row.id, row]));

    const resolved = lines
      .map((line) => {
        const product = byId.get(line.productId);
        if (!product) return null;
        return { product, quantity: line.quantity, color: line.color ?? null };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    if (resolved.length === 0) {
      return Response.json(
        { error: "We couldn't find those products any more." },
        { status: 400 },
      );
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

    const [order] = await db
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

    if (!order) {
      return Response.json(
        { error: "We couldn't place that order. Please try again." },
        { status: 500 },
      );
    }

    await db.insert(orderItems).values(
      resolved.map((item) => ({
        orderId: order.id,
        productId: item.product.id,
        name: item.color
          ? `${item.product.name} · ${item.color}`
          : item.product.name,
        slug: item.product.slug,
        imageUrl: imageMap.get(item.product.id) ?? "",
        unitPriceCents: item.product.priceCents,
        quantity: item.quantity,
      })),
    );

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
