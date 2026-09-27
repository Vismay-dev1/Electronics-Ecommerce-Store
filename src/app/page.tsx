import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import {
  ArrowRight,
  TruckIcon,
  ShieldIcon,
  RefreshIcon,
  SparkIcon,
} from "@/components/icons";
import { getBestsellers, getCollections, getNewArrivals } from "@/lib/queries";

export const dynamic = "force-dynamic";
const labels: Record<string, string> = {
  audio: "Audio",
  compute: "Laptops & tablets",
  wearables: "Wearables",
  play: "Gaming",
  vision: "TV & home",
  create: "Cameras & creators",
};
export default async function HomePage() {
  const [products, collections, arrivals] = await Promise.all([
    getBestsellers(4),
    getCollections(),
    getNewArrivals(4),
  ]);
  return (
    <div className="home-page">
      <section className="hero-shell">
        <div className="hero-copy">
          <span className="section-kicker">
            <i /> GOOD TECH. GREAT EVERYDAY.
          </span>
          <h1>
            A little more
            <br />
            extraordinary.<span>Every day.</span>
          </h1>
          <p>
            Big sound. Bright ideas. Better connected.
            <br />
            Discover thoughtfully chosen tech for the way you live.
          </p>
          <div className="hero-actions">
            <Link href="/shop" className="primary-button">
              Find your next favorite <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/shop?deals=true" className="text-link">
              Explore the deals <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="hero-footnote">
            <span className="mini-stars">★★★★★</span>
            <span>Made for your everyday. Built to go further.</span>
          </div>
        </div>
        <div className="hero-visual">
          <Image
            src="/images/hero-headphones.webp"
            alt="Graphite over-ear headphones in a softly lit studio"
            fill
            priority
            sizes="(max-width: 760px) 100vw, 60vw"
            className="object-cover"
          />
          <span className="hero-edition">THE EVERYDAY EDIT / 01</span>
          <div className="hero-product">
            <div>
              <span>LESS NOISE. MORE YOU.</span>
              <strong>Your world. Uninterrupted.</strong>
            </div>
            <Link href="/shop?category=audio" aria-label="Explore audio">
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          <span className="hero-index">
            <b>01</b> <i /> THE AUDIO EDIT
          </span>
        </div>
      </section>
      <div className="benefit-strip">
        {[
          {
            icon: TruckIcon,
            title: "Free shipping",
            copy: "On orders $75 and up",
          },
          {
            icon: RefreshIcon,
            title: "Easy to explore",
            copy: "Find the right fit for your day",
          },
          {
            icon: ShieldIcon,
            title: "Thoughtfully selected",
            copy: "Good design. Everyday value.",
          },
          {
            icon: SparkIcon,
            title: "A little extra, on us",
            copy: "Save 10% with LOYAL10",
          },
        ].map((p) => (
          <div key={p.title}>
            <p.icon className="h-5 w-5" />
            <span>
              <strong>{p.title}</strong>
              <small>{p.copy}</small>
            </span>
          </div>
        ))}
      </div>
      <section className="store-section category-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">FIND YOUR THING</span>
            <h2>Good tech, in every category.</h2>
          </div>
          <Link href="/shop" className="text-link">
            Shop all products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="category-grid">
          {["audio", "compute", "wearables", "play", "vision", "create"].map(
            (cat) => {
              const c = collections.find((c) => c.category === cat);
              return (
                c && (
                  <Link
                    className="category-tile"
                    href={`/shop?category=${cat}`}
                    key={cat}
                  >
                    <div className="category-photo">
                      <Image
                        src={c.imageUrl}
                        alt={labels[cat]}
                        fill
                        sizes="(max-width: 760px) 45vw, 16vw"
                        className="object-cover"
                      />
                    </div>
                    <span>
                      {labels[cat]}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                    <small>{c.productCount} products</small>
                  </Link>
                )
              );
            },
          )}
        </div>
      </section>
      <section className="store-section best-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">THE CROWD FAVORITES</span>
            <h2>Popular for a reason.</h2>
            <p>The everyday upgrades you’ll wish you found sooner.</p>
          </div>
          <Link href="/shop?sort=reviews" className="text-link">
            Explore bestsellers <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="home-products">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
      <section className="editorial-banner">
        <div>
          <span className="section-kicker">LESS SCROLLING. MORE LIVING.</span>
          <h2>
            Small upgrades.
            <br />
            Big difference.
          </h2>
          <p>
            From your morning playlist to your next big idea.
            <br />
            Make room for tech that makes life better.
          </p>
          <Link href="/shop?category=compute,create" className="primary-button">
            Upgrade your everyday <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="editorial-image">
          <Image
            src="/images/workspace.webp"
            alt="Minimal workspace with a laptop and accessories"
            fill
            sizes="(max-width:760px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </section>
      <section className="store-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">FRESH FINDS</span>
            <h2>Meet your next upgrade.</h2>
          </div>
          <Link href="/shop?sort=newest" className="text-link">
            New arrivals <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="home-products">
          {arrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
      <section className="brand-note">
        <span className="brand-symbol">l.</span>
        <div>
          <span className="section-kicker">ALWAYS ON YOUR SIDE</span>
          <h2>
            Tech comes and goes.
            <br />
            Good choices stay with you.
          </h2>
          <p>
            We’re Loyal. A considered collection of electronics for people, not
            just specs.
            <br />
            Less overwhelm. More of what matters.
          </p>
        </div>
        <Link href="/about" className="text-link">
          A little about us <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
