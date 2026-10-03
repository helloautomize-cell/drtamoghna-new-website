import { badgeFile, badgePx, type BadgeSize, type BadgeSlug } from "@/lib/service-badges";

/**
 * Illustrated PNG/WebP service badge on a white coin with a CSS ring
 * (the ring is drawn in CSS so all badges match; images have no ring).
 * Alt is empty: the service title is always visible next to it.
 */
export default function Badge({
  slug,
  size = "md",
  className = "",
}: {
  slug: BadgeSlug;
  size?: BadgeSize;
  className?: string;
}) {
  const px = badgePx[size];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src={badgeFile(slug, size)}
      alt=""
      width={px}
      height={px}
      loading={size === "lg" ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
