import Link from "next/link";
import { SparkIcon } from "./icons";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "All products", href: "/shop" },
      { label: "Audio", href: "/shop?category=audio" },
      { label: "Laptops & Study", href: "/shop?category=compute" },
      { label: "Wearables", href: "/shop?category=wearables" },
      { label: "Gaming", href: "/shop?category=play" },
      { label: "Deals", href: "/shop?deals=true" },
    ],
  },
  {
    title: "Loyal Care",
    links: [
      { label: "3-year warranty", href: "/shop" },
      { label: "Free shipping over $75", href: "/shop" },
      { label: "30-day returns", href: "/shop" },
      { label: "Trade-in credit", href: "/shop" },
      { label: "Student pricing", href: "/shop" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our story", href: "/" },
      { label: "Repairability pledge", href: "/" },
      { label: "Recycling programme", href: "/" },
      { label: "Press", href: "/" },
      { label: "Careers", href: "/" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-ink-950 text-cream-100">
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-electric-500/15 blur-3xl" />

      <div className="relative mx-auto w-full max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl text-cream-50">Loyal</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-cream-100/40">
                Electronics
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream-100/60">
              We build electronics that families hand down and teenagers
              actually want. Repairable, warranty-backed, and priced like we
              want you back — because we do.
            </p>
            <form className="mt-8 flex max-w-sm items-center gap-2 rounded-full border border-cream-100/15 bg-cream-100/5 p-1.5 pl-4">
              <span className="flex-1 text-sm text-cream-100/50">
                Get 10% off your first order
              </span>
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-full bg-brand-400 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-900 transition-colors hover:bg-brand-300"
              >
                <SparkIcon className="h-3.5 w-3.5" /> Join
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="eyebrow text-cream-100/40">{column.title}</h3>
                <ul className="mt-5 flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-cream-100/75 transition-colors hover:text-brand-300"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-cream-100/10 pt-8 text-xs text-cream-100/40 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Loyal Electronics. Demo storefront.</p>
          <p className="flex flex-wrap items-center gap-4">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Amex</span>
            <span>Apple Pay</span>
            <span>Klarna</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
