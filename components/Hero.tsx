import { Clock, User } from "lucide-react";
import BookButton from "./BookButton";
import DoctorChip from "./DoctorChip";
import { siteConfig } from "@/lib/site-config";

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
 * The portrait slot takes a ReactNode: in Phase 1b it becomes
 * <Image priority fetchPriority="high"> (LCP, never animated in).
 */
export default function Hero({ portrait }: { portrait?: React.ReactNode }) {
  return (
    <div className="hero">
      <div>
        <span className="eyebrow">Medcare · North Bongaigaon, Assam</span>
        <h1>
          Diabetes, heart and weight care in <em className="acc">Bongaigaon</em>
        </h1>
        <p className="sub">
          One experienced physician, most tests under one roof, and a plan that fits your life.
        </p>
        <div className="btns">
          <BookButton />
          <a className="btn btn-s" href={`tel:${siteConfig.phone.tel}`}>
            Call {siteConfig.phone.display}
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
          {portrait ?? (
            <span className="portrait-ph" aria-hidden>
              <User size={72} strokeWidth={1.25} />
            </span>
          )}
          <figcaption>
            {siteConfig.doctor.name}
            <small>{siteConfig.doctor.qualifications}</small>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
