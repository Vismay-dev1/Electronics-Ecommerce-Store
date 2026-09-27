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
  return <CheckoutFlow />;
}
