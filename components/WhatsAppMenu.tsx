"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { whatsappUrl } from "@/lib/whatsapp";

/**
 * WhatsAppMenu · the one WhatsApp entry point for the whole site.
 * The trigger keeps the caller's styling (btn, ccard, icon, bar item).
 * Clicking opens a small chooser (anchored popover on desktop, bottom
 * sheet on mobile) listing the clinic's two WhatsApp numbers; each
 * option opens its wa.me link in a new tab with the usual pre-filled
 * message. Radix Dialog gives the focus trap, Esc and outside-click
 * close, and aria attributes.
 */
export default function WhatsAppMenu({
  className,
  children,
  ariaLabel,
  gaLocation,
}: {
  className?: string;
  children?: ReactNode;
  ariaLabel?: string;
  /** link_location for the wa.me options when the trigger is sticky/floating. */
  gaLocation?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<CSSProperties | undefined>();
  const btnRef = useRef<HTMLButtonElement>(null);

  const onOpenChange = (next: boolean) => {
    if (next) {
      const r = btnRef.current?.getBoundingClientRect();
      if (r && window.innerWidth >= 1024) {
        // Desktop popover: right edge aligned to the trigger, above it.
        // Approx height 210px decides above vs below.
        const right = Math.max(12, window.innerWidth - r.right);
        const above = window.innerHeight - r.top + 8;
        setPos(
          r.top > 230
            ? { right, bottom: above, top: "auto" }
            : { right, top: r.bottom + 8, bottom: "auto" },
        );
      } else {
        setPos(undefined); // mobile bottom sheet, styled in CSS
      }
    }
    setOpen(next);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <button
          ref={btnRef}
          type="button"
          className={className}
          aria-label={ariaLabel ?? "Chat on WhatsApp"}
          aria-expanded={open}
        >
          {children ?? `WhatsApp ${siteConfig.whatsapp.display}`}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="wapop-overlay" />
        <Dialog.Content
          className="wapop"
          style={pos}
          aria-describedby={undefined}
          data-ga-location={gaLocation}
        >
          <Dialog.Title className="wapop-title">Chat on WhatsApp</Dialog.Title>
          {siteConfig.whatsapp.numbers.map((n) => (
            <a
              key={n.wa}
              className="wapop-option"
              href={whatsappUrl(n.wa)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={20} strokeWidth={1.8} aria-hidden />
              WhatsApp {n.display}
            </a>
          ))}
          <Dialog.Close asChild>
            <button type="button" className="wapop-cancel">
              Cancel
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
