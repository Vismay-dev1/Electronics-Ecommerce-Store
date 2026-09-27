"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "./cart-provider";
import {
  ArrowRight,
  CheckIcon,
  CloseIcon,
  LockIcon,
  MinusIcon,
  PlusIcon,
  TruckIcon,
} from "./icons";
import { formatPrice } from "@/lib/types";

const FREE_SHIPPING_THRESHOLD = 7500;

export function CartDrawer() {
  const {
    lines,
    isOpen,
    closeCart,
    setQuantity,
    removeItem,
    subtotalCents,
    count,
    lastAddedSlug,
  } = useCart();

  const dialog = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const el = dialog.current;
    const controls = () => Array.from(el?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, select, textarea, [tabindex="0"]') ?? []);
    controls()[0]?.focus();
    const trap = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const elements = controls(), first = elements[0], last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    el?.addEventListener('keydown', trap);
    return () => { el?.removeEventListener('keydown', trap); previous?.focus(); };
  }, [isOpen]);

  const remaining = FREE_SHIPPING_THRESHOLD - subtotalCents;
  const progress = Math.min(
    100,
    Math.round((subtotalCents / FREE_SHIPPING_THRESHOLD) * 100),
  );

  return (
    <div
      className={`fixed inset-0 z-[60] ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!isOpen}
      inert={!isOpen}
    >
      <div
        className={`absolute inset-0 bg-ink-950/55 backdrop-blur-[3px] transition-opacity duration-400 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeCart}
      />
      <aside
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-cream-50 shadow-lift transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-ink-900/10 px-6 py-5">
          <div>
            <p className="eyebrow text-ink-400">Your bag</p>
            <h2 className="font-display text-2xl text-ink-900">
              {count} {count === 1 ? "item" : "items"}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="rounded-full p-2 text-ink-700 transition-colors hover:bg-ink-900/5"
            aria-label="Close cart"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </header>

        {lines.length > 0 && (
          <div className="border-b border-ink-900/10 bg-cream-100 px-6 py-4">
            <div className="flex items-center gap-2 text-xs font-medium text-ink-700">
              <TruckIcon className="h-4 w-4 text-brand-500" />
              {remaining > 0 ? (
                <span>
                  You&apos;re{" "}
                  <strong className="text-ink-900">
                    {formatPrice(remaining)}
                  </strong>{" "}
                  from free 2-day shipping
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <CheckIcon className="h-3.5 w-3.5" /> Free 2-day shipping
                  unlocked
                </span>
              )}
            </div>
            <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-ink-900/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-300 to-brand-500 transition-[width] duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream-200">
                <TruckIcon className="h-7 w-7 text-ink-400" />
              </div>
              <h3 className="mt-5 font-display text-xl text-ink-900">
                Your bag is empty
              </h3>
              <p className="mt-2 max-w-[26ch] text-sm leading-relaxed text-ink-500">
                Fill it with something that sounds, looks or plays better.
              </p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-cream-50 transition-colors hover:bg-brand-400 hover:text-ink-900"
              >
                Start shopping <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-5">
              {lines.map((line) => {
                const justAdded = lastAddedSlug === line.slug;
                return (
                  <li
                    key={`${line.productId}-${line.color ?? "default"}`}
                    className={`flex gap-4 rounded-2xl p-2 transition-colors ${
                      justAdded ? "bg-brand-50" : "transparent"
                    }`}
                  >
                    <Link
                      href={`/product/${line.slug}`}
                      onClick={closeCart}
                      className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-cream-100"
                    >
                      <Image
                        src={line.imageUrl}
                        alt={line.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <Link
                          href={`/product/${line.slug}`}
                          onClick={closeCart}
                          className="truncate font-display text-base text-ink-900 hover:text-brand-500"
                        >
                          {line.name}
                        </Link>
                        <span className="shrink-0 text-sm font-semibold text-ink-900">
                          {formatPrice(line.unitPriceCents * line.quantity)}
                        </span>
                      </div>
                      {line.color && (
                        <p className="mt-0.5 text-xs text-ink-500">
                          {line.color}
                        </p>
                      )}
                      <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                        <div className="flex items-center rounded-full border border-ink-900/15">
                          <button
                            type="button"
                            onClick={() =>
                              setQuantity(
                                line.productId,
                                line.color,
                                line.quantity - 1,
                              )
                            }
                            className="p-2 text-ink-700 transition-colors hover:text-brand-500"
                            aria-label="Decrease quantity"
                          >
                            <MinusIcon className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold tabular-nums text-ink-900">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setQuantity(
                                line.productId,
                                line.color,
                                line.quantity + 1,
                              )
                            }
                            className="p-2 text-ink-700 transition-colors hover:text-brand-500"
                            aria-label="Increase quantity"
                          >
                            <PlusIcon className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(line.productId, line.color)}
                          className="text-xs font-medium text-ink-400 underline decoration-ink-300 underline-offset-4 transition-colors hover:text-ink-900"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <footer className="border-t border-ink-900/10 bg-cream-100/70 px-6 py-5">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-ink-500">Subtotal</span>
              <span className="font-display text-2xl text-ink-900">
                {formatPrice(subtotalCents)}
              </span>
            </div>
            <p className="mt-1 text-xs text-ink-400">
              Taxes and shipping calculated at checkout.
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-cream-50 transition-all hover:bg-brand-400 hover:text-ink-900"
            >
              Checkout <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={closeCart}
              className="mt-3 flex w-full items-center justify-center gap-1.5 text-xs font-medium text-ink-500 transition-colors hover:text-ink-900"
            >
              <LockIcon className="h-3.5 w-3.5" /> Continue shopping
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}
