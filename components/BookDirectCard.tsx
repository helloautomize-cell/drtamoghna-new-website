import { Clock, MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import WhatsAppMenu from "./WhatsAppMenu";

/**
 * Shown instead of the booking form when RESEND_API_KEY is not configured.
 * The full form returns automatically once the key is set, no code change.
 */
export default function BookDirectCard() {
  return (
    <div className="bdirect" id="book">
      <h2>Book by phone or WhatsApp</h2>
      <p className="bdirect-lead">
        The quickest way to book is to call or message us. We confirm within{" "}
        {siteConfig.bookingConfirmation} during clinic hours.
      </p>
      <div className="bdirect-btns">
        <a className="bdirect-btn call" href={`tel:${siteConfig.phone.tel}`}>
          <Phone size={22} strokeWidth={2} aria-hidden />
          <span>
            <b>Call</b> {siteConfig.phone.display}
          </span>
        </a>
        <WhatsAppMenu className="bdirect-btn wa" pageTitle="an appointment">
          <MessageCircle size={22} strokeWidth={2} aria-hidden />
          <span>
            <b>WhatsApp</b> {siteConfig.whatsapp.display}
          </span>
        </WhatsAppMenu>
      </div>
      <p className="bdirect-hours">
        <Clock size={18} strokeWidth={2} aria-hidden /> {siteConfig.hours.display}
      </p>
    </div>
  );
}
