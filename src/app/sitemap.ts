import type { MetadataRoute } from "next";
import { getAllProductSlugs } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://loyal-electronics.example.com";
  let slugs: { slug: string }[] = [];
  try {
    slugs = await getAllProductSlugs();
  } catch {
    slugs = [];
  }

  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/shop`, changeFrequency: "daily", priority: 0.9 },
    ...slugs.map((item) => ({
      url: `${base}/product/${item.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
