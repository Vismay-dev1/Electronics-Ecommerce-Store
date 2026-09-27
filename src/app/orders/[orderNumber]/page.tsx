import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowRight,
  CheckIcon,
  RefreshIcon,
  ShieldIcon,
  TruckIcon,
} from "@/components/icons";
import { getOrderByNumber } from "@/lib/queries";
import { SHIPPING_METHODS, formatPrice } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false },
};

type PageProps = { params: Promise<{ orderNumber: string }> };

export default async function OrderPage({ params }: PageProps) {
  const { orderNumber } = await params;
  const result = await getOrderByNumber(orderNumber);
  if (!result) notFound();

  const { order, items } = result;
  const method = SHIPPING_METHODS.find((item) => item.id === order.shippingMethod);
  const eta = new Date(order.createdAt);
  eta.setDate(eta.getDate() + (order.shippingMethod === "sameday" ? 1 : 3));

  return (
    <div className="mx-auto w-full max-w-[1000px] px-5 py-14 md:px-10 md:py-20">
      <div className="animate-fade-up text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <svg viewBox="0 0 32 32" className="h-8 w-8 text-emerald-700">
            <path
              d="m8 17 6 6 12-13"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-draw-check"
            />
          </svg>
        </span>
        <p className="eyebrow mt-7 text-brand-500">Order {order.status}</p>
        <h1 className="mt-4 font-display text-4xl leading-[1.02] text-ink-900 md:text-5xl">
          Thank you, {order.fullName.split(" ")[0]} — your demo order is saved
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-ink-600">
          This demo order was saved for{" "}
          <strong className="font-semibold text-ink-900">{order.email}</strong>.
          No email is sent, payment taken, or shipment created.
        </p>
        <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 font-mono text-sm break-all text-cream-50">
          {order.orderNumber}
        </p>
      </div>

      <div className="mt-14 grid gap-8 md:grid-cols-3">
        {[
          {
            icon: TruckIcon,
            title: "Illustrative delivery date",
            body: eta.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            }),
            note: method?.label ?? "Standard",
          },
          {
            icon: ShieldIcon,
            title: "Payment",
            body: "No charge taken",
            note: "Demonstration only",
          },
          {
            icon: RefreshIcon,
            title: "Fulfillment",
            body: "No shipment created",
            note: "Explore more at /help",
          },
        ].map((card, index) => (
          <div
            key={card.title}
            className="animate-fade-up rounded-2xl border border-ink-900/10 bg-cream-100 p-6"
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <card.icon className="h-5 w-5 text-brand-500" />
            <p className="mt-4 text-[11px] uppercase tracking-[0.14em] text-ink-400">
              {card.title}
            </p>
            <p className="mt-1 font-display text-xl text-ink-900">{card.body}</p>
            <p className="mt-1 text-xs text-ink-500">{card.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <section className="rounded-3xl border border-ink-900/10 p-6 md:p-8">
          <h2 className="font-display text-2xl text-ink-900">
            {items.length} item{items.length === 1 ? "" : "s"} in your demo order
          </h2>
          <ul className="mt-6 flex flex-col divide-y divide-ink-900/10">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 py-5 first:pt-0">
                <Link
                  href={`/product/${item.slug}`}
                  className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-cream-100"
                >
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  )}
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/product/${item.slug}`}
                    className="font-display text-lg text-ink-900 hover:text-brand-500"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-xs text-ink-500">
                    Qty {item.quantity}
                  </p>
                </div>
                <span className="text-sm font-semibold text-ink-900">
                  {formatPrice(item.unitPriceCents * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-6">
          <div className="rounded-3xl border border-ink-900/10 p-6 md:p-7">
            <h2 className="font-display text-xl text-ink-900">Totals</h2>
            <dl className="mt-5 flex flex-col gap-2.5 text-sm">
              <div className="flex justify-between text-ink-600">
                <dt>Subtotal</dt>
                <dd className="text-ink-900">
                  {formatPrice(order.subtotalCents)}
                </dd>
              </div>
              {order.discountCents > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <dt>Discount {order.promoCode && `(${order.promoCode})`}</dt>
                  <dd>−{formatPrice(order.discountCents)}</dd>
                </div>
              )}
              <div className="flex justify-between text-ink-600">
                <dt>Shipping</dt>
                <dd className="text-ink-900">
                  {order.shippingCents === 0
                    ? "Free"
                    : formatPrice(order.shippingCents)}
                </dd>
              </div>
              <div className="flex justify-between text-ink-600">
                <dt>Tax</dt>
                <dd className="text-ink-900">
                  {formatPrice(order.taxCents)}
                </dd>
              </div>
              <div className="mt-2 flex items-baseline justify-between border-t border-ink-900/10 pt-4">
                <dt className="font-semibold text-ink-900">Total paid</dt>
                <dd className="font-display text-2xl text-ink-900">
                  {formatPrice(order.totalCents)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-3xl border border-ink-900/10 p-6 md:p-7">
            <h2 className="font-display text-xl text-ink-900">
              Delivering to
            </h2>
            <address className="mt-4 text-sm not-italic leading-relaxed text-ink-600">
              <span className="block font-medium text-ink-900">
                {order.fullName}
              </span>
              {order.address1}
              {order.address2 ? `, ${order.address2}` : ""}
              <br />
              {order.city}
              {order.region ? `, ${order.region}` : ""}{" "}
              {order.postalCode}
              <br />
              {order.country}
            </address>
            {order.giftNote && (
              <p className="mt-5 rounded-xl bg-brand-50 p-4 text-xs italic leading-relaxed text-ink-700">
                “{order.giftNote}”
              </p>
            )}
          </div>
        </section>
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-3">
        <Link
          href="/shop"
          className="group inline-flex items-center gap-2 rounded-full bg-ink-900 px-7 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-cream-50 transition-colors hover:bg-brand-400 hover:text-ink-900"
        >
          Keep shopping
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-ink-900/20 px-7 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-ink-900 transition-colors hover:border-ink-900"
        >
          <CheckIcon className="h-4 w-4" /> Back to home
        </Link>
      </div>
    </div>
  );
}
