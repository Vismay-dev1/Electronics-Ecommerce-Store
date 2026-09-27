import type { Metadata } from "next";
export const metadata: Metadata = { title: "Shopping information" };
export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="section-kicker">HERE TO HELP</p>
      <h1 className="my-5 text-4xl font-semibold tracking-tight">
        Good to know.
      </h1>
      <p className="mb-12 leading-7 text-ink-500">
        Loyal is a demonstration storefront. Products, reviews and policies
        illustrate a shopping experience; no real payments or deliveries take
        place.
      </p>
      {[
        {
          id: "shipping",
          title: "Shipping",
          body: "The demo calculates standard shipping at ₹99, or free for discounted subtotals of ₹1,999 and up. Standard delivery is shown as 3–5 business days. Express is ₹199 and same-day is ₹499. These are illustrative options, not a delivery promise.",
        },
        {
          id: "returns",
          title: "Returns & warranty",
          body: "No real purchases are fulfilled through this demo, so no returns or warranty coverage are provided. A live store must publish its actual return window, eligibility, contact details and warranty terms before accepting purchases.",
        },
        {
          id: "checkout",
          title: "Checkout & payments",
          body: "Checkout is a demonstration only. Do not enter real card information. Orders and reviews require a connected PostgreSQL database. In catalog preview mode, you can browse and build a bag, but submissions are disabled.",
        },
        {
          id: "privacy",
          title: "Your information",
          body: "Your shopping bag is saved in local storage on your device. When a database is connected, submitted demo orders store contact and delivery details, and published reviews show the name you provide. Payment card details are not stored or charged. Use fictional information when testing.",
        },
      ].map((s) => (
        <section
          key={s.id}
          id={s.id}
          className="scroll-mt-28 border-t border-ink-200 py-8"
        >
          <h2 className="mb-3 text-2xl font-semibold">{s.title}</h2>
          <p className="text-sm leading-7 text-ink-500">{s.body}</p>
        </section>
      ))}
    </div>
  );
}
