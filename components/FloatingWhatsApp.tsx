"use client";

import { MessageCircle } from "lucide-react";
import WhatsAppMenu from "./WhatsAppMenu";

/**
 * Desktop-only floating WhatsApp button: solid #1F8F55 56px circle, bottom
 * right. Opens the two-number WhatsApp chooser, pre-filled from the page.
 */
export default function FloatingWhatsApp() {
  return (
    <WhatsAppMenu className="wa-fab" ariaLabel="Chat on WhatsApp" gaLocation="sticky">
      <MessageCircle size={26} strokeWidth={1.8} aria-hidden />
    </WhatsAppMenu>
  );
}
