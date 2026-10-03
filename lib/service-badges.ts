/**
 * service-badges.ts · service page slug to badge slug.
 * Exact map from resources/images/IMAGE-GUIDE.md section 6.
 * Badge files live at /images/icons/services/{slug}-{256,512}.{png,webp}.
 * Every service has its own badge, so no two cards anywhere share one.
 */

export const serviceBadges = {
  "/diabetes-care/": "diabetes",
  "/diabetes-care/diabetes-in-pregnancy/": "gdm",
  "/diabetes-care/diabetic-foot-care/": "diabetic-foot",
  "/diabetes-care/continuous-glucose-monitoring/": "cgm",
  "/weight-management/": "weight",
  "/weight-management/glp-1-medicines/": "glp1",
  "/heart-health/": "heart",
  "/heart-health/high-blood-pressure/": "blood-pressure",
  "/heart-health/heart-failure/": "heart-failure",
  "/heart-health/echocardiography/": "echo",
  "/heart-health/holter-monitoring/": "holter",
  "/thyroid-disorders/": "thyroid",
  "/sleep-apnea/": "sleep",
  "/asthma-copd/": "lungs",
  "/internal-medicine/": "internal-medicine",
  "/internal-medicine/fever-and-infections/": "fever",
  "/internal-medicine/fatty-liver/": "liver",
  "/internal-medicine/joint-pain-arthritis/": "joints",
  "/internal-medicine/migraine-headache/": "headache",
  "/internal-medicine/anaemia/": "anaemia",
  "/health-check-ups/": "checkup",
} as const;

export const doctorBadge = "doctor";

export type BadgeSlug = (typeof serviceBadges)[keyof typeof serviceBadges] | typeof doctorBadge;

export const allBadgeSlugs = [
  ...new Set([...Object.values(serviceBadges), doctorBadge]),
] as BadgeSlug[];

export function badgeSrc(slug: BadgeSlug, size: 256 | 512, format: "webp" | "png" = "webp") {
  return `/images/icons/services/${slug}-${size}.${format}`;
}

export type BadgeSize = "sm" | "md" | "lg";

export const badgePx: Record<BadgeSize, number> = { sm: 56, md: 112, lg: 160 };

export function badgeFile(slug: BadgeSlug, size: BadgeSize) {
  // sm uses the 256 file; md and lg use the 512 file (2x density).
  return badgeSrc(slug, size === "sm" ? 256 : 512);
}
