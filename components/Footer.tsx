"use client";

import RouteLink from "@/components/RouteLink";
import { ChevronDown, Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { footerColumns, catchmentLine, footerTagline } from "@/lib/nav";
import { siteConfig } from "@/lib/site-config";
import { openCookieSettings } from "@/lib/consent";
import { useMounted } from "@/lib/useMounted";
import { whatsappUrl } from "@/lib/whatsapp";
import GoogleRatingChip from "./GoogleRatingChip";

/**
 * Footer (site-plan section 3): brand line, address, hours, contact links,
 * Google rating chip (hidden while the value is null), link columns
 * (accordions on mobile), catchment line, social icons and the legal
 * bottom line. "Cookie settings" re-opens the consent dialog.
 */

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

/** Email assembled in JS; the noscript-safe text fallback stays readable. */
function ObfuscatedEmail() {
  const mounted = useMounted();
  if (!mounted) {
    return <span className="foot-email">medcarebongaigaon at gmail dot com</span>;
  }
  const addr = "medcarebongaigaon" + "@" + "gmail" + "." + "com";
  return (
    <a className="foot-email" href={`mailto:${addr}`}>
      {addr}
    </a>
  );
}

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
          <button type="button" className="foot-cookies" onClick={openCookieSettings}>
            Cookie settings
          </button>
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
            <img src="/brand/medcare-logo.svg" alt={siteConfig.name} className="foot-logo" />
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
                <a href={whatsappUrl("Medcare")} target="_blank" rel="noopener noreferrer">
                  WhatsApp {siteConfig.whatsapp.display}
                </a>
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
          <div className="foot-social">
            <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Medcare on Facebook">
              <FacebookIcon />
            </a>
            <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Medcare on Instagram">
              <InstagramIcon />
            </a>
          </div>
          <p className="foot-legal">
            &copy; {year} {siteConfig.name}, Bongaigaon. This website is run by Medcare, owned
            by Dr. Tamoghna Das. The information here is for general education and is not a
            substitute for a consultation. Registration: {siteConfig.doctor.registration}.
          </p>
        </div>
      </div>
    </footer>
  );
}
