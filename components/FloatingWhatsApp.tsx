import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

/**
 * Desktop-only floating WhatsApp button: solid WhatsApp-green 56px circle.
 */
export default function FloatingWhatsApp({ pageTitle = "Medcare" }: { pageTitle?: string }) {
  return (
    <a
      className="wa"
      href={`https://wa.me/${siteConfig.whatsapp.wa}?text=${encodeURIComponent(
        siteConfig.whatsapp.prefill(pageTitle),
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`WhatsApp ${siteConfig.whatsapp.display}`}
    >
      <MessageCircle size={26} strokeWidth={1.8} aria-hidden />
    </a>
  );
}
