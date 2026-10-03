import type { MetadataRoute } from "next";
import { statSync } from "node:fs";
import { allContentUrls, contentFile } from "@/lib/content";
import { SITE_BASE } from "@/lib/metadata";

/** Every content page + lastModified from its content file's mtime. */
export default function sitemap(): MetadataRoute.Sitemap {
  return allContentUrls()
    .filter((u) => u !== "/")
    .map((url) => {
      const file = contentFile(url);
      return {
        url: `${SITE_BASE}${url}`,
        lastModified: file ? statSync(file).mtime : new Date(),
        changeFrequency: "monthly" as const,
      };
    });
}
