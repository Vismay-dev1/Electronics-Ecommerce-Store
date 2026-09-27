import Image from "next/image";
import Link from "next/link";
import { ProductCard, ProductRail } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { StarRating } from "@/components/star-rating";
import {
  ArrowRight,
  QuoteIcon,
  RefreshIcon,
  ShieldIcon,
  SparkIcon,
  TruckIcon,
} from "@/components/icons";
import {
  getCollections,
  getDeals,
  getFeaturedProducts,
  getNewArrivals,
  getSpotlightReviews,
  getStoreStats,
} from "@/lib/queries";
import { formatPrice } from "@/lib/types";

export const dynamic = "force-dynamic";

const PERKS = [
  {
    icon: TruckIcon,
    title: "Free 2-day shipping",
    copy: "On every order over $75, everywhere in the lower 48.",
  },
  {
    icon: ShieldIcon,
    title: "3-year Loyal Care",
    copy: "Accidental damage included on all youth devices.",
  },
  {
    icon: RefreshIcon,
    title: "30-day returns",
    copy: "Changed your mind? Send it back, we pay postage.",
  },
  {
    icon: SparkIcon,
    title: "Trade-in credit",
    copy: "Up to 40% back on last year's Loyal gear.",
  },
];

export default async function HomePage() {
  const [collections, featured, newArrivals, deals, stats, spotlight] =
    await Promise.all([
      getCollections(),
      getFeaturedProducts(8),
      getNewArrivals(4),
      getDeals(4),
      getStoreStats(),
      getSpotlightReviews(3),
    ]);

  const heroProduct = featured[0];

  return (
    <>
      {/* ---------------------------------------------------------------- HERO */}
      <section className="relative overflow-hidden bg-ink-950 text-cream-50">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-[-10%] h-[34rem] w-[34rem] rounded-full bg-brand-500/25 blur-[120px]" />
          <div className="absolute right-[-10%] top-[20%] h-[30rem] w-[30rem] rounded-full bg-electric-500/20 blur-[120px]" />
        </div>

        <div className="relative mx-auto grid w-full max-w-[1400px] items-center gap-12 px-5 py-16 md:px-10 md:py-24 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-28">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-cream-100/15 bg-cream-100/5 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-cream-100/70">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-300" />
              Autumn launch · up to 25% off
            </span>

            <h1 className="mt-7 font-display text-[2.75rem] leading-[0.95] tracking-[-0.03em] text-cream-50 sm:text-6xl lg:text-[4.75rem]">
              Tech that keeps up
              <br />
              <span className="italic text-brand-300">with your people.</span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-relaxed text-cream-100/70 sm:text-lg">
              Loyal builds audio, laptops, wearables and home cinema for the
              whole household — the teenager who wants it loud, the parents who
              want it safe, and everyone in between.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-cream-50 px-7 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-ink-950 transition-all duration-300 hover:bg-brand-300"
              >
                Shop the collection
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/shop?deals=true"
                className="inline-flex items-center gap-2 rounded-full border border-cream-100/25 px-7 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-cream-100 transition-all duration-300 hover:border-brand-300 hover:text-brand-300"
              >
                See this week&apos;s deals
              </Link>
            </div>

            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-cream-100/10 pt-8">
              {[
                { value: `${stats.productCount}`, label: "Devices in store" },
                { value: `${stats.avgRating}★`, label: `${stats.reviewCount} reviews` },
                { value: "3 yrs", label: "Loyal Care warranty" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="font-display text-3xl text-cream-50">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-[11px] uppercase tracking-[0.16em] text-cream-100/45">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative animate-fade-up delay-2">
            <div className="relative aspect-4/5 w-full overflow-hidden rounded-[2rem] border border-cream-100/10 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] sm:aspect-square lg:aspect-4/5">
              <Image
                src="/images/hero-loyal.jpg"
                alt="Loyal Electronics flagship devices floating in a dark studio"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
            </div>

            {heroProduct && (
              <Link
                href={`/product/${heroProduct.slug}`}
                className="group absolute bottom-5 left-5 right-5 flex items-center gap-4 rounded-2xl border border-cream-100/15 bg-ink-950/70 p-3 pr-5 backdrop-blur-xl transition-all duration-500 hover:border-brand-300/50 sm:bottom-6 sm:left-6 sm:right-auto sm:w-[22rem]"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={heroProduct.imageUrl}
                    alt={heroProduct.imageAlt}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="eyebrow text-brand-300">Most loved</p>
                  <p className="truncate font-display text-lg text-cream-50">
                    {heroProduct.name}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <StarRating value={heroProduct.rating} size={11} />
                    <span className="text-[11px] text-cream-100/50">
                      {formatPrice(heroProduct.priceCents)}
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-cream-100/50 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brand-300" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- PERKS */}
      <section className="border-b border-ink-900/10 bg-cream-100">
        <div className="mx-auto grid w-full max-w-[1400px] grid-cols-2 gap-x-6 gap-y-8 px-5 py-10 md:grid-cols-4 md:px-10 md:py-12">
          {PERKS.map((perk, index) => (
            <Reveal
              key={perk.title}
              delay={index * 70}
              className="flex items-start gap-3"
            >
              <perk.icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
              <div>
                <p className="text-sm font-semibold text-ink-900">
                  {perk.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink-500">
                  {perk.copy}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------- COLLECTIONS */}
      <section className="mx-auto w-full max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-brand-500">Featured collections</p>
            <h2 className="mt-3 max-w-2xl text-balance font-display text-3xl leading-[1.05] text-ink-900 md:text-5xl">
              Six ways to upgrade the household
            </h2>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-ink-700 transition-colors hover:text-brand-500"
          >
            Browse everything
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection, index) => (
            <Reveal key={collection.slug} delay={(index % 3) * 90}>
              <Link
                href={`/shop?category=${collection.category}`}
                className="group relative block h-full overflow-hidden rounded-3xl bg-ink-900"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden">
                  <Image
                    src={collection.imageUrl}
                    alt={collection.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover opacity-90 transition-all duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/35 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="eyebrow text-brand-300">
                    {collection.productCount} products
                  </p>
                  <h3 className="mt-2 font-display text-2xl text-cream-50">
                    {collection.name}
                  </h3>
                  <p className="mt-1 text-sm text-cream-100/65">
                    {collection.tagline}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-cream-50/0 transition-all duration-500 group-hover:gap-2.5 group-hover:text-brand-300">
                    Explore <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------- EDITOR PICKS */}
      <div className="bg-cream-100">
        <ProductRail
          products={featured.slice(0, 4)}
          title="Editor's picks this season"
          href="/shop"
        />
      </div>

      {/* ------------------------------------------------------------ EDITORIAL */}
      <section className="mx-auto w-full max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className="relative">
            <div className="relative aspect-4/5 w-full overflow-hidden rounded-[2rem] sm:aspect-4/3 lg:aspect-4/5">
              <Image
                src="/images/promo-family.jpg"
                alt="A mother and teenage daughter laughing while using a tablet together"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-2 w-52 rounded-2xl border border-ink-900/10 bg-cream-50 p-5 shadow-lift sm:right-6 lg:-right-6">
              <p className="font-display text-4xl text-ink-900">85 dB</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-500">
                The safe-listening cap on every Loyal kids headphone — locked,
                not suggested.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <p className="eyebrow text-brand-500">Built for real households</p>
            <h2 className="mt-3 text-balance font-display text-3xl leading-[1.05] text-ink-900 md:text-5xl">
              Controls parents trust. Design teenagers won&apos;t hide.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-600">
              Every Loyal device ships with the same promise: a family dashboard
              you can set in a minute, hardware that survives a school bag, and
              a repair path so a cracked screen isn&apos;t a landfill sentence.
            </p>
            <ul className="mt-8 flex flex-col gap-4">
              {[
                {
                  title: "Per-profile limits",
                  copy: "Screen-time budgets, bedtime cutoffs and age-banded app shelves for up to six people.",
                },
                {
                  title: "Shared listening",
                  copy: "Dual audio jacks and multipoint pairing so siblings can share one screen peacefully.",
                },
                {
                  title: "Repairable by design",
                  copy: "Batteries and cushions you can replace at home with a single tool in the box.",
                },
              ].map((item, index) => (
                <li key={item.title} className="flex gap-4">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink-900 font-display text-xs text-cream-50">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-500">
                      {item.copy}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <Link
              href="/shop?audience=family"
              className="group mt-9 inline-flex items-center gap-2 rounded-full bg-ink-900 px-7 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-cream-50 transition-colors hover:bg-brand-400 hover:text-ink-900"
            >
              Shop family picks
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- DEALS */}
      <section className="relative overflow-hidden bg-ink-950 text-cream-50">
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-brand-500/20 blur-[130px]" />
        <div className="relative mx-auto w-full max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
          <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-brand-300">Save while it lasts</p>
              <h2 className="mt-3 font-display text-3xl leading-[1.05] text-cream-50 md:text-5xl">
                This week&apos;s price drops
              </h2>
            </div>
            <Link
              href="/shop?deals=true"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-cream-100/70 transition-colors hover:text-brand-300"
            >
              All deals
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {deals.map((product, index) => (
              <Reveal key={product.id} delay={index * 80}>
                <div className="rounded-2xl border border-cream-100/10 bg-cream-100/[0.03] p-3">
                  <ProductCard product={product} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- NEW ARRIVALS */}
      <ProductRail
        products={newArrivals}
        title="Just landed"
        href="/shop?sort=newest"
        hrefLabel="See all new arrivals"
      />

      {/* ---------------------------------------------------------- TESTIMONIALS */}
      <section className="border-t border-ink-900/10 bg-cream-100">
        <div className="mx-auto w-full max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
          <Reveal className="mb-12 text-center">
            <p className="eyebrow text-brand-500">
              {stats.reviewCount}+ verified reviews
            </p>
            <h2 className="mx-auto mt-3 max-w-2xl text-balance font-display text-3xl leading-[1.05] text-ink-900 md:text-5xl">
              What households actually say
            </h2>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {spotlight.map((review, index) => (
              <Reveal key={`${review.author}-${index}`} delay={index * 100}>
                <figure className="flex h-full flex-col rounded-3xl bg-cream-50 p-7 shadow-card">
                  <QuoteIcon className="h-6 w-6 text-brand-300" />
                  <StarRating value={review.rating} size={14} className="mt-5" />
                  <blockquote className="mt-4 flex-1">
                    <p className="font-display text-lg leading-snug text-ink-900">
                      {review.title}
                    </p>
                    <p className="mt-2.5 text-sm leading-relaxed text-ink-600">
                      {review.body}
                    </p>
                  </blockquote>
                  <figcaption className="mt-6 border-t border-ink-900/10 pt-5 text-xs">
                    <span className="font-semibold text-ink-900">
                      {review.author}
                    </span>
                    <span className="text-ink-400"> · {review.location}</span>
                    <Link
                      href={`/product/${review.productSlug}`}
                      className="mt-1 block text-ink-500 underline decoration-ink-300 underline-offset-4 transition-colors hover:text-brand-500"
                    >
                      {review.productName}
                    </Link>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ CTA */}
      <section className="mx-auto w-full max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <Reveal className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-200 via-cream-200 to-cream-100 px-6 py-14 text-center md:px-16 md:py-20">
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/40 blur-3xl" />
          <p className="eyebrow text-brand-600">Loyal Perks</p>
          <h2 className="mx-auto mt-4 max-w-2xl text-balance font-display text-3xl leading-[1.05] text-ink-900 md:text-5xl">
            Join free, get 10% off, and a birthday upgrade on us
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-ink-600 md:text-base">
            Members get early access to drops, extended trade-in windows and a
            free battery swap every second year. No points to track — just
            loyalty returned.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 rounded-full bg-ink-900 px-7 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-cream-50 transition-colors hover:bg-brand-500"
            >
              Start shopping
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/shop?audience=youth"
              className="inline-flex items-center gap-2 rounded-full border border-ink-900/20 px-7 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-ink-900 transition-colors hover:border-ink-900"
            >
              Youth picks
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
