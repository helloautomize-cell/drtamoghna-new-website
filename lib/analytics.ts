"use client";

/**
 * analytics.ts · GA4 helpers.
 *
 * components/Analytics.tsx loads gtag.js on every page under Consent Mode
 * v2 "advanced": the defaults set inline in the root layout are all denied,
 * and the saved choice from lib/consent.ts is applied on load. ad signals
 * always stay denied. Events carry no PII and no health data.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Current URL with every query parameter stripped except utm_*. */
export function cleanLocation(): string {
  if (typeof window === "undefined") return "";
  const u = new URL(window.location.href);
  const q = new URLSearchParams();
  for (const k of [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
  ]) {
    const v = u.searchParams.get(k);
    if (v) q.set(k, v);
  }
  const qs = q.toString();
  return u.origin + u.pathname + (qs ? `?${qs}` : "");
}

export function trackEvent(
  name: string,
  params: Record<string, string | number | boolean> = {},
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}
