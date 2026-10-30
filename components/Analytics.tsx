"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useConsent } from "@/lib/consent";
import { cleanLocation, trackEvent } from "@/lib/analytics";

/**
 * GA4 with Consent Mode v2 "advanced": gtag.js always loads and config runs
 * on every page; while consent is denied Google receives only cookieless
 * pings. The saved choice from lib/consent is applied on load and again
 * whenever the visitor changes it. Ad signals always stay denied.
 * Events carry no PII and no health data.
 */

type LinkLocation = "header" | "footer" | "nav" | "hero" | "sticky" | "body";

const KNOWN_LOCATIONS: LinkLocation[] = [
  "header",
  "footer",
  "nav",
  "hero",
  "sticky",
  "body",
];

/** Where on the page a clicked link lives, for the link_location param. */
function linkLocation(el: HTMLElement): LinkLocation {
  const marked = el.closest<HTMLElement>("[data-ga-location]");
  const v = marked?.dataset.gaLocation as LinkLocation | undefined;
  if (v && KNOWN_LOCATIONS.includes(v)) return v;
  if (el.closest("header")) return "header";
  if (el.closest("footer")) return "footer";
  if (el.closest("nav")) return "nav";
  return "body";
}

const MAPS_HOST = /google\.com\/maps|maps\.google|goo\.gl\/maps|maps\.app\.goo\.gl/i;
const SOCIAL_HOST =
  /facebook\.com|instagram\.com|twitter\.com|x\.com|linkedin\.com|youtube\.com|youtu\.be/i;
// Whole-phrase match, applied only to body content links (never chrome).
const APPOINTMENT_TEXT =
  /^(book( an| a)? appointment|book now|book a consultation|consult now|schedule( (a|an|your) (visit|appointment|consultation))?)$/i;

export default function Analytics({ gaId }: { gaId: string }) {
  const consent = useConsent();
  const pathname = usePathname();
  const loaded = useRef(false);
  const lastPath = useRef<string | null>(null);

  // Load gtag.js once per session, but never during the critical load
  // window: the first interaction (tap, key, scroll) starts it, or a
  // timer a few seconds after the load event, whichever comes first.
  // Consent Mode "advanced" still works because the denied defaults
  // fired inline long before this; hits just send a little later.
  // Keeps ~180KB of third party JS off the main thread while the LCP
  // element paints and out of the TBT window.
  useEffect(() => {
    if (!gaId) return;

    const start = () => {
      if (loaded.current) return;
      loaded.current = true;

      const s = document.createElement("script");
      s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
      s.async = true;
      document.head.appendChild(s);

      window.gtag!("js", new Date());
      window.gtag!("config", gaId, {
        send_page_view: true,
        page_location: cleanLocation(),
        anonymize_ip: true,
      });
    };

    const events = ["pointerdown", "keydown", "touchstart", "scroll"] as const;
    const onInteract = () => start();
    events.forEach((e) =>
      window.addEventListener(e, onInteract, { once: true, passive: true }),
    );

    // Fallback for visitors who never interact: load a few seconds after
    // the load event, once the page has settled. The delay keeps gtag.js
    // out of the critical path (LCP) and usually past TTI, so its ~180KB
    // download and ~300ms of script work do not count as blocking time.
    let timerId = 0;
    const armTimer = () => {
      timerId = window.setTimeout(start, 4000);
    };
    if (document.readyState === "complete") armTimer();
    else window.addEventListener("load", armTimer, { once: true });

    return () => {
      events.forEach((e) => window.removeEventListener(e, onInteract));
      window.removeEventListener("load", armTimer);
      if (timerId) window.clearTimeout(timerId);
    };
  }, [gaId]);

  // Apply the saved consent choice (returning visitors) and every later
  // change (accept, decline, settings panel). ad_* stays denied always.
  useEffect(() => {
    if (!consent || typeof window.gtag !== "function") return;
    window.gtag("consent", "update", {
      analytics_storage: consent.analytics ? "granted" : "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  }, [consent]);

  // Page views on client-side navigation, skipping the landing view that
  // gtag('config') already sent.
  useEffect(() => {
    if (!loaded.current || typeof window.gtag !== "function") return;
    if (lastPath.current === null || lastPath.current === pathname) {
      lastPath.current = pathname;
      return;
    }
    lastPath.current = pathname;
    trackEvent("page_view", {
      page_location: cleanLocation(),
      page_path: pathname,
    });
  }, [pathname]);

  // Delegated click tracking: appointment CTAs, phone, WhatsApp, email,
  // directions. One click fires at most one event; params are only
  // page_path and link_location (never the number, address or text).
  useEffect(() => {
    const fire = (name: string, el: HTMLElement) =>
      trackEvent(name, {
        page_path: window.location.pathname,
        link_location: linkLocation(el),
      });

    const onClick = (ev: MouseEvent) => {
      const el = ev.target as HTMLElement;

      // Marked CTAs first; fires for links and buttons alike.
      const appt = el.closest?.("[data-ga='appointment']");
      if (appt) {
        fire("appointment_click", appt as HTMLElement);
        return;
      }

      const a = el.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const lower = href.toLowerCase();

      if (lower.startsWith("tel:")) {
        fire("phone_click", a);
      } else if (/\/\/wa\.me\/\d/i.test(href) || lower.includes("api.whatsapp.com") || lower.startsWith("whatsapp://")) {
        // wa.me/<number> only; bare wa.me/?text= share links are not contact.
        fire("whatsapp_click", a);
      } else if (lower.startsWith("mailto:")) {
        fire("email_click", a);
      } else if (MAPS_HOST.test(href)) {
        fire("directions_click", a);
      } else if (!SOCIAL_HOST.test(href) && !a.closest("header,nav,footer,[role='dialog']")) {
        // CMS copy fallback: body links whose whole text is a booking phrase.
        const text = (a.textContent || "").trim().replace(/\s+/g, " ");
        if (APPOINTMENT_TEXT.test(text)) fire("appointment_click", a);
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
