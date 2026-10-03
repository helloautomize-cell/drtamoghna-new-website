"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useConsent } from "@/lib/consent";
import { cleanLocation, trackEvent } from "@/lib/analytics";

/**
 * Loads GA4 (gtag) once analytics consent is granted, keeps Consent Mode v2
 * ad signals denied, sends cleaned page_views on route change, and wires
 * the delegated click events. No network request happens before consent.
 */
export default function Analytics({ gaId }: { gaId: string }) {
  const consent = useConsent();
  const pathname = usePathname();
  const loaded = useRef(false);

  // Load gtag.js the first time consent is granted.
  useEffect(() => {
    if (!gaId || !consent?.analytics || loaded.current) return;
    loaded.current = true;

    const s = document.createElement("script");
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
    s.async = true;
    document.head.appendChild(s);

    window.gtag!("js", new Date());
    window.gtag!("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    window.gtag!("config", gaId, {
      send_page_view: true,
      page_location: cleanLocation(),
      anonymize_ip: true,
    });
  }, [gaId, consent]);

  // Page views on client-side navigation, after load.
  useEffect(() => {
    if (!loaded.current || typeof window.gtag !== "function") return;
    trackEvent("page_view", {
      page_location: cleanLocation(),
      page_path: pathname,
    });
  }, [pathname]);

  // Delegated click tracking: book, call, WhatsApp, directions.
  useEffect(() => {
    const onClick = (ev: MouseEvent) => {
      const a = (ev.target as HTMLElement).closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      if (a.classList.contains("book") || /\/contact\/?[?#][^"]*book/.test(href) || href.includes("/contact/#book")) {
        trackEvent("book_click");
      } else if (href.startsWith("tel:")) {
        trackEvent("call_click");
      } else if (href.includes("wa.me")) {
        trackEvent("whatsapp_click");
      } else if (href.includes("maps.app.goo.gl") || href.includes("google.com/maps")) {
        trackEvent("directions_click");
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
