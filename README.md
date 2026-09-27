# Loyal Electronics

A production-ready storefront for **Loyal Electronics** — premium audio, laptops, wearables, creator gear, gaming, and home cinema built for youth and families.

The shop ships with a cinematic home page, a filterable product grid, rich product pages, a persistent slide-out bag, and a three-step checkout that writes real orders to PostgreSQL. Catalog data is seeded automatically the first time the app talks to the database, so the store feels open for business on a fresh install.

> Demo checkout only. Card details are validated in the browser and never charged or stored.

## Features

- **Home** — editorial hero, featured collections, editor’s picks, weekly deals, new arrivals, and verified customer quotes
- **Shop** — category, audience, price, rating, and sale filters; sort; search; pagination; shareable URLs
- **Product pages** — image gallery, colour and quantity, quick add and buy-now, specs, related products
- **Reviews** — rating breakdown plus a live review form that updates the product average
- **Slide-out cart** — quantity edits, free-shipping progress, persisted in `localStorage`
- **Checkout** — contact, delivery, payment; promo codes; gift note; order confirmation page
- **Responsive** — mobile nav, mobile filters, and a cart that works from phone to desktop

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) + React 19 |
| Styling | Tailwind CSS 4 |
| Database | PostgreSQL + Drizzle ORM |
| Images | `next/image`, Pexels product photography, local hero assets |

## Getting started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+

### 1. Install

```bash
npm install
```

### 2. Configure the database

Copy the example env file and point it at your database:

```bash
cp .env.example .env
```

```env
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
```

Create the database if it does not exist:

```bash
createdb app_db
```

### 3. Push the schema

```bash
npx drizzle-kit push
```

Tables are defined in `src/db/schema.ts`. No migration files are required for local setup.

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The catalog seeds itself on the first page or API request (`src/db/seed.ts`). You do not need a separate seed command. Seeding is skipped if products already exist.

### Production

```bash
npm run build
npm run start
```

## Demo promo codes

Apply these at checkout:

| Code | Discount |
| --- | --- |
| `LOYAL10` | 10% off |
| `FAMILY15` | 15% off |
| `STUDENT20` | 20% off |

Shipping is free over **$75** on the standard method. Tax is estimated at 8.25%.

## Routes

| Path | What it does |
| --- | --- |
| `/` | Home |
| `/shop` | Product grid. Query: `category`, `audience`, `max`, `rating`, `deals`, `q`, `sort`, `page` |
| `/product/[slug]` | Product detail, gallery, reviews |
| `/checkout` | Three-step checkout |
| `/orders/[orderNumber]` | Confirmation |
| `/api/orders` | `POST` place an order |
| `/api/reviews` | `POST` publish a review |
| `/api/health` | Database health check |
| `/sitemap.xml` | Generated sitemap |
| `/robots.txt` | Crawl rules |

Shop filters are URL-driven, so a filtered view can be bookmarked or shared. Example:

```text
/shop?category=audio,wearables&audience=youth&max=250&rating=4&sort=price-asc
```

Sort values: `featured`, `newest`, `price-asc`, `price-desc`, `rating`, `reviews`.

Categories: `audio`, `vision`, `compute`, `wearables`, `create`, `play`.

Audiences: `youth`, `family`, `everyone`.

## Project structure

```text
src/
  app/
    page.tsx                  Home
    shop/                     Catalog + filters
    product/[slug]/           Product detail
    checkout/                 Checkout
    orders/[orderNumber]/     Confirmation
    api/orders/               Order creation
    api/reviews/              Review creation
    api/health/               Health check
  components/
    cart-provider.tsx         Persistent cart state
    cart-drawer.tsx           Slide-out bag
    product/                  Gallery, buy box, reviews
    checkout/                 Checkout flow
    shop/                     Filters and sort
  db/
    schema.ts                 Drizzle tables
    seed.ts                   Idempotent seeder
    seed-data.ts              Products, collections, reviews
  lib/
    queries.ts                Catalog and order queries
    promo.ts                  Promo codes
    types.ts                  Shared types and price formatting
public/images/                Hero and lifestyle photography
```

## Data model

- `products` — catalog, pricing in cents, JSON specs, highlights, and colours
- `product_images` — ordered gallery
- `reviews` — verified and customer-written reviews; product rating is recalculated on insert
- `collections` — featured collections on the home page
- `orders` / `order_items` — checkout records, including promo and shipping totals

Prices are stored as integer cents and formatted in USD.

## Cart

The bag lives in the browser under `loyal-electronics-cart-v1`. Adding a product opens the drawer. Checkout re-prices every line from the database, so a stale local price cannot be submitted.

## Scripts

```bash
npm run dev         # next dev
npm run build       # production build
npm run start       # next start
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
npx drizzle-kit push
```

## Notes

- Product photography is loaded from Pexels. `next.config.ts` allows `images.pexels.com`.
- Hero images live in `public/images/`.
- Checkout is a demonstration flow. Do not connect a live processor without replacing the payment step.
- Update the placeholder origin in `src/app/sitemap.ts` and `src/app/robots.ts` before deploying.

## License

Private demo storefront. Add a license before publishing if you intend others to reuse the code.
