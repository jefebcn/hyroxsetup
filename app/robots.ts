import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Cart/checkout have nothing to index.
      disallow: ["/cart", "/checkout/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
