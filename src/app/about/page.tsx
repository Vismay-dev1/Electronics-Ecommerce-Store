import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Our story" };
export default function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-24">
      <span className="section-kicker">A LITTLE ABOUT LOYAL</span>
      <h1 className="my-7 text-5xl font-semibold leading-tight tracking-tight">
        More of what matters.
        <br />
        <span className="text-brand-500">Less of everything else.</span>
      </h1>
      <div className="max-w-2xl space-y-6 text-base leading-8 text-ink-500">
        <p>
          Technology should fit into your life. Not the other way around. Loyal
          brings audio, computing, wearables, gaming and creative tools into one
          considered collection.
        </p>
        <p>
          Our idea is simple: make discovering your next everyday upgrade feel
          clear, enjoyable and a little more human. Useful details. Transparent
          prices. Room to explore.
        </p>
        <p className="text-sm">
          This is a concept brand and demonstration store. Catalog descriptions
          and reviews are sample content; no real purchases are fulfilled.
        </p>
      </div>
      <Link href="/shop" className="primary-button mt-9">
        Find your next favorite →
      </Link>
    </section>
  );
}
