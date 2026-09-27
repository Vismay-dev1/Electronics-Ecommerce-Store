import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CartProvider } from "@/components/cart-provider";
import { CartDrawer } from "@/components/cart-drawer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Loyal Electronics — Tech for Youth & Families",
    template: "%s · Loyal Electronics",
  },
  description:
    "Premium audio, laptops, wearables and home cinema built for teenagers and families. Free 2-day shipping over $75 and a 3-year Loyal Care warranty.",
  keywords: [
    "electronics store",
    "headphones",
    "family tablets",
    "student laptops",
    "smartwatch",
    "home cinema",
  ],
  openGraph: {
    title: "Loyal Electronics — Tech for Youth & Families",
    description:
      "Premium audio, laptops, wearables and home cinema built for teenagers and families.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://images.pexels.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..600&family=Inter:wght@300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-cream-50 text-ink-900 antialiased">
        <CartProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
