import { and, asc, desc, eq, gte, ilike, inArray, lte, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { ensureSeeded } from "@/db/seed";
import {
  collections,
  orderItems,
  orders,
  productImages,
  products,
  reviews,
} from "@/db/schema";
import type {
  Collection,
  ProductCard,
  ProductDetail,
  Review,
} from "./types";

export type ShopFilters = {
  categories: string[];
  audiences: string[];
  minPriceCents?: number;
  maxPriceCents?: number;
  minRating?: number;
  query?: string;
  onlyDeals?: boolean;
  sort: string;
  page: number;
  perPage: number;
};

type ProductRowLite = typeof products.$inferSelect;

function toCard(
  row: ProductRowLite,
  image: { url: string; alt: string } | undefined,
): ProductCard {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    category: row.category,
    audience: row.audience,
    priceCents: row.priceCents,
    compareAtCents: row.compareAtCents ?? null,
    rating: Number(row.rating ?? 0),
    reviewCount: row.reviewCount ?? 0,
    badge: row.badge ?? null,
    stock: row.stock,
    colors: row.colors ?? [],
    isNewArrival: row.isNewArrival,
    bestseller: row.bestseller,
    imageUrl: image?.url ?? "",
    imageAlt: image?.alt ?? row.name,
  };
}

async function primaryImages(
  ids: number[],
): Promise<Map<number, { url: string; alt: string }>> {
  const positions = new Map<number, { url: string; alt: string; position: number }>();
  if (ids.length === 0) return new Map();

  const rows = await db
    .select({
      productId: productImages.productId,
      url: productImages.url,
      alt: productImages.alt,
      position: productImages.position,
    })
    .from(productImages)
    .where(inArray(productImages.productId, ids));

  for (const row of rows) {
    const current = positions.get(row.productId);
    if (!current || row.position < current.position) {
      positions.set(row.productId, row);
    }
  }

  const map = new Map<number, { url: string; alt: string }>();
  for (const [productId, value] of positions) {
    map.set(productId, { url: value.url, alt: value.alt });
  }
  return map;
}

function orderFor(sort: string) {
  switch (sort) {
    case "price-asc":
      return [asc(products.priceCents)];
    case "price-desc":
      return [desc(products.priceCents)];
    case "rating":
      return [desc(products.rating), desc(products.reviewCount)];
    case "reviews":
      return [desc(products.reviewCount), desc(products.rating)];
    case "newest":
      return [desc(products.isNewArrival), desc(products.id)];
    default:
      return [
        desc(products.featured),
        desc(products.bestseller),
        desc(products.rating),
      ];
  }
}

export async function getShopProducts(filters: ShopFilters) {
  await ensureSeeded();

  const conditions = [];
  if (filters.categories.length > 0) {
    conditions.push(inArray(products.category, filters.categories));
  }
  if (filters.audiences.length > 0) {
    conditions.push(inArray(products.audience, filters.audiences));
  }
  if (typeof filters.minPriceCents === "number") {
    conditions.push(gte(products.priceCents, filters.minPriceCents));
  }
  if (typeof filters.maxPriceCents === "number") {
    conditions.push(lte(products.priceCents, filters.maxPriceCents));
  }
  if (typeof filters.minRating === "number" && filters.minRating > 0) {
    conditions.push(gte(products.rating, filters.minRating));
  }
  if (filters.onlyDeals) {
    conditions.push(sql`${products.compareAtCents} is not null`);
  }
  if (filters.query) {
    const needle = `%${filters.query}%`;
    conditions.push(
      or(
        ilike(products.name, needle),
        ilike(products.tagline, needle),
        ilike(products.description, needle),
        ilike(products.category, needle),
      ),
    );
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [countRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(products)
    .where(where);

  const total = countRow?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / filters.perPage));
  const page = Math.min(Math.max(1, filters.page), totalPages);

  const rows = await db
    .select()
    .from(products)
    .where(where)
    .orderBy(...orderFor(filters.sort))
    .limit(filters.perPage)
    .offset((page - 1) * filters.perPage);

  const imageMap = await primaryImages(rows.map((row) => row.id));

  return {
    items: rows.map((row) => toCard(row, imageMap.get(row.id))),
    total,
    page,
    totalPages,
  };
}

export async function getFacets() {
  await ensureSeeded();
  const rows = await db
    .select({
      category: products.category,
      audience: products.audience,
      priceCents: products.priceCents,
    })
    .from(products);

  const categories = new Map<string, number>();
  const audiences = new Map<string, number>();
  let min = Number.POSITIVE_INFINITY;
  let max = 0;

  for (const row of rows) {
    categories.set(row.category, (categories.get(row.category) ?? 0) + 1);
    audiences.set(row.audience, (audiences.get(row.audience) ?? 0) + 1);
    min = Math.min(min, row.priceCents);
    max = Math.max(max, row.priceCents);
  }

  return {
    categories,
    audiences,
    minPriceCents: rows.length ? min : 0,
    maxPriceCents: max,
    total: rows.length,
  };
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  await ensureSeeded();
  const [row] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);
  if (!row) return null;

  const imageRows = await db
    .select({ url: productImages.url, alt: productImages.alt })
    .from(productImages)
    .where(eq(productImages.productId, row.id))
    .orderBy(asc(productImages.position));

  return {
    ...toCard(row, imageRows[0]),
    description: row.description,
    highlights: row.highlights ?? [],
    specs: row.specs ?? [],
    images: imageRows,
  };
}

export async function getReviews(productId: number): Promise<Review[]> {
  const rows = await db
    .select()
    .from(reviews)
    .where(eq(reviews.productId, productId))
    .orderBy(desc(reviews.createdAt), desc(reviews.id))
    .limit(30);

  return rows.map((row) => ({
    id: row.id,
    author: row.author,
    location: row.location,
    rating: row.rating,
    title: row.title,
    body: row.body,
    verified: row.verified,
    helpfulCount: row.helpfulCount,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function getRelatedProducts(
  product: Pick<ProductDetail, "id" | "category">,
  limit = 4,
): Promise<ProductCard[]> {
  const rows = await db
    .select()
    .from(products)
    .where(
      and(eq(products.category, product.category), sql`${products.id} <> ${product.id}`),
    )
    .orderBy(desc(products.rating))
    .limit(limit);

  if (rows.length >= limit) {
    const imageMap = await primaryImages(rows.map((row) => row.id));
    return rows.map((row) => toCard(row, imageMap.get(row.id)));
  }

  const fillers = await db
    .select()
    .from(products)
    .where(sql`${products.id} <> ${product.id}`)
    .orderBy(desc(products.bestseller), desc(products.rating))
    .limit(limit * 2);

  const seen = new Set(rows.map((row) => row.id));
  const combined = [...rows];
  for (const filler of fillers) {
    if (combined.length >= limit) break;
    if (seen.has(filler.id)) continue;
    seen.add(filler.id);
    combined.push(filler);
  }
  const imageMap = await primaryImages(combined.map((row) => row.id));
  return combined.map((row) => toCard(row, imageMap.get(row.id)));
}

export async function getCollections(): Promise<Collection[]> {
  await ensureSeeded();
  const rows = await db
    .select()
    .from(collections)
    .orderBy(asc(collections.sortOrder));

  const counts = await db
    .select({ category: products.category, count: sql<number>`count(*)::int` })
    .from(products)
    .groupBy(products.category);
  const countMap = new Map(counts.map((row) => [row.category, row.count]));

  return rows.map((row) => ({
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    category: row.category,
    imageUrl: row.imageUrl,
    accent: row.accent,
    productCount: countMap.get(row.category) ?? 0,
  }));
}

async function cardsBy(
  order: ReturnType<typeof orderFor>,
  limit: number,
  predicate?: ReturnType<typeof eq>,
): Promise<ProductCard[]> {
  const rows = await db
    .select()
    .from(products)
    .where(predicate)
    .orderBy(...order)
    .limit(limit);
  const imageMap = await primaryImages(rows.map((row) => row.id));
  return rows.map((row) => toCard(row, imageMap.get(row.id)));
}

export async function getFeaturedProducts(limit = 8) {
  await ensureSeeded();
  return cardsBy(
    [desc(products.rating), desc(products.reviewCount)],
    limit,
    eq(products.featured, true),
  );
}

export async function getBestsellers(limit = 8) {
  await ensureSeeded();
  return cardsBy(
    [desc(products.bestseller), desc(products.reviewCount)],
    limit,
    undefined,
  );
}

export async function getNewArrivals(limit = 4) {
  await ensureSeeded();
  return cardsBy(
    [desc(products.id)],
    limit,
    eq(products.isNewArrival, true),
  );
}

export async function getDeals(limit = 4) {
  await ensureSeeded();
  const rows = await db
    .select()
    .from(products)
    .where(sql`${products.compareAtCents} is not null`)
    .orderBy(
      desc(sql`(${products.compareAtCents} - ${products.priceCents})::float / ${products.compareAtCents}`),
    )
    .limit(limit);
  const imageMap = await primaryImages(rows.map((row) => row.id));
  return rows.map((row) => toCard(row, imageMap.get(row.id)));
}

export async function getStoreStats() {
  await ensureSeeded();
  const [row] = await db
    .select({
      productCount: sql<number>`count(*)::int`,
      reviewCount: sql<number>`coalesce(sum(${products.reviewCount}), 0)::int`,
      avgRating: sql<number>`coalesce(avg(${products.rating}), 0)::float`,
    })
    .from(products);
  return {
    productCount: row?.productCount ?? 0,
    reviewCount: row?.reviewCount ?? 0,
    avgRating: Number((row?.avgRating ?? 0).toFixed(1)),
  };
}

export async function getOrderByNumber(orderNumber: string) {
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1);
  if (!order) return null;
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));
  return { order, items };
}

export async function getAllProductSlugs() {
  await ensureSeeded();
  return db.select({ slug: products.slug }).from(products);
}

export type SpotlightReview = {
  author: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  productName: string;
  productSlug: string;
};

export async function getSpotlightReviews(limit = 3): Promise<SpotlightReview[]> {
  await ensureSeeded();
  const rows = await db
    .select({
      author: reviews.author,
      location: reviews.location,
      rating: reviews.rating,
      title: reviews.title,
      body: reviews.body,
      productName: products.name,
      productSlug: products.slug,
    })
    .from(reviews)
    .innerJoin(products, eq(reviews.productId, products.id))
    .where(gte(reviews.rating, 5))
    .orderBy(desc(reviews.helpfulCount))
    .limit(limit);
  return rows;
}
