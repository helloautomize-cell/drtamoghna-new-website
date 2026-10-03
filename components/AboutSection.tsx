import { ArrowRight, Clock, MapPin } from "lucide-react";
import RouteLink from "./RouteLink";
import Badge from "./Badge";
import SectionHeading from "./SectionHeading";
import { images } from "@/lib/images";

/**
 * 02 / About Medcare (content Home): clinic consultation-room photo with
 * two glass labels placed off the face (blinds top-left, cabinet
 * top-right); right side H2, paragraph, doctor + echo badge rows and the
 * "Read about Medcare" link.
 */
export default function AboutSection() {
  const im = images.consultationRoom;
  return (
    <div className="aboutgrid">
      <figure className="about-img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={im.src} alt={im.alt} width={im.width} height={im.height} loading="lazy" />
        <span className="about-tag t1">
          <MapPin size={16} strokeWidth={2} aria-hidden /> Caring for Bongaigaon since 2023
        </span>
        <span className="about-tag t2">
          <Clock size={16} strokeWidth={2} aria-hidden /> Open 7 days
        </span>
      </figure>
      <div className="about-txt">
        <SectionHeading
          eyebrow="02 / About Medcare"
          title="A physician-led clinic in"
          accent="North Bongaigaon"
        />
        <p>
          Dr. Tamoghna Das opened Medcare in September 2023 on Chapaguri Road,
          opposite Domino&apos;s. Before that he spent six years as a medicine
          specialist with Indian Railways and trained in medicine at Gauhati
          Medical College and Hospital. Medcare brings his two main interests
          together: long-term conditions such as diabetes, high blood pressure
          and obesity, and the heart, which these conditions quietly affect.
        </p>
        <div className="about-rows">
          <div className="about-row">
            <Badge slug="doctor" size="sm" />
            <div>
              <b>Consultations</b>
              <span>
                Diabetes, weight, BP, heart, thyroid, lungs, sleep and general
                medicine
              </span>
            </div>
          </div>
          <div className="about-row">
            <Badge slug="echo" size="sm" />
            <div>
              <b>In-house tests</b>
              <span>
                Echo with strain imaging, ECG, Holter, 24-hour BP, HbA1c,
                spirometry and more
              </span>
            </div>
          </div>
        </div>
        <RouteLink className="link-arrow" href="/about/">
          Read about Medcare <ArrowRight size={18} strokeWidth={2} aria-hidden />
        </RouteLink>
      </div>
    </div>
  );
}
