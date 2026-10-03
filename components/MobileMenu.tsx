"use client";

import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown, Phone, X } from "lucide-react";
import { mobileNav } from "@/lib/nav";
import { siteConfig } from "@/lib/site-config";
import { useMounted } from "@/lib/useMounted";
import BookButton from "./BookButton";

/**
 * Mobile menu (master-rules 3.1): full-screen white sheet (Radix Dialog),
 * accordion groups all collapsed, 48px rows, 17px text. Fixed footer inside
 * the sheet with Book + Call and today's hours, computed in Asia/Kolkata.
 * Focus trapped and Esc closes (Radix Dialog defaults).
 */

function todayHours(): string {
  const day = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date());
  const h = day === "Sun" ? siteConfig.hours.sunday : siteConfig.hours.weekday;
  return `Open today: ${h.display}`;
}

export default function MobileMenu({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  // Compute today's hours client-side (Asia/Kolkata) to avoid SSR mismatch.
  const mounted = useMounted();
  const hours = mounted ? todayHours() : "";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="mmenu-overlay" />
        <Dialog.Content className="mmenu" aria-label="Menu">
          <Dialog.Title className="visually-hidden">Menu</Dialog.Title>
          <div className="mmenu-head">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/medcare-logo.svg" alt={siteConfig.name} height={36} />
            <Dialog.Close asChild>
              <button type="button" className="mmenu-close" aria-label="Close menu">
                <X size={26} strokeWidth={1.8} aria-hidden />
              </button>
            </Dialog.Close>
          </div>

          <nav className="mmenu-body" aria-label="Menu">
            <Accordion.Root type="multiple" className="mmenu-acc">
              {mobileNav.map((item) =>
                item.type === "group" ? (
                  <Accordion.Item
                    key={item.label}
                    value={item.label}
                    className="mmenu-item"
                  >
                    <Accordion.Header asChild>
                      <Accordion.Trigger className="mmenu-trigger">
                        {item.label}
                        <ChevronDown size={18} strokeWidth={2} aria-hidden className="chev" />
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className="mmenu-sub">
                      <ul>
                        {item.links.map((link) => (
                          <li key={link.href + link.label}>
                            <Link href={link.href} onClick={() => onOpenChange(false)}>
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </Accordion.Content>
                  </Accordion.Item>
                ) : (
                  <Link
                    key={item.href}
                    className="mmenu-row"
                    href={item.href}
                    onClick={() => onOpenChange(false)}
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </Accordion.Root>
          </nav>

          <div className="mmenu-foot">
            <BookButton />
            <a className="mmenu-call" href={`tel:${siteConfig.phone.tel}`}>
              <Phone size={18} strokeWidth={1.8} aria-hidden />
              Call {siteConfig.phone.display}
            </a>
            <p className="mmenu-hours">{hours}</p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
