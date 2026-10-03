
ecommerce-liard-tau-19.vercel.app


# Loyal Electronics

A professionally styled electronics **demo storefront** built with Next.js 16, React 19, Tailwind CSS 4 and optional PostgreSQL/Drizzle persistence.

## Quick start: no database needed

```bash
npm ci
npm run dev -- --hostname 0.0.0.0
```

Open http://localhost:3000. Without `DATABASE_URL`, the store uses a read-only catalog derived from the seed products. Search, categories, sorting, product details, persistent bag, saved product state, and checkout UI work. Order and review POST requests explicitly return HTTP 503 with a preview-mode explanation; they do not pretend to save anything.

## Enable database-backed demo orders and reviews

```bash
cp .env.example .env
```

Uncomment and configure `DATABASE_URL`, create that PostgreSQL database, then:

```bash
npx drizzle-kit push
npm run dev -- --hostname 0.0.0.0
```

The catalog is automatically seeded when its tables exist. A configured but unavailable database is treated as an error, not silently replaced with demo data. The page error boundary provides a retry and setup guidance.

Set `NEXT_PUBLIC_SITE_URL` to your deployment origin for sitemap/robots URLs. The local default is `http://localhost:3000`.

## Experience

- Cohesive Loyal identity: signal orange, warm neutrals, clean typography, responsive layouts.
- Homepage with category navigation, bestsellers, editorial promotion and new arrivals.
- URL-driven filters, search, sorting and pagination at `/shop`.
- Product details, color choice, stock-aware purchase controls and locally saved favorites.
- Persistent cart with quantity controls, keyboard focus containment and Escape dismissal.
- Demo checkout with server-side repricing, strict item/color/quantity/shipping validation and transactional order/item inserts.
- `/about` and `/help` contain real destinations for story, shipping, returns, checkout and privacy information.
- Local WebP images eliminate dependence on remote image hosts.

### Images and sample content

Images in `public/images/` are AI-generated concept-product illustrations, not photographs of real inventory. Related demo models reuse representative images; they are not exact variant/angle representations. Product descriptions and seeded reviews are fictional sample content. Replace these with verified inventory and customer content before launch. Inter is loaded from Google Fonts with system-font fallbacks.

### Promo codes

`LOYAL10` (10%), `FAMILY15` (15%), `STUDENT20` (20%). Standard shipping is $6.95 or free at a discounted subtotal of $75+. Express is $14.95; same-day is $24.95. Tax is an illustrative 8.25%.

## Checks

```bash
npm run lint
npm run typecheck
npm run build
npm run test:smoke   # requires the app running on port 3000
```

Set `TEST_ORIGIN` to test a different server. Smoke tests cover homepage, category filtering, empty search, product and not-found pages, checkout, information pages, health, local assets and disabled preview submissions.

Desktop (1440px) and mobile (390px) Chromium checks also exercised image loading, cart persistence, category navigation, buy-now routing and overflow, with no browser JavaScript errors. These browser checks were run manually using an ephemeral Playwright setup; the checked-in smoke test needs only Node.js.

## Production boundaries

This is **not a live commerce backend**. Payment inputs are demonstration-only; never enter real card data. No processor, receipt email, fulfillment, returns service or actual warranty is connected. Database-backed checkout was compile-checked but not integration-tested against PostgreSQL in this environment.

Before taking real orders, add authenticated/private order access, a payment provider, idempotency, inventory reservation, rate limiting, review moderation, real tax/shipping logic, transactional email, operational monitoring and legal policies. New order references use cryptographically random UUIDs, but an unguessable link is not a substitute for access control. Do not use real personal information in this demo.

The production dependency audit is clean. Four moderate development-only advisories remain in the existing Drizzle Kit / legacy esbuild dependency chain; avoid exposing that tool's development server and evaluate an upstream-supported tooling update rather than applying npm's suggested major downgrade blindly.
