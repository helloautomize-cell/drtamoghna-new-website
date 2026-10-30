import RouteLink from "@/components/RouteLink";
import { ChevronDown, Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { footerColumns, catchmentLine, footerTagline } from "@/lib/nav";
import { siteConfig } from "@/lib/site-config";
import { whatsappUrl } from "@/lib/whatsapp";
import { CookieSettingsButton, ObfuscatedEmail } from "./FooterBits";
import GoogleRatingChip from "./GoogleRatingChip";
import SocialLinks, { clinicSocial } from "./SocialLinks";

/**
 * Footer (site-plan section 3): brand line, address, hours, contact links,
 * Google rating chip (hidden while the value is null), link columns
 * (accordions on mobile), catchment line, social icons and the legal
 * bottom line. "Cookie settings" re-opens the consent dialog.
 */

function ColumnLinks({ heading, links }: { heading: string; links: { label: string; href: string }[] }) {
  return (
    <ul>
      {links.map((l) => (
        <li key={l.href + l.label}>
          <RouteLink href={l.href}>{l.label}</RouteLink>
        </li>
      ))}
      {heading === "Legal" ? (
        <li>
          <CookieSettingsButton />
        </li>
      ) : null}
    </ul>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="sitefoot">
      <div className="container-mc">
        <div className="foot-top">
          <div className="foot-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/medcare-logo.svg" alt={siteConfig.name} className="foot-logo" width="2105" height="581" />
            <p className="foot-tagline">{footerTagline}</p>
          </div>

          <div className="foot-contact">
            <div className="foot-block">
              <p className="foot-line">
                <MapPin size={16} strokeWidth={1.8} aria-hidden />
                <span>
                  {siteConfig.address.lines.map((l, i) => (
                    <span key={i}>
                      {l}
                      <br />
                    </span>
                  ))}
                </span>
              </p>
              <a className="foot-dir" href={siteConfig.mapsUrl} target="_blank" rel="noopener noreferrer">
                Get directions
              </a>
            </div>

            <div className="foot-block">
              <p className="foot-line">
                <Clock size={16} strokeWidth={1.8} aria-hidden />
                <span>{siteConfig.hours.display}</span>
              </p>
              <p className="foot-line">
                <Phone size={16} strokeWidth={1.8} aria-hidden />
                <a href={`tel:${siteConfig.phone.tel}`}>Call {siteConfig.phone.display}</a>
              </p>
              <p className="foot-line">
                <MessageCircle size={16} strokeWidth={1.8} aria-hidden />
                <span>
                  WhatsApp{" "}
                  {siteConfig.whatsapp.numbers.map((n, i) => (
                    <span key={n.wa}>
                      {i > 0 ? " or " : ""}
                      <a
                        href={whatsappUrl(n.wa)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {n.display}
                      </a>
                    </span>
                  ))}
                </span>
              </p>
              <ObfuscatedEmail />
            </div>

            <div className="foot-block">
              <GoogleRatingChip />
              <a className="foot-dir" href={siteConfig.mapsUrl} target="_blank" rel="noopener noreferrer">
                See us on Google Maps
              </a>
            </div>
          </div>
        </div>

        <nav className="foot-cols" aria-label="Footer">
          {footerColumns.map((col) => (
            <div className="foot-col" key={col.heading}>
              <p className="foot-col-head">{col.heading}</p>
              <ColumnLinks heading={col.heading} links={col.links} />
            </div>
          ))}
        </nav>

        <nav className="foot-cols-m" aria-label="Footer">
          {footerColumns.map((col) => (
            <details className="foot-acc" key={col.heading}>
              <summary>
                {col.heading}
                <ChevronDown size={18} strokeWidth={2} aria-hidden className="chev" />
              </summary>
              <ColumnLinks heading={col.heading} links={col.links} />
            </details>
          ))}
        </nav>

        <p className="foot-catchment">{catchmentLine}</p>

        <div className="foot-bottom">
          <SocialLinks
            className="foot-social"
            links={[clinicSocial.facebook, clinicSocial.instagram]}
          />
          <p className="foot-legal">
            &copy; {year} {siteConfig.name}, Bongaigaon. This website is run by Medcare, owned
            by Dr. Tamoghna Das. The information here is for general education and is not a
            substitute for a consultation. Registration: {siteConfig.doctor.registration}.
            <span className="foot-credit">
              Built &amp; Marketed by{" "}
              <a href="https://www.automizemedialabs.com/" target="_blank" rel="noopener nofollow">
                Automize Media Labs
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
