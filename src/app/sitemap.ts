export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { CATEGORIES, PRODUCTS } from "@/lib/catalog";
import { FEATURES } from "@/lib/features";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/sale",
    "/coupons",
    "/stores",
    "/help",
    "/contact",
    "/login",
    "/guide/shipping",
    "/guide/returns",
    "/legal/tokushoho",
    "/legal/privacy",
    "/legal/terms",
  ];

  const urls: MetadataRoute.Sitemap = [
    ...staticPaths.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.6 })),
    ...CATEGORIES.map((c) => ({ url: `${SITE_URL}/category/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...FEATURES.map((f) => ({ url: `${SITE_URL}/features/${f.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...PRODUCTS.map((p) => ({ url: `${SITE_URL}/product/${p.id}`, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];

  return urls;
}
