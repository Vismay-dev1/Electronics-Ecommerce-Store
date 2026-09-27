"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart-provider";
import {
  CheckIcon,
  HeartIcon,
  MinusIcon,
  PlusIcon,
  TruckIcon,
} from "@/components/icons";
import type { ProductCard } from "@/lib/types";
import { formatPrice } from "@/lib/types";

export function BuyBox({ product }: { product: ProductCard }) {
  const { addItem, closeCart } = useCart();
  const router = useRouter();
  const [color, setColor] = useState<string | null>(product.colors[0] ?? null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [wish, setWish] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("loyal-wishlist") || "[]");
      queueMicrotask(() =>
        setWish(Array.isArray(saved) && saved.includes(product.slug)),
      );
    } catch {
      /* optional storage */
    }
  }, [product.slug]);
  const toggleWish = () => {
    const next = !wish;
    setWish(next);
    try {
      const stored = JSON.parse(localStorage.getItem("loyal-wishlist") || "[]");
      const saved: string[] = Array.isArray(stored)
        ? stored.filter((s: unknown) => typeof s === "string")
        : [];
      localStorage.setItem(
        "loyal-wishlist",
        JSON.stringify(
          next
            ? [...new Set([...saved, product.slug])]
            : saved.filter((s) => s !== product.slug),
        ),
      );
    } catch {
      /* optional storage */
    }
  };

  const discount =
    product.compareAtCents && product.compareAtCents > product.priceCents
      ? Math.round(
          ((product.compareAtCents - product.priceCents) /
            product.compareAtCents) *
            100,
        )
      : 0;

  const payload = {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    imageUrl: product.imageUrl,
    unitPriceCents: product.priceCents,
    color,
  };

  const handleAdd = () => {
    if (product.stock < 1) return;
    addItem(payload, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = () => {
    if (product.stock < 1) return;
    addItem(payload, quantity);
    closeCart();
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="font-display text-4xl text-ink-900">
          {formatPrice(product.priceCents)}
        </span>
        {product.compareAtCents && (
          <>
            <span className="text-lg text-ink-400 line-through">
              {formatPrice(product.compareAtCents)}
            </span>
            <span className="rounded-full bg-brand-300 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-900">
              Save {discount}%
            </span>
          </>
        )}
      </div>
      <p className="mt-2 text-xs text-ink-500">
        Prices in USD. Taxes and shipping calculated at checkout.
      </p>

      {product.colors.length > 0 && (
        <div className="mt-8">
          <p className="eyebrow text-ink-400">
            Colour · <span className="text-ink-700">{color}</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.colors.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setColor(option)}
                aria-pressed={color === option}
                className={`rounded-full border px-4 py-2 text-xs font-medium transition-all duration-300 ${
                  color === option
                    ? "border-ink-900 bg-ink-900 text-cream-50"
                    : "border-ink-900/15 text-ink-700 hover:border-ink-900/45"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <div className="flex items-center rounded-full border border-ink-900/15">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            className="p-3 text-ink-700 transition-colors hover:text-brand-500"
            aria-label="Decrease quantity"
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          <span className="w-9 text-center text-sm font-semibold tabular-nums text-ink-900">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() =>
              setQuantity((value) => Math.min(20, product.stock, value + 1))
            }
            className="p-3 text-ink-700 transition-colors hover:text-brand-500"
            aria-label="Increase quantity"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-ink-500">
          {product.stock > 12
            ? "Available in the demo catalog"
            : product.stock > 0
              ? `Only ${product.stock} left in stock`
              : "Out of stock"}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <button
          type="button"
          onClick={handleAdd}
          disabled={product.stock < 1}
          className={`flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-300 ${
            added
              ? "bg-emerald-600 text-white"
              : "bg-ink-900 text-cream-50 hover:bg-brand-400 hover:text-ink-900"
          }`}
        >
          {added ? (
            <>
              <CheckIcon className="h-4 w-4" /> Added to your bag
            </>
          ) : (
            <>Add to bag · {formatPrice(product.priceCents * quantity)}</>
          )}
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={product.stock < 1}
          className="w-full rounded-full border border-ink-900 px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-ink-900 transition-all duration-300 hover:bg-ink-900 hover:text-cream-50"
        >
          Buy it now
        </button>
        <button
          type="button"
          onClick={toggleWish}
          aria-pressed={wish}
          className="mx-auto mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-ink-500 transition-colors hover:text-ink-900"
        >
          <HeartIcon
            className={`h-4 w-4 transition-colors ${
              wish ? "fill-brand-400 text-brand-400" : ""
            }`}
          />
          {wish ? "Saved to wishlist" : "Save for later"}
        </button>
      </div>

      <div className="mt-8 flex items-start gap-3 rounded-2xl bg-cream-100 p-4">
        <TruckIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
        <p className="text-xs leading-relaxed text-ink-600">
          <strong className="font-semibold text-ink-900">
            Free standard shipping
          </strong>{" "}
          on discounted subtotals of $75 and up. Standard delivery is estimated
          at 3–5 business days in this demo.
        </p>
      </div>
    </div>
  );
}
