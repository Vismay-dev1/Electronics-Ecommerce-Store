import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CartProvider } from "@/components/cart-provider";
import { CartDrawer } from "@/components/cart-drawer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Loyal — Good tech. Great everyday.",
    template: "%s · Loyal Electronics",
  },
  description:
    "Premium audio, laptops, wearables and home cinema built for teenagers and families. Free standard shipping on orders $75 and up.",
  keywords: [
    "electronics store",
    "headphones",
    "family tablets",
    "student laptops",
    "smartwatch",
    "home cinema",
  ],
  openGraph: {
    title: "Loyal — Good tech. Great everyday.",
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

      </head>
      <body className="min-h-screen bg-cream-50 text-ink-900 antialiased">
        <CartProvider>
          <a href="#main-content" className="skip-link">Skip to content</a>
          <SiteHeader />
          <main id="main-content">{children}</main>
          <SiteFooter />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
