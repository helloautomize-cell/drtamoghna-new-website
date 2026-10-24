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
  image,
  publishedTime,
  modifiedTime,
}: {
  title: string;
  description?: string;
  url: string;
  noindex?: boolean;
  /** Absolute image path (e.g. /images/blog/x.webp) used as the OG image. */
  image?: { src: string; width: number; height: number; alt: string };
  publishedTime?: string;
  modifiedTime?: string;
}): Metadata {
  const desc =
    description ||
    `${siteConfig.name}, North Bongaigaon, Assam. Dr. Tamoghna Das, MBBS, MD (Medicine).`;
  const canonical = `${SITE_BASE}${url}`;
  const article = Boolean(publishedTime);
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
      type: article ? "article" : "website",
      ...(article
        ? {
            publishedTime,
            modifiedTime: modifiedTime || publishedTime,
            authors: [siteConfig.doctor.name],
          }
        : {}),
      images: image
        ? [
            {
              url: `${SITE_BASE}${image.src}`,
              width: image.width,
              height: image.height,
              alt: image.alt,
            },
          ]
        : [
            {
              url: `${SITE_BASE}/og/?title=${encodeURIComponent(title)}`,
              width: 1200,
              height: 630,
              alt: `${siteConfig.name}`,
            },
          ],
    },
  };
}
