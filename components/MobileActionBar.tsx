"use client";

import { useEffect, useState } from "react";
import RouteLink from "@/components/RouteLink";
import { usePathname } from "next/navigation";
import { CalendarDays, MessageCircle, Phone } from "lucide-react";
import WhatsAppMenu from "./WhatsAppMenu";
import CallMenu from "./CallMenu";

/**
 * Mobile action bar (master-rules 3.1): below 1024px on every page, brand
 * gradient at 92% under glass, 16px top corners, safe-area padding.
 * Book Now, Call Now (opens a sheet with both call numbers) and
 * WhatsApp (two-number chooser, pre-filled from the page). Hidden while
 * an input is focused and on /thank-you/.
 */
export default function MobileActionBar() {
  const pathname = usePathname();
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const onFocus = (e: FocusEvent) => {
      const el = e.target as HTMLElement | null;
      setTyping(
        !!el &&
          (el.tagName === "INPUT" ||
            el.tagName === "TEXTAREA" ||
            el.tagName === "SELECT" ||
            el.isContentEditable),
      );
    };
    const onBlur = () => setTyping(false);
    document.addEventListener("focusin", onFocus);
    document.addEventListener("focusout", onBlur);
    return () => {
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("focusout", onBlur);
    };
  }, []);

  if (pathname.startsWith("/thank-you")) return null;

  return (
    <nav
      className="mbar"
      aria-label="Quick actions"
      hidden={typing}
      data-ga-location="sticky"
    >
      <RouteLink href="/book/" data-ga="appointment">
        <CalendarDays size={20} strokeWidth={1.8} aria-hidden />
        Book Now
      </RouteLink>
      <CallMenu gaLocation="sticky">
        <Phone size={20} strokeWidth={1.8} aria-hidden />
        Call Now
      </CallMenu>
      <WhatsAppMenu gaLocation="sticky">
        <MessageCircle size={20} strokeWidth={1.8} aria-hidden />
        WhatsApp
      </WhatsAppMenu>
    </nav>
  );
}
