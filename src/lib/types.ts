import type { Spec } from "@/db/schema";

export type ProductCard = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  audience: string;
  priceCents: number;
  compareAtCents: number | null;
  rating: number;
  reviewCount: number;
  badge: string | null;
  stock: number;
  colors: string[];
  isNewArrival: boolean;
  bestseller: boolean;
  imageUrl: string;
  imageAlt: string;
};

export type ProductDetail = ProductCard & {
  description: string;
  highlights: string[];
  specs: Spec[];
  images: { url: string; alt: string }[];
};

export type Review = {
  id: number;
  author: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  helpfulCount: number;
  createdAt: string;
};

export type CartLine = {
  productId: number;
  slug: string;
  name: string;
  imageUrl: string;
  unitPriceCents: number;
  quantity: number;
  color: string | null;
};

export type Collection = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  imageUrl: string;
  accent: string;
  productCount: number;
};

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest arrivals" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
  { value: "reviews", label: "Most reviewed" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export function isSortValue(value: string | undefined): value is SortValue {
  return Boolean(
    value && SORT_OPTIONS.some((option) => option.value === value),
  );
}

export const SHIPPING_METHODS = [
  {
    id: "standard",
    label: "Standard",
    detail: "3–5 business days · free over ₹1,999",
    priceCents: 9900,
    freeOverCents: 199900,
  },
  {
    id: "express",
    label: "Express",
    detail: "2 business days, tracked",
    priceCents: 19900,
    freeOverCents: null,
  },
  {
    id: "sameday",
    label: "Same-day city",
    detail: "Ordered before 1pm, metro areas",
    priceCents: 49900,
    freeOverCents: null,
  },
] as const;

export type ShippingMethodId = (typeof SHIPPING_METHODS)[number]["id"];

export const TAX_RATE = 0.18;

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(cents / 100));
}
