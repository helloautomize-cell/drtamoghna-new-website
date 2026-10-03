import type { MetadataRoute } from "next";
import { statSync } from "node:fs";
import { allContentUrls, contentFile } from "@/lib/content";
import { SITE_BASE } from "@/lib/metadata";

/** Every public page + lastModified from its content file's mtime. */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries = allContentUrls()
    .filter((u) => u !== "/thank-you/")
    .map((url) => {
      const file = contentFile(url);
      return {
        url: `${SITE_BASE}${url}`,
        lastModified: file ? statSync(file).mtime : new Date(),
        changeFrequency: "monthly" as const,
      };
    });
  // llms.txt files are crawlable and listed here for AI/LLM discovery.
  for (const extra of ["/llms.txt", "/llms-full.txt"]) {
    entries.push({
      url: `${SITE_BASE}${extra}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
    });
  }
  return entries;
}
