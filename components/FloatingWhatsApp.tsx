"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { whatsappUrlForPath } from "@/lib/whatsapp";

/**
 * Desktop-only floating WhatsApp button: solid #1F8F55 56px circle, bottom
 * right, pre-filled from the page title.
 */
export default function FloatingWhatsApp() {
  const pathname = usePathname();
  return (
    <a
      className="wa"
      href={whatsappUrlForPath(pathname)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={26} strokeWidth={1.8} aria-hidden />
    </a>
  );
}
