"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "./cart-provider";
import { ArrowRight, PlusIcon } from "./icons";
import { StarRating } from "./star-rating";
import type { ProductCard as ProductCardType } from "@/lib/types";
import { formatPrice } from "@/lib/types";

const CATEGORY_LABELS: Record<string, string> = {
  audio: "Audio",
  vision: "TV & Cinema",
  compute: "Laptops & Study",
  wearables: "Wearables",
  create: "Creator Gear",
  play: "Gaming",
};

export function ProductCard({
  product,
  priority = false,
  compact = false,
}: {
  product: ProductCardType;
  priority?: boolean;
  compact?: boolean;
}) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const discount =
    product.compareAtCents && product.compareAtCents > product.priceCents
      ? Math.round(
          ((product.compareAtCents - product.priceCents) /
            product.compareAtCents) *
            100,
        )
      : 0;

  const handleAdd = () => {
    if (product.stock < 1) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      imageUrl: product.imageUrl,
      unitPriceCents: product.priceCents,
      color: product.colors[0] ?? null,
    });
    setAdding(true);
    setTimeout(() => setAdding(false), 1400);
  };

  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative overflow-hidden rounded-2xl bg-cream-100">
        <Link
          href={`/product/${product.slug}`}
          className="block"
          aria-label={`View ${product.name}`}
        >
          <div className={`${compact ? "aspect-4/3" : "aspect-square"} w-full`}>
            <Image
              src={product.imageUrl}
              alt={product.imageAlt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
              className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            />
          </div>
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {discount > 0 && (
            <span className="rounded-full bg-brand-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-900">
              −{discount}%
            </span>
          )}
          {product.isNewArrival && (
            <span className="rounded-full bg-ink-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-cream-50">
              New
            </span>
          )}
          {product.badge && (
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-800 backdrop-blur">
              {product.badge}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={product.stock < 1}
          className="absolute bottom-3 right-3 flex translate-y-3 items-center gap-1.5 rounded-full bg-ink-900 px-3.5 py-2 text-xs font-semibold text-cream-50 opacity-0 shadow-[0_10px_30px_-12px_rgba(7,8,12,0.7)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-brand-400 hover:text-ink-900 focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100"
          aria-label={`Add ${product.name} to bag`}
        >
          {adding ? (
            <>Added ✓</>
          ) : (
            <>
              <PlusIcon className="h-3.5 w-3.5" /> Quick add
            </>
          )}
        </button>
      </div>

      <div className="flex flex-1 flex-col px-0.5 pt-4">
        <div className="flex items-center justify-between gap-3">
          <span className="eyebrow text-ink-400">
            {CATEGORY_LABELS[product.category] ?? product.category}
          </span>
          <StarRating value={product.rating} size={11} />
        </div>
        <h3 className="mt-2 font-display text-lg leading-snug text-ink-900">
          <Link
            href={`/product/${product.slug}`}
            className="link-underline decoration-brand-300"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink-500">
          {product.tagline}
        </p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-base font-semibold text-ink-900">
            {formatPrice(product.priceCents)}
          </span>
          {product.compareAtCents && (
            <span className="text-sm text-ink-400 line-through">
              {formatPrice(product.compareAtCents)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProductRail({
  products,
  title,
  href,
  hrefLabel = "Shop all",
}: {
  products: ProductCardType[];
  title: string;
  href: string;
  hrefLabel?: string;
}) {
  if (products.length === 0) return null;
  return (
    <section className="mx-auto w-full max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl text-ink-900 md:text-4xl">
            {title}
          </h2>
        </div>
        <Link
          href={href}
          className="group inline-flex items-center gap-2 text-sm font-semibold text-ink-700 transition-colors hover:text-brand-500"
        >
          {hrefLabel}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
      <div className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 no-scrollbar md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0 md:pb-0">
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[68%] shrink-0 snap-start sm:w-[42%] md:w-auto"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
