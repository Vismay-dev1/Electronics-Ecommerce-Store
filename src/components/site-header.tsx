"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./cart-provider";
import {
  CartIcon,
  CloseIcon,
  MenuIcon,
  SearchIcon,
  SparkIcon,
} from "./icons";

const NAV_LINKS = [
  { href: "/shop", label: "All products" },
  { href: "/shop?category=audio", label: "Audio" },
  { href: "/shop?category=compute", label: "Study & Create" },
  { href: "/shop?category=vision", label: "Movie Night" },
  { href: "/shop?category=play", label: "Gaming" },
  { href: "/shop?deals=true", label: "Deals" },
];

const TICKER = [
  "Free 2-day shipping over $75",
  "3-year Loyal Care on every device",
  "30-day no-questions returns",
  "Student & family bundles save up to 18%",
  "Trade in last year's tech, get credit",
];

export function SiteHeader() {
  const { count, openCart, hydrated } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      setMenuOpen(false);
      setSearchOpen(false);
    });
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/shop?q=${encodeURIComponent(trimmed)}`);
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <>
      <div className="relative overflow-hidden border-b border-ink-900/10 bg-ink-950 text-cream-100">
        <div className="flex w-max animate-[marquee_38s_linear_infinite] items-center gap-10 py-2.5 pr-10">
          {[...TICKER, ...TICKER].map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="flex items-center gap-2 whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.18em] text-cream-100/70"
            >
              <SparkIcon className="h-3 w-3 text-brand-300" />
              {item}
            </span>
          ))}
        </div>
      </div>

      <header
        className={`sticky top-0 z-40 transition-all duration-500 ${
          scrolled
            ? "border-b border-ink-900/10 bg-cream-50/85 backdrop-blur-xl"
            : "border-b border-transparent bg-cream-50"
        }`}
      >
        <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between gap-6 px-5 md:h-20 md:px-10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="-ml-1.5 rounded-full p-2 text-ink-800 transition-colors hover:bg-ink-900/5 lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
            <Link href="/" className="group flex items-baseline gap-2">
              <span className="font-display text-2xl leading-none tracking-tight text-ink-900 md:text-[26px]">
                Loyal
              </span>
              <span className="hidden text-[10px] font-semibold uppercase tracking-[0.32em] text-ink-400 transition-colors group-hover:text-brand-500 sm:block">
                Electronics
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="link-underline text-sm font-medium text-ink-700 transition-colors hover:text-ink-950"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              className="rounded-full p-2.5 text-ink-800 transition-colors hover:bg-ink-900/5"
              aria-label="Search products"
            >
              {searchOpen ? (
                <CloseIcon className="h-5 w-5" />
              ) : (
                <SearchIcon className="h-5 w-5" />
              )}
            </button>
            <Link
              href="/shop"
              className="hidden rounded-full border border-ink-900/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-800 transition-all hover:border-ink-900 hover:bg-ink-900 hover:text-cream-50 md:inline-flex"
            >
              Shop
            </Link>
            <button
              type="button"
              onClick={openCart}
              className="relative flex items-center gap-2 rounded-full bg-ink-900 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-cream-50 transition-colors hover:bg-brand-400 hover:text-ink-900"
              aria-label="Open cart"
            >
              <CartIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Bag</span>
              <span className="min-w-4 tabular-nums">
                {hydrated ? count : 0}
              </span>
            </button>
          </div>
        </div>

        <div
          className={`overflow-hidden border-t border-ink-900/10 bg-cream-50 transition-[max-height,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            searchOpen ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <form
            onSubmit={submitSearch}
            className="mx-auto flex w-full max-w-[1400px] items-center gap-3 px-5 py-4 md:px-10"
          >
            <SearchIcon className="h-5 w-5 text-ink-400" />
            <input
              autoFocus={searchOpen}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search headphones, laptops, projectors…"
              className="flex-1 bg-transparent text-base text-ink-900 placeholder:text-ink-400 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-ink-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-cream-50"
            >
              Search
            </button>
          </form>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <div
          className={`absolute inset-0 bg-ink-950/50 backdrop-blur-sm transition-opacity duration-400 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`absolute inset-y-0 left-0 flex w-[84%] max-w-sm flex-col bg-cream-50 shadow-lift transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-ink-900/10 px-6 py-5">
            <span className="font-display text-2xl text-ink-900">Loyal</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="rounded-full p-2 text-ink-700 hover:bg-ink-900/5"
              aria-label="Close menu"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-4 py-3.5 font-display text-xl text-ink-900 transition-colors hover:bg-cream-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-ink-900/10 px-6 py-5 text-xs leading-relaxed text-ink-500">
            Free 2-day shipping over $75 · 3-year Loyal Care on every device.
          </div>
        </div>
      </div>
    </>
  );
}
