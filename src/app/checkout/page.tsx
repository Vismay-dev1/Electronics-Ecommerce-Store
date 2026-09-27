import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/checkout/checkout-flow";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your Loyal Electronics order — contact, delivery and payment in three quick steps.",
  robots: { index: false },
};

export default function CheckoutPage() {
  return <>{!process.env.DATABASE_URL && <div role="status" className="border-b border-orange-200 bg-orange-50 px-6 py-4 text-center text-sm text-orange-900">Catalog preview: explore your bag and checkout steps. Orders are unavailable until a database is connected. Do not enter real payment details.</div>}<CheckoutFlow /></>;
}
