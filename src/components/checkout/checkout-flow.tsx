"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useCart } from "@/components/cart-provider";
import {
  ArrowRight,
  CheckIcon,
  LockIcon,
  ShieldIcon,
  TruckIcon,
} from "@/components/icons";
import { discountFor, lookupPromo, normaliseCode } from "@/lib/promo";
import {
  SHIPPING_METHODS,
  TAX_RATE,
  formatPrice,
  type ShippingMethodId,
} from "@/lib/types";

const STEPS = ["Contact", "Delivery", "Payment"] as const;

const FIELD =
  "w-full rounded-xl border border-ink-900/15 bg-cream-50 px-4 py-3.5 text-sm text-ink-900 placeholder:text-ink-300 transition-colors focus:border-ink-900 focus:outline-none";
const LABEL =
  "text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-500";

export function CheckoutFlow() {
  const { lines, subtotalCents, clearCart, hydrated, setQuantity } = useCart();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodId>(
    "standard",
  );
  const [promoInput, setPromoInput] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const totals = useMemo(() => {
    const discountCents = discountFor(promoCode, subtotalCents);
    const discounted = Math.max(0, subtotalCents - discountCents);
    const method = SHIPPING_METHODS.find((item) => item.id === shippingMethod);
    const shippingCents =
      method?.freeOverCents !== null &&
      method?.freeOverCents !== undefined &&
      discounted >= method.freeOverCents
        ? 0
        : (method?.priceCents ?? 0);
    const taxCents = Math.round(discounted * TAX_RATE);
    return {
      discountCents,
      shippingCents,
      taxCents,
      totalCents: discounted + shippingCents + taxCents,
    };
  }, [promoCode, subtotalCents, shippingMethod]);

  const applyPromo = () => {
    const code = normaliseCode(promoInput);
    if (lookupPromo(code)) {
      setPromoCode(code);
      setPromoError(null);
    } else {
      setPromoCode("");
      setPromoError("That code isn't valid right now.");
    }
  };

  const goToStep = (target: number) => {
    setError(null);
    setStep(Math.max(0, Math.min(2, target)));
  };

  const validateStep = (form: HTMLFormElement) => {
    const data = new FormData(form);
    if (step === 0) {
      const email = String(data.get("email") ?? "");
      const fullName = String(data.get("fullName") ?? "");
      const address1 = String(data.get("address1") ?? "");
      const city = String(data.get("city") ?? "");
      const postalCode = String(data.get("postalCode") ?? "");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
        return "Please enter a valid email address.";
      if (fullName.trim().length < 2) return "Please enter your full name.";
      if (address1.trim().length < 4) return "Please enter your street address.";
      if (city.trim().length < 2) return "Please enter your city.";
      if (postalCode.trim().length < 3) return "Please enter a postal code.";
    }
    if (step === 2) {
      const card = String(data.get("card") ?? "").replace(/\s+/g, "");
      const expiry = String(data.get("expiry") ?? "");
      const cvc = String(data.get("cvc") ?? "");
      if (card.length < 15) return "Please enter a valid card number.";
      if (!/^\d{2}\/\d{2}$/.test(expiry)) return "Expiry should look like 04/28.";
      if (cvc.length < 3) return "Please enter the 3-digit security code.";
    }
    return null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const validationError = validateStep(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (step < 2) {
      goToStep(step + 1);
      return;
    }

    const data = new FormData(form);
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          fullName: data.get("fullName"),
          address1: data.get("address1"),
          address2: data.get("address2"),
          city: data.get("city"),
          region: data.get("region"),
          postalCode: data.get("postalCode"),
          country: data.get("country"),
          phone: data.get("phone"),
          giftNote: data.get("giftNote"),
          promoCode,
          shippingMethod,
          lines: lines.map((line) => ({
            productId: line.productId,
            quantity: line.quantity,
            color: line.color,
          })),
        }),
      });
      const payload = (await response.json()) as {
        orderNumber?: string;
        error?: string;
      };
      if (!response.ok || !payload.orderNumber) {
        setError(payload.error ?? "We couldn't place that order.");
        return;
      }
      clearCart();
      router.push(`/orders/${payload.orderNumber}`);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (hydrated && lines.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-5 py-24 text-center md:py-32">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream-200">
          <TruckIcon className="h-7 w-7 text-ink-400" />
        </div>
        <h1 className="mt-6 font-display text-3xl text-ink-900 md:text-4xl">
          There&apos;s nothing to check out yet
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-500">
          Add a device or two to your bag and come back — we&apos;ll keep them
          waiting.
        </p>
        <Link
          href="/shop"
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-ink-900 px-7 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-cream-50 transition-colors hover:bg-brand-400 hover:text-ink-900"
        >
          Browse the store
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 py-10 md:px-10 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <nav className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-ink-400">
            <Link href="/" className="transition-colors hover:text-ink-900">
              Home
            </Link>
            <span>/</span>
            <span className="text-ink-700">Checkout</span>
          </nav>
          <h1 className="mt-5 font-display text-4xl leading-none text-ink-900 md:text-5xl">
            Secure checkout
          </h1>
        </div>
        <p className="flex items-center gap-2 text-xs text-ink-500">
          <LockIcon className="h-4 w-4 text-brand-500" /> Encrypted · demo store,
          no real payment taken
        </p>
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
        <form onSubmit={handleSubmit} className="order-2 lg:order-1">
          {/* Step indicator */}
          <ol className="mb-10 flex items-center gap-3">
            {STEPS.map((label, index) => (
              <li key={label} className="flex flex-1 items-center gap-3">
                <button
                  type="button"
                  onClick={() => index < step && goToStep(index)}
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    index < step
                      ? "bg-emerald-600 text-white"
                      : index === step
                        ? "bg-ink-900 text-cream-50"
                        : "bg-cream-200 text-ink-400"
                  }`}
                >
                  {index < step ? <CheckIcon className="h-4 w-4" /> : index + 1}
                </button>
                <span
                  className={`text-xs font-semibold uppercase tracking-[0.12em] ${
                    index === step ? "text-ink-900" : "text-ink-400"
                  }`}
                >
                  {label}
                </span>
                {index < STEPS.length - 1 && (
                  <span className="h-px flex-1 bg-ink-900/10" />
                )}
              </li>
            ))}
          </ol>

          {/* ------------------------------------------------------- STEP 1 */}
          {step === 0 && (
            <div className="animate-fade-up space-y-8">
              <section>
                <h2 className="font-display text-2xl text-ink-900">
                  Contact &amp; delivery
                </h2>
                <p className="mt-2 text-sm text-ink-500">
                  We&apos;ll email your receipt and tracking link here.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 sm:col-span-2">
                    <span className={LABEL}>Email address</span>
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@household.com"
                      className={FIELD}
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-2 sm:col-span-2">
                    <span className={LABEL}>Full name</span>
                    <input
                      name="fullName"
                      autoComplete="name"
                      placeholder="Alex Morgan"
                      className={FIELD}
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-2 sm:col-span-2">
                    <span className={LABEL}>Street address</span>
                    <input
                      name="address1"
                      autoComplete="address-line1"
                      placeholder="1420 Maple Street"
                      className={FIELD}
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-2 sm:col-span-2">
                    <span className={LABEL}>Apartment, suite (optional)</span>
                    <input
                      name="address2"
                      autoComplete="address-line2"
                      placeholder="Apt 3B"
                      className={FIELD}
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className={LABEL}>City</span>
                    <input
                      name="city"
                      autoComplete="address-level2"
                      placeholder="Columbus"
                      className={FIELD}
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className={LABEL}>State / region</span>
                    <input
                      name="region"
                      autoComplete="address-level1"
                      placeholder="Ohio"
                      className={FIELD}
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className={LABEL}>Postal code</span>
                    <input
                      name="postalCode"
                      autoComplete="postal-code"
                      placeholder="43215"
                      className={FIELD}
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className={LABEL}>Country</span>
                    <select
                      name="country"
                      defaultValue="United States"
                      className={FIELD}
                    >
                      {["United States", "Canada", "United Kingdom", "Ireland"].map(
                        (country) => (
                          <option key={country}>{country}</option>
                        ),
                      )}
                    </select>
                  </label>
                  <label className="flex flex-col gap-2 sm:col-span-2">
                    <span className={LABEL}>Phone (for delivery updates)</span>
                    <input
                      name="phone"
                      autoComplete="tel"
                      placeholder="+1 614 555 0142"
                      className={FIELD}
                    />
                  </label>
                </div>
              </section>

              <section>
                <h2 className="font-display text-2xl text-ink-900">
                  Gift note (optional)
                </h2>
                <p className="mt-2 text-sm text-ink-500">
                  We&apos;ll print this on a card and leave the prices off the
                  packing slip.
                </p>
                <textarea
                  name="giftNote"
                  rows={3}
                  maxLength={280}
                  placeholder="Happy birthday, Maya — love Mum & Dad"
                  className={`${FIELD} mt-5 resize-none`}
                />
              </section>
            </div>
          )}

          {/* ------------------------------------------------------- STEP 2 */}
          {step === 1 && (
            <div className="animate-fade-up space-y-8">
              <section>
                <h2 className="font-display text-2xl text-ink-900">
                  How fast do you need it?
                </h2>
                <p className="mt-2 text-sm text-ink-500">
                  All options are fully tracked with SMS updates.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  {SHIPPING_METHODS.map((method) => {
                    const free =
                      method.freeOverCents !== null &&
                      Math.max(0, subtotalCents - totals.discountCents) >=
                        method.freeOverCents;
                    const selected = shippingMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setShippingMethod(method.id)}
                        className={`flex items-center justify-between gap-5 rounded-2xl border px-5 py-4 text-left transition-all duration-300 ${
                          selected
                            ? "border-ink-900 bg-cream-100"
                            : "border-ink-900/15 hover:border-ink-900/40"
                        }`}
                      >
                        <span className="flex items-center gap-4">
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                              selected
                                ? "border-ink-900"
                                : "border-ink-300"
                            }`}
                          >
                            {selected && (
                              <span className="h-2.5 w-2.5 rounded-full bg-ink-900" />
                            )}
                          </span>
                          <span>
                            <span className="block text-sm font-semibold text-ink-900">
                              {method.label}
                            </span>
                            <span className="mt-0.5 block text-xs text-ink-500">
                              {method.detail}
                            </span>
                          </span>
                        </span>
                        <span className="shrink-0 text-sm font-semibold text-ink-900">
                          {free ? (
                            <span className="text-emerald-700">Free</span>
                          ) : (
                            formatPrice(method.priceCents)
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-2xl bg-cream-100 p-6">
                <h3 className="font-display text-lg text-ink-900">
                  Every order includes
                </h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {[
                    { icon: TruckIcon, text: "Tracked delivery with SMS updates" },
                    { icon: ShieldIcon, text: "3-year Loyal Care warranty" },
                    { icon: CheckIcon, text: "30-day free returns, we pay postage" },
                  ].map((item) => (
                    <li
                      key={item.text}
                      className="flex items-center gap-3 text-sm text-ink-600"
                    >
                      <item.icon className="h-4 w-4 shrink-0 text-brand-500" />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          )}

          {/* ------------------------------------------------------- STEP 3 */}
          {step === 2 && (
            <div className="animate-fade-up space-y-8">
              <section>
                <h2 className="font-display text-2xl text-ink-900">Payment</h2>
                <p className="mt-2 text-sm text-ink-500">
                  This is a demo storefront — use any 16 digits you like.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 sm:col-span-2">
                    <span className={LABEL}>Card number</span>
                    <input
                      name="card"
                      inputMode="numeric"
                      placeholder="4242 4242 4242 4242"
                      defaultValue="4242 4242 4242 4242"
                      className={FIELD}
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className={LABEL}>Expiry</span>
                    <input
                      name="expiry"
                      placeholder="04/28"
                      defaultValue="04/28"
                      className={FIELD}
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className={LABEL}>Security code</span>
                    <input
                      name="cvc"
                      inputMode="numeric"
                      placeholder="123"
                      defaultValue="123"
                      className={FIELD}
                      required
                    />
                  </label>
                </div>
              </section>

              <section className="rounded-2xl border border-ink-900/10 p-6">
                <h3 className="font-display text-lg text-ink-900">
                  Review your order
                </h3>
                <ul className="mt-5 flex flex-col divide-y divide-ink-900/10">
                  {lines.map((line) => (
                    <li
                      key={`${line.productId}-${line.color ?? "d"}`}
                      className="flex items-center justify-between gap-4 py-3 text-sm"
                    >
                      <span className="min-w-0 flex-1 truncate text-ink-800">
                        {line.name}
                        {line.color ? ` · ${line.color}` : ""}
                        <span className="text-ink-400"> × {line.quantity}</span>
                      </span>
                      <span className="font-semibold text-ink-900">
                        {formatPrice(line.unitPriceCents * line.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          )}

          {error && (
            <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={() => goToStep(step - 1)}
                className="rounded-full border border-ink-900/15 px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-ink-800 transition-colors hover:border-ink-900"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-cream-50 transition-colors hover:bg-brand-400 hover:text-ink-900 disabled:opacity-60 sm:flex-none"
            >
              {step < 2 ? (
                <>
                  Continue to {STEPS[step + 1]}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              ) : submitting ? (
                "Placing your order…"
              ) : (
                <>Place order · {formatPrice(totals.totalCents)}</>
              )}
            </button>
          </div>
        </form>

        {/* -------------------------------------------------- ORDER SUMMARY */}
        <aside className="order-1 lg:order-2">
          <div className="sticky top-28 rounded-3xl border border-ink-900/10 bg-cream-100 p-6 md:p-7">
            <h2 className="font-display text-xl text-ink-900">Order summary</h2>

            <ul className="mt-5 flex max-h-72 flex-col gap-4 overflow-y-auto pr-1">
              {lines.map((line) => (
                <li
                  key={`${line.productId}-${line.color ?? "d"}`}
                  className="flex gap-3.5"
                >
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-cream-200">
                    <Image
                      src={line.imageUrl}
                      alt={line.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                    <span className="absolute -right-0 -top-0 flex h-5 w-5 items-center justify-center rounded-full bg-ink-900 text-[10px] font-semibold text-cream-50">
                      {line.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-900">
                      {line.name}
                    </p>
                    {line.color && (
                      <p className="text-xs text-ink-500">{line.color}</p>
                    )}
                    <div className="mt-1 flex items-center gap-3">
                      <span className="text-sm font-semibold text-ink-900">
                        {formatPrice(line.unitPriceCents * line.quantity)}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity(
                            line.productId,
                            line.color,
                            line.quantity - 1,
                          )
                        }
                        className="text-[11px] text-ink-400 underline decoration-ink-300 underline-offset-2 transition-colors hover:text-ink-900"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t border-ink-900/10 pt-5">
              <div className="flex gap-2">
                <input
                  value={promoInput}
                  onChange={(event) => setPromoInput(event.target.value)}
                  placeholder="Promo code"
                  className="flex-1 rounded-xl border border-ink-900/15 bg-cream-50 px-4 py-3 text-sm uppercase tracking-[0.06em] text-ink-900 placeholder:normal-case placeholder:tracking-normal placeholder:text-ink-300 focus:border-ink-900 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={applyPromo}
                  className="rounded-xl bg-ink-900 px-5 text-xs font-semibold uppercase tracking-[0.12em] text-cream-50 transition-colors hover:bg-brand-500"
                >
                  Apply
                </button>
              </div>
              {promoError && (
                <p className="mt-2 text-xs text-red-600">{promoError}</p>
              )}
              {promoCode && (
                <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                  <CheckIcon className="h-3.5 w-3.5" />
                  {lookupPromo(promoCode)?.label} applied — try LOYAL10,
                  FAMILY15 or STUDENT20
                </p>
              )}
              {!promoCode && !promoError && (
                <p className="mt-2 text-xs text-ink-400">
                  Try <strong className="text-ink-600">LOYAL10</strong> for 10%
                  off your order.
                </p>
              )}
            </div>

            <dl className="mt-6 flex flex-col gap-2.5 border-t border-ink-900/10 pt-5 text-sm">
              <div className="flex justify-between text-ink-600">
                <dt>Subtotal</dt>
                <dd className="text-ink-900">
                  {formatPrice(subtotalCents)}
                </dd>
              </div>
              {totals.discountCents > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <dt>Discount</dt>
                  <dd>−{formatPrice(totals.discountCents)}</dd>
                </div>
              )}
              <div className="flex justify-between text-ink-600">
                <dt>Shipping</dt>
                <dd className="text-ink-900">
                  {totals.shippingCents === 0
                    ? "Free"
                    : formatPrice(totals.shippingCents)}
                </dd>
              </div>
              <div className="flex justify-between text-ink-600">
                <dt>Estimated tax</dt>
                <dd className="text-ink-900">{formatPrice(totals.taxCents)}</dd>
              </div>
              <div className="mt-3 flex items-baseline justify-between border-t border-ink-900/10 pt-4">
                <dt className="text-sm font-semibold text-ink-900">Total</dt>
                <dd className="font-display text-2xl text-ink-900">
                  {formatPrice(totals.totalCents)}
                </dd>
              </div>
            </dl>

            <p className="mt-5 flex items-start gap-2 text-[11px] leading-relaxed text-ink-500">
              <ShieldIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
              Your card is never charged in this demo. Data you enter stays in
              your own database.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
