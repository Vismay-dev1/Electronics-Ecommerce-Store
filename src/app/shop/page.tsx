import Link from "next/link";
import type { Metadata } from "next";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import {
  ActiveFilters,
  FilterPanel,
  FilterTrigger,
  FiltersProvider,
  SortSelect,
} from "@/components/shop/filters";
import { ArrowRight, SearchIcon } from "@/components/icons";
import { getFacets, getShopProducts } from "@/lib/queries";
import { AUDIENCE_LABELS, CATEGORY_LABELS } from "@/db/seed-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop all electronics",
  description:
    "Browse every Loyal device — headphones, laptops, tablets, wearables, cameras and home cinema. Filter by category, price and rating.",
};

type SearchParams = Record<string, string | string[] | undefined>;

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.flatMap((item) => item.split(","));
  return value.split(",");
}

function first(value: string | string[] | undefined): string | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

const PER_PAGE = 9;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const categories = toArray(params.category).filter(Boolean);
  const audiences = toArray(params.audience).filter(Boolean);
  const maxDollars = Number(first(params.max));
  const rating = Number(first(params.rating));
  const sort = first(params.sort) ?? "featured";
  const query = first(params.q)?.trim();
  const onlyDeals = first(params.deals) === "true";
  const page = Math.max(1, Number(first(params.page)) || 1);

  const [facets, result] = await Promise.all([
    getFacets(),
    getShopProducts({
      categories,
      audiences,
      maxPriceCents: Number.isFinite(maxDollars) && maxDollars > 0
        ? Math.round(maxDollars * 100)
        : undefined,
      minRating: Number.isFinite(rating) && rating > 0 ? rating : undefined,
      query: query || undefined,
      onlyDeals,
      sort,
      page,
      perPage: PER_PAGE,
    }),
  ]);

  const categoryOptions = Object.entries(CATEGORY_LABELS).map(
    ([value, label]) => ({
      value,
      label,
      count: facets.categories.get(value) ?? 0,
    }),
  );
  const audienceOptions = Object.entries(AUDIENCE_LABELS).map(
    ([value, label]) => ({ value, label, count: facets.audiences.get(value) ?? 0 }),
  );

  const heading = query
    ? `Results for “${query}”`
    : categories.length === 1
      ? (CATEGORY_LABELS[categories[0]] ?? "Shop")
      : "Everything in the store";

  const buildPageHref = (target: number) => {
    const next = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (key === "page" || value === undefined) continue;
      const v = Array.isArray(value) ? value[0] : value;
      if (v) next.set(key, v);
    }
    if (target > 1) next.set("page", String(target));
    const qs = next.toString();
    return qs ? `/shop?${qs}` : "/shop";
  };

  return (
    <FiltersProvider>
      <section className="border-b border-ink-900/10 bg-cream-100">
        <div className="mx-auto w-full max-w-[1400px] px-5 py-12 md:px-10 md:py-16">
          <nav className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-ink-400">
            <Link href="/" className="transition-colors hover:text-ink-900">
              Home
            </Link>
            <span>/</span>
            <span className="text-ink-700">Shop</span>
          </nav>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-brand-500">
                {facets.total} products · free shipping over $75
              </p>
              <h1 className="mt-3 font-display text-4xl leading-[1] text-ink-900 md:text-5xl">
                {heading}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <FilterTrigger />
              <SortSelect />
            </div>
          </div>
          <div className="mt-6 lg:hidden">
            <ActiveFilters
              categories={categoryOptions}
              audiences={audienceOptions}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1400px] px-5 py-10 md:px-10 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-14">
          <div className="hidden lg:block">
            <FilterPanel
              categories={categoryOptions}
              audiences={audienceOptions}
              minPriceCents={Math.max(0, facets.minPriceCents)}
              maxPriceCents={facets.maxPriceCents}
              total={facets.total}
            />
            <div className="mt-8">
              <ActiveFilters
                categories={categoryOptions}
                audiences={audienceOptions}
              />
            </div>
          </div>

          <div>
            {result.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-ink-900/15 px-6 py-24 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cream-200">
                  <SearchIcon className="h-6 w-6 text-ink-400" />
                </div>
                <h2 className="mt-6 font-display text-2xl text-ink-900">
                  Nothing matched those filters
                </h2>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-500">
                  Try widening the price range or clearing a category —
                  there&apos;s almost certainly something here for you.
                </p>
                <Link
                  href="/shop"
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-cream-50 transition-colors hover:bg-brand-400 hover:text-ink-900"
                >
                  Reset filters <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3">
                  {result.items.map((product, index) => (
                    <Reveal key={product.id} delay={(index % 3) * 70}>
                      <ProductCard product={product} priority={index < 3} />
                    </Reveal>
                  ))}
                </div>

                {result.totalPages > 1 && (
                  <div className="mt-16 flex flex-col items-center gap-4 border-t border-ink-900/10 pt-10">
                    <p className="text-xs uppercase tracking-[0.16em] text-ink-400">
                      Page {result.page} of {result.totalPages} · {result.total}{" "}
                      products
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {result.page > 1 && (
                        <Link
                          href={buildPageHref(result.page - 1)}
                          className="rounded-full border border-ink-900/15 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-ink-800 transition-colors hover:border-ink-900"
                        >
                          Previous
                        </Link>
                      )}
                      {Array.from({ length: result.totalPages }, (_, i) => i + 1).map(
                        (target) => (
                          <Link
                            key={target}
                            href={buildPageHref(target)}
                            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                              target === result.page
                                ? "bg-ink-900 text-cream-50"
                                : "text-ink-600 hover:bg-cream-200"
                            }`}
                          >
                            {target}
                          </Link>
                        ),
                      )}
                      {result.page < result.totalPages && (
                        <Link
                          href={buildPageHref(result.page + 1)}
                          className="rounded-full border border-ink-900/15 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-ink-800 transition-colors hover:border-ink-900"
                        >
                          Next
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </FiltersProvider>
  );
}
