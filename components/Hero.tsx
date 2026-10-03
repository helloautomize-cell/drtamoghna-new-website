import { Clock, Phone } from "lucide-react";
import BookButton from "./BookButton";
import DoctorChip from "./DoctorChip";
import { siteConfig } from "@/lib/site-config";
import { images } from "@/lib/images";

const chips = [
  "Diabetes",
  "Weight",
  "Blood pressure",
  "Heart and echo",
  "Thyroid",
  "Sleep apnea",
  "Asthma and COPD",
  "Check-ups",
];

/**
 * One-doctor hero: ONE large portrait card (2:3 desktop, 4:5 below 900px),
 * frosted name caption, one glass "Open 7 days" label off the face,
 * peach glow top right, faint teal ring bottom left.
 * Real photo: 2:3 desktop / 4:5 mobile art direction,
 * LCP image loads eagerly with high priority.
 */
export default function Hero() {
  return (
    <div className="hero">
      <div className="hero-text">
        <span className="eyebrow">Medcare · North Bongaigaon, Assam</span>
        <h1>
          Diabetes, heart and weight care in <em className="acc">Bongaigaon</em>
        </h1>
        <p className="sub">
          One experienced physician, most tests under one roof, and a plan that fits your life.
        </p>
        <div className="btns">
          <BookButton />
          <a className="btn btn-s hcall" href={`tel:${siteConfig.phone.tel}`}>
            Call {siteConfig.phone.display}
          </a>
          <a
            className="hcall-ic"
            href={`tel:${siteConfig.phone.tel}`}
            aria-label={`Call ${siteConfig.phone.display}`}
          >
            <Phone size={20} strokeWidth={2} aria-hidden />
          </a>
        </div>
        <div className="hchips">
          {chips.map((c) => (
            <span className="chip" key={c}>
              {c}
            </span>
          ))}
        </div>
        <DoctorChip />
      </div>
      <div className="portrait">
        <span className="tag">
          <Clock size={18} strokeWidth={2} aria-hidden />
          {siteConfig.hours.openDaysLabel}
        </span>
        <figure>
          <picture>
            <source media="(max-width: 900px)" srcSet={images.heroMobile.src} />
            <img
              src={images.heroDesktop.src}
              alt={images.heroDesktop.alt}
              width={images.heroDesktop.width}
              height={images.heroDesktop.height}
              fetchPriority="high"
              loading="eager"
              decoding="async"
            />
          </picture>
          <figcaption>
            {siteConfig.doctor.name}
            <small>{siteConfig.doctor.qualifications}</small>
          </figcaption>
        </figure>
      </div>
      <p className="mline">Open every day. Most tests on the same visit.</p>
    </div>
  );
}
