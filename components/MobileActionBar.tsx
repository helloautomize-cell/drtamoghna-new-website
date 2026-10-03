"use client";

import { useEffect, useState } from "react";
import RouteLink from "@/components/RouteLink";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { CalendarDays, MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { whatsappUrlForPath } from "@/lib/whatsapp";

/**
 * Mobile action bar (master-rules 3.1): below 1024px on every page, brand
 * gradient at 92% under glass, 16px top corners, safe-area padding.
 * Book Now, Call Now (opens a small sheet with the one call number) and
 * WhatsApp (pre-filled from the page title). Hidden while an input is
 * focused and on /thank-you/.
 */
export default function MobileActionBar() {
  const pathname = usePathname();
  const [typing, setTyping] = useState(false);
  const [callOpen, setCallOpen] = useState(false);

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
    <>
      <nav className="mbar" aria-label="Quick actions" hidden={typing}>
        <RouteLink href="/contact/#book">
          <CalendarDays size={20} strokeWidth={1.8} aria-hidden />
          Book Now
        </RouteLink>
        <button type="button" onClick={() => setCallOpen(true)}>
          <Phone size={20} strokeWidth={1.8} aria-hidden />
          Call Now
        </button>
        <a href={whatsappUrlForPath(pathname)} target="_blank" rel="noopener noreferrer">
          <MessageCircle size={20} strokeWidth={1.8} aria-hidden />
          WhatsApp
        </a>
      </nav>

      <Dialog.Root open={callOpen} onOpenChange={setCallOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="csheet-overlay" />
          <Dialog.Content className="csheet" aria-label="Call Medcare">
            <Dialog.Title className="csheet-title">Call Medcare</Dialog.Title>
            <a className="csheet-option" href={`tel:${siteConfig.phone.tel}`}>
              <Phone size={20} strokeWidth={1.8} aria-hidden />
              Call {siteConfig.phone.display}
            </a>
            <Dialog.Close asChild>
              <button type="button" className="csheet-cancel">
                Cancel
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
