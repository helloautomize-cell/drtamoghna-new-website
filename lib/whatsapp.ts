import { siteConfig } from "./site-config";

/**
 * whatsapp.ts · Single source for the WhatsApp pre-fill pattern.
 * Pattern from client-answers Q24 and site-plan section 3.
 */
export function whatsappMessage(pageTitle: string): string {
  return `Hello Medcare, I would like to book a visit about ${pageTitle}. My name is `;
}

export function whatsappUrl(
  pageTitle: string,
  wa: string = siteConfig.whatsapp.numbers[0].wa,
): string {
  return `https://wa.me/${wa}?text=${encodeURIComponent(
    whatsappMessage(pageTitle),
  )}`;
}

/**
 * Derive a readable page title from the pathname for the WhatsApp pre-fill
 * on shell-level buttons (action bar, floating button). Pages that know
 * their H1 should pass it directly to whatsappUrl instead.
 */
export function pageTitleFromPath(pathname: string): string {
  const path = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
  if (path === "/") return siteConfig.name;
  const last = path.split("/").filter(Boolean).pop() ?? "";
  const words = last.replace(/-/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function whatsappUrlForPath(pathname: string): string {
  return whatsappUrl(pageTitleFromPath(pathname));
}
