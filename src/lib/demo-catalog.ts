import { productImage, categoryImage } from "./catalog-images";
import { seedProducts, seedCollections } from "@/db/seed-data";
import type { ProductDetail, Review } from "./types";
import type { ShopFilters } from "./queries";

// A read-only catalog keeps local previews usable without pretending to save orders.
export const demoMode = !process.env.DATABASE_URL;
export const demoProducts: ProductDetail[] = seedProducts.map((p, i) => ({
  ...p,
  id: i + 1,
  compareAtCents: p.compareAtCents ?? null,
  badge: p.badge ?? null,
  stock: p.stock ?? 48,
  rating: p.reviews?.length
    ? p.reviews.reduce((n, r) => n + r.rating, 0) / p.reviews.length
    : 0,
  reviewCount: p.reviews?.length ?? 0,
  isNewArrival: p.isNewArrival ?? false,
  bestseller: p.bestseller ?? false,
  imageUrl: productImage(p.name),
  imageAlt: p.name,
  images: [{ url: productImage(p.name), alt: p.name }],
}));
export const demoCollections = seedCollections.map((c) => ({
  ...c,
  imageUrl: categoryImage[c.category],
  productCount: demoProducts.filter((p) => p.category === c.category).length,
}));
export function demoReviews(id: number): Review[] {
  return (seedProducts[id - 1]?.reviews ?? []).map((r, i) => ({
    ...r,
    id: i + 1,
    verified: false,
    helpfulCount: 0,
    createdAt: new Date("2026-09-01").toISOString(),
  }));
}
export function demoShop(f: ShopFilters) {
  let items = demoProducts.filter(
    (p) =>
      (!f.categories.length || f.categories.includes(p.category)) &&
      (!f.audiences.length || f.audiences.includes(p.audience)) &&
      (f.minPriceCents === undefined || p.priceCents >= f.minPriceCents) &&
      (f.maxPriceCents === undefined || p.priceCents <= f.maxPriceCents) &&
      (!f.minRating || p.rating >= f.minRating) &&
      (!f.onlyDeals || (p.compareAtCents ?? 0) > p.priceCents) &&
      (!f.query ||
        `${p.name} ${p.tagline} ${p.description} ${p.category}`
          .toLowerCase()
          .includes(f.query.toLowerCase())),
  );
  items = [...items].sort((a, b) =>
    f.sort === "price-asc"
      ? a.priceCents - b.priceCents
      : f.sort === "price-desc"
        ? b.priceCents - a.priceCents
        : f.sort === "rating"
          ? b.rating - a.rating
          : f.sort === "reviews"
            ? b.reviewCount - a.reviewCount
            : f.sort === "newest"
              ? Number(b.isNewArrival) - Number(a.isNewArrival) || b.id - a.id
              : Number(b.bestseller) - Number(a.bestseller),
  );
  const total = items.length,
    totalPages = Math.max(1, Math.ceil(total / f.perPage));
  const page = Math.min(
    totalPages,
    Math.max(1, Number.isFinite(f.page) ? Math.floor(f.page) : 1),
  );
  return {
    items: items.slice((page - 1) * f.perPage, page * f.perPage),
    total,
    page,
    totalPages,
  };
}
export function demoFacets() {
  const categories = new Map<string, number>(),
    audiences = new Map<string, number>();
  for (const p of demoProducts) {
    categories.set(p.category, (categories.get(p.category) ?? 0) + 1);
    audiences.set(p.audience, (audiences.get(p.audience) ?? 0) + 1);
  }
  return {
    categories,
    audiences,
    minPriceCents: Math.min(...demoProducts.map((p) => p.priceCents)),
    maxPriceCents: Math.max(...demoProducts.map((p) => p.priceCents)),
    total: demoProducts.length,
  };
}
