import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BuyBox } from "@/components/product/buy-box";
import { ProductGallery } from "@/components/product/gallery";
import { ReviewSection } from "@/components/product/review-section";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { StarRating } from "@/components/star-rating";
import {
  CheckIcon,
  RefreshIcon,
  ShieldIcon,
  TruckIcon,
} from "@/components/icons";
import { CATEGORY_LABELS } from "@/db/seed-data";
import {
  getProductBySlug,
  getRelatedProducts,
  getReviews,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.tagline,
    openGraph: {
      title: `${product.name} · Loyal Electronics`,
      description: product.tagline,
      images: product.imageUrl ? [{ url: product.imageUrl }] : undefined,
    },
  };
}

const ASSURANCES = [
  { icon: TruckIcon, label: "Free 2-day delivery over $75" },
  { icon: ShieldIcon, label: "3-year Loyal Care warranty" },
  { icon: RefreshIcon, label: "30-day free returns" },
];

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [reviews, related] = await Promise.all([
    getReviews(product.id),
    getRelatedProducts({ id: product.id, category: product.category }, 4),
  ]);

  return (
    <>
      <div className="border-b border-ink-900/10 bg-cream-100">
        <nav className="mx-auto flex w-full max-w-[1400px] items-center gap-2 px-5 py-4 text-[11px] uppercase tracking-[0.16em] text-ink-400 md:px-10">
          <Link href="/" className="transition-colors hover:text-ink-900">
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/shop?category=${product.category}`}
            className="transition-colors hover:text-ink-900"
          >
            {CATEGORY_LABELS[product.category] ?? product.category}
          </Link>
          <span>/</span>
          <span className="truncate text-ink-700">{product.name}</span>
        </nav>
      </div>

      <section className="mx-auto w-full max-w-[1400px] px-5 py-10 md:px-10 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="animate-fade-up">
            <ProductGallery
              images={product.images}
              name={product.name}
              badge={product.badge}
            />
          </div>

          <div className="animate-fade-up delay-2">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/shop?category=${product.category}`}
                className="eyebrow rounded-full bg-cream-200 px-3 py-1.5 text-ink-700 transition-colors hover:bg-cream-300"
              >
                {CATEGORY_LABELS[product.category] ?? product.category}
              </Link>
              {product.isNewArrival && (
                <span className="eyebrow rounded-full bg-ink-900 px-3 py-1.5 text-cream-50">
                  New arrival
                </span>
              )}
              {product.bestseller && (
                <span className="eyebrow rounded-full bg-brand-300 px-3 py-1.5 text-ink-900">
                  Bestseller
                </span>
              )}
            </div>

            <h1 className="mt-5 font-display text-4xl leading-[1.02] text-ink-900 md:text-5xl">
              {product.name}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-ink-600">
              {product.tagline}
            </p>

            <a
              href="#reviews"
              className="mt-5 inline-flex items-center gap-2.5 text-sm text-ink-500 transition-colors hover:text-ink-900"
            >
              <StarRating value={product.rating} size={15} />
              <span className="font-semibold text-ink-800">
                {product.rating.toFixed(1)}
              </span>
              <span className="underline decoration-ink-300 underline-offset-4">
                {product.reviewCount} reviews
              </span>
            </a>

            <div className="mt-8 border-t border-ink-900/10 pt-8">
              <BuyBox product={product} />
            </div>

            {product.highlights.length > 0 && (
              <ul className="mt-9 flex flex-col gap-3 border-t border-ink-900/10 pt-8">
                {product.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-3 text-sm leading-relaxed text-ink-700"
                  >
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                    {highlight}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-9 grid gap-3 border-t border-ink-900/10 pt-8 sm:grid-cols-3">
              {ASSURANCES.map((assurance) => (
                <div
                  key={assurance.label}
                  className="flex items-center gap-2.5 text-xs text-ink-600"
                >
                  <assurance.icon className="h-4 w-4 shrink-0 text-brand-500" />
                  {assurance.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-ink-900/10 bg-cream-100">
        <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-5 py-14 md:px-10 md:py-20 lg:grid-cols-[1fr_420px] lg:gap-20">
          <Reveal>
            <p className="eyebrow text-brand-500">The details</p>
            <h2 className="mt-3 font-display text-3xl text-ink-900 md:text-4xl">
              Why we made it
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-[1.75] text-ink-600">
              {product.description}
            </p>
          </Reveal>

          {product.specs.length > 0 && (
            <Reveal delay={120}>
              <div className="rounded-3xl bg-cream-50 p-7 shadow-card">
                <h3 className="font-display text-xl text-ink-900">
                  Specifications
                </h3>
                <dl className="mt-5 divide-y divide-ink-900/10">
                  {product.specs.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-baseline justify-between gap-6 py-3"
                    >
                      <dt className="text-xs uppercase tracking-[0.12em] text-ink-400">
                        {item.label}
                      </dt>
                      <dd className="text-right text-sm font-medium text-ink-900">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1400px] px-5 py-14 md:px-10 md:py-20">
        <ReviewSection
          productId={product.id}
          reviews={reviews}
          rating={product.rating}
        />
      </section>

      {related.length > 0 && (
        <section className="border-t border-ink-900/10 bg-cream-100">
          <div className="mx-auto w-full max-w-[1400px] px-5 py-14 md:px-10 md:py-20">
            <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow text-brand-500">Pairs well with</p>
                <h2 className="mt-3 font-display text-3xl text-ink-900 md:text-4xl">
                  You might also like
                </h2>
              </div>
              <Link
                href={`/shop?category=${product.category}`}
                className="text-sm font-semibold text-ink-700 transition-colors hover:text-brand-500"
              >
                All {CATEGORY_LABELS[product.category]?.toLowerCase()}
              </Link>
            </Reveal>
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
              {related.map((item, index) => (
                <Reveal key={item.id} delay={index * 70}>
                  <ProductCard product={item} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
