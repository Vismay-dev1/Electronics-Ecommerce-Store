import Link from "next/link";
import { ArrowRight } from "./icons";
export function SiteFooter() {
  return (
    <footer className="bg-ink-900 text-white">
      <div className="mx-auto max-w-[1400px] px-6 py-14 md:px-14">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="brand-wordmark">
              <span className="brand-icon">l.</span> loyal
            </Link>
            <p className="mt-5 max-w-xs text-xs leading-6 text-white/60">
              Good tech. Great everyday.
              <br />
              Thoughtfully chosen electronics for the way you live.
            </p>
            <Link
              href="/shop"
              className="mt-5 inline-flex items-center gap-3 text-xs text-orange-300"
            >
              Your first upgrade, for less. Use LOYAL10{" "}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div>
            <h3 className="eyebrow text-white/40">Explore</h3>
            <div className="mt-5 flex flex-col gap-3 text-xs text-white/75">
              <Link href="/shop">All products</Link>
              <Link href="/shop?category=audio">Audio</Link>
              <Link href="/shop?category=compute">Computing</Link>
              <Link href="/shop?category=wearables">Wearables</Link>
              <Link href="/shop?category=play">Gaming</Link>
            </div>
          </div>
          <div>
            <h3 className="eyebrow text-white/40">Good to know</h3>
            <div className="mt-5 flex flex-col gap-3 text-xs text-white/75">
              <Link href="/help#shipping">Shipping information</Link>
              <Link href="/help#returns">Returns & warranty</Link>
              <Link href="/help#checkout">Checkout & payments</Link>
              <Link href="/help#privacy">Privacy</Link>
            </div>
          </div>
          <div>
            <h3 className="eyebrow text-white/40">Meet Loyal</h3>
            <div className="mt-5 flex flex-col gap-3 text-xs text-white/75">
              <Link href="/about">Our story</Link>
              <Link href="/shop?sort=newest">The latest arrivals</Link>
              <Link href="/shop?deals=true">A better deal</Link>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap justify-between gap-3 border-t border-white/10 pt-6 text-[10px] text-white/45">
          <p>© {new Date().getFullYear()} Loyal Electronics.</p>
          <p>Demo storefront · No live payments or fulfillment</p>
          <span>Thoughtfully chosen. Always Loyal.</span>
        </div>
      </div>
    </footer>
  );
}
