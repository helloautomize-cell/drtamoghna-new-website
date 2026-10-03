import { CalendarDays, Menu, MessageCircle, Phone, User } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

/**
 * Phone-frame specimen of the mobile action bar for /styleguide.
 */
export default function PhoneFrame() {
  return (
    <div className="phone">
      <div className="scr">
        <div className="mh">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/medcare-logo.svg" alt="Medcare" />
          <Menu size={26} strokeWidth={2} aria-hidden />
        </div>
        <div className="mhero">
          <span className="eyebrow">North Bongaigaon</span>
          <b>
            Diabetes, heart and weight care in <em className="acc">Bongaigaon</em>
          </b>
          <span className="mimg" aria-hidden>
            <User size={48} strokeWidth={1.25} />
          </span>
        </div>
      </div>
      <div className="bar" role="group" aria-label="Quick actions">
        <button type="button" aria-label="Book an appointment">
          <CalendarDays size={20} strokeWidth={1.8} aria-hidden />
          Book Now
        </button>
        <button type="button" aria-label={`Call ${siteConfig.phone.display}`}>
          <Phone size={20} strokeWidth={1.8} aria-hidden />
          Call Now
        </button>
        <button type="button" aria-label={`WhatsApp ${siteConfig.whatsapp.display}`}>
          <MessageCircle size={20} strokeWidth={1.8} aria-hidden />
          WhatsApp
        </button>
      </div>
    </div>
  );
}
