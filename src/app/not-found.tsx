import Link from "next/link";
import { ArrowRight, SearchIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-5 py-24 text-center md:py-32">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cream-200">
        <SearchIcon className="h-7 w-7 text-ink-400" />
      </span>
      <p className="eyebrow mt-8 text-brand-500">Error 404</p>
      <h1 className="mt-4 font-display text-4xl leading-[1.02] text-ink-900 md:text-5xl">
        This shelf is empty
      </h1>
      <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-600">
        The page you were looking for has moved, sold out, or never existed.
        Let&apos;s get you back to the good stuff.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Link
          href="/shop"
          className="group inline-flex items-center gap-2 rounded-full bg-ink-900 px-7 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-cream-50 transition-colors hover:bg-brand-400 hover:text-ink-900"
        >
          Browse the store
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-ink-900/20 px-7 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-ink-900 transition-colors hover:border-ink-900"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
