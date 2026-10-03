import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  if (process.env.SITE_INDEXABLE !== "true") {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: siteConfig.siteUrl ? `${siteConfig.siteUrl}/sitemap.xml` : undefined,
  };
}
