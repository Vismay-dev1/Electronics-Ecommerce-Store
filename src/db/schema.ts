import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  real,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export type Spec = { label: string; value: string };

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    tagline: text("tagline").notNull(),
    description: text("description").notNull(),
    category: text("category").notNull(),
    audience: text("audience").notNull().default("everyone"),
    brand: text("brand").notNull().default("Loyal"),
    priceCents: integer("price_cents").notNull(),
    compareAtCents: integer("compare_at_cents"),
    rating: real("rating").notNull().default(0),
    reviewCount: integer("review_count").notNull().default(0),
    stock: integer("stock").notNull().default(48),
    badge: text("badge"),
    colors: jsonb("colors").$type<string[]>().notNull().default([]),
    highlights: jsonb("highlights").$type<string[]>().notNull().default([]),
    specs: jsonb("specs").$type<Spec[]>().notNull().default([]),
    featured: boolean("featured").notNull().default(false),
    isNewArrival: boolean("is_new_arrival").notNull().default(false),
    bestseller: boolean("bestseller").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("products_category_idx").on(table.category),
    index("products_price_idx").on(table.priceCents),
  ],
);

export const productImages = pgTable(
  "product_images",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    alt: text("alt").notNull(),
    position: integer("position").notNull().default(0),
  },
  (table) => [index("product_images_product_idx").on(table.productId)],
);

export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    author: text("author").notNull(),
    location: text("location").notNull().default(""),
    rating: integer("rating").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    verified: boolean("verified").notNull().default(true),
    helpfulCount: integer("helpful_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("reviews_product_idx").on(table.productId)],
);

export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  accent: text("accent").notNull().default("from-amber-400/20"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  email: text("email").notNull(),
  fullName: text("full_name").notNull(),
  address1: text("address1").notNull(),
  address2: text("address2").notNull().default(""),
  city: text("city").notNull(),
  region: text("region").notNull().default(""),
  postalCode: text("postal_code").notNull(),
  country: text("country").notNull().default("India"),
  phone: text("phone").notNull().default(""),
  shippingMethod: text("shipping_method").notNull().default("standard"),
  giftNote: text("gift_note").notNull().default(""),
  promoCode: text("promo_code").notNull().default(""),
  discountCents: integer("discount_cents").notNull().default(0),
  subtotalCents: integer("subtotal_cents").notNull(),
  shippingCents: integer("shipping_cents").notNull().default(0),
  taxCents: integer("tax_cents").notNull().default(0),
  totalCents: integer("total_cents").notNull(),
  status: text("status").notNull().default("confirmed"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const orderItems = pgTable(
  "order_items",
  {
    id: serial("id").primaryKey(),
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: integer("product_id"),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    imageUrl: text("image_url").notNull(),
    unitPriceCents: integer("unit_price_cents").notNull(),
    quantity: integer("quantity").notNull(),
  },
  (table) => [index("order_items_order_idx").on(table.orderId)],
);

export type ProductRow = typeof products.$inferSelect;
export type ProductImageRow = typeof productImages.$inferSelect;
export type ReviewRow = typeof reviews.$inferSelect;
export type CollectionRow = typeof collections.$inferSelect;
export type OrderRow = typeof orders.$inferSelect;
export type OrderItemRow = typeof orderItems.$inferSelect;
