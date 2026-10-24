import type { MetadataRoute } from "next";
import { statSync } from "node:fs";
import { allContentUrls, contentFile, getPage } from "@/lib/content";
import { SITE_BASE } from "@/lib/metadata";

/** Every public page; lastModified from frontmatter dateModified, else file mtime. */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries = allContentUrls()
    .filter((u) => u !== "/thank-you/")
    .map((url) => {
      const file = contentFile(url);
      let lastMod: Date | undefined;
      const modified = getPage(url).frontmatter.dateModified;
      if (modified && /^\d{4}-\d{2}-\d{2}$/.test(modified)) lastMod = new Date(modified);
      return {
        url: `${SITE_BASE}${url}`,
        lastModified: lastMod || (file ? statSync(file).mtime : new Date()),
        changeFrequency: "monthly" as const,
      };
    });
  return entries;
}
