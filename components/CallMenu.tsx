"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Phone } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

/**
 * CallMenu · the one call entry point for the whole site.
 * The trigger keeps the caller's styling (btn, ccard, icon, bar item).
 * Clicking opens a small chooser (anchored popover on desktop, bottom
 * sheet on mobile) listing the clinic's two call numbers; each option
 * is a tel: link. Radix Dialog gives the focus trap, Esc and
 * outside-click close, and aria attributes. Mirrors WhatsAppMenu.
 */
export default function CallMenu({
  className,
  children,
  ariaLabel,
  gaLocation,
}: {
  className?: string;
  children?: ReactNode;
  ariaLabel?: string;
  /** link_location for the tel: options when the trigger is sticky/floating. */
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
          aria-label={ariaLabel}
          aria-expanded={open}
        >
          {children ?? `Call ${siteConfig.phone.display}`}
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
          <Dialog.Title className="wapop-title">Call Medcare</Dialog.Title>
          {siteConfig.phone.numbers.map((n) => (
            <a key={n.tel} className="wapop-option" href={`tel:${n.tel}`}>
              <Phone size={20} strokeWidth={1.8} aria-hidden />
              Call {n.display}
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
