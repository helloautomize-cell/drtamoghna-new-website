import { Clock, MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import WhatsAppMenu from "@/components/WhatsAppMenu";

/**
 * Shown instead of the form when a booking request cannot be sent
 * (webhook down, network error, submission rejected). Calm message plus
 * the site's usual Call and WhatsApp contact buttons.
 */
export function ContactFallbackPanel({ message }: { message: string }) {
  return (
    <div className="bform bk-success" role="alert">
      <h2>Something went wrong</h2>
      <p>{message}</p>
      <div className="bk-acts">
        <a className="btn btn-p" href={`tel:${siteConfig.phone.tel}`}>
          <Phone size={17} strokeWidth={2} aria-hidden /> Call{" "}
          {siteConfig.phone.display}
        </a>
        <WhatsAppMenu className="btn ghost" pageTitle="an appointment">
          <MessageCircle size={17} strokeWidth={2} aria-hidden /> WhatsApp{" "}
          {siteConfig.whatsapp.display}
        </WhatsAppMenu>
      </div>
      <p className="fld-note under">
        <Clock size={14} strokeWidth={2} aria-hidden />{" "}
        {siteConfig.hours.display}
      </p>
    </div>
  );
}
