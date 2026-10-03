import { CalendarDays, MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

/**
 * Real mobile action bar: shown on every page below 1024px.
 * Teal-to-slate gradient at 92% under glass, 64px buttons, 16px top
 * corners, safe-area padding, pressed state. Hidden while typing in a
 * form and on the thank-you page (handled where it is mounted).
 */
export default function MobileActionBar({ pageTitle = "Medcare" }: { pageTitle?: string }) {
  const wa = `https://wa.me/${siteConfig.whatsapp.wa}?text=${encodeURIComponent(
    siteConfig.whatsapp.prefill(pageTitle),
  )}`;
  return (
    <nav className="mbar" aria-label="Quick actions">
      <a href="/contact/#book">
        <CalendarDays size={20} strokeWidth={1.8} aria-hidden />
        Book Now
      </a>
      <a href={`tel:${siteConfig.phone.tel}`}>
        <Phone size={20} strokeWidth={1.8} aria-hidden />
        Call Now
      </a>
      <a href={wa} target="_blank" rel="noopener noreferrer">
        <MessageCircle size={20} strokeWidth={1.8} aria-hidden />
        WhatsApp
      </a>
    </nav>
  );
}
