/**
 * metadata.ts · Shared generateMetadata helper for content pages.
 * Canonical from NEXT_PUBLIC_SITE_URL (fallback: the Vercel review URL),
 * OG defaults point at the generated /og image route.
 */
import type { Metadata } from "next";
import { siteConfig } from "./site-config";

export const SITE_BASE =
  siteConfig.siteUrl || "https://drtamoghna-new-website.vercel.app";

export function pageMeta({
  title,
  description,
  url,
  noindex = false,
}: {
  title: string;
  description?: string;
  url: string;
  noindex?: boolean;
}): Metadata {
  const desc =
    description ||
    `${siteConfig.name}, North Bongaigaon, Assam. Dr. Tamoghna Das, MBBS, MD (Medicine).`;
  const canonical = `${SITE_BASE}${url}`;
  return {
    title,
    description: desc,
    alternates: { canonical },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title,
      description: desc,
      url: canonical,
      siteName: siteConfig.name,
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: `${SITE_BASE}/og?title=${encodeURIComponent(title)}`,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name}`,
        },
      ],
    },
  };
}
