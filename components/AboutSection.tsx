import { ArrowRight, Clock, MapPin } from "lucide-react";
import RouteLink from "./RouteLink";
import Badge from "./Badge";
import SectionHeading from "./SectionHeading";
import { images, imgSrcSet } from "@/lib/images";

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
        <img
          src={im.src}
          srcSet={imgSrcSet(im)}
          sizes="(max-width: 899px) calc(100vw - 40px), 570px"
          alt={im.alt}
          width={im.width}
          height={im.height}
          loading="lazy"
        />
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
          Medcare is a physician-led clinic run by Dr. Tamoghna Das, MBBS, MD
          (Internal Medicine), with a Post Graduate Fellowship in
          Echocardiography (JROP, Delhi). He is a member of the Indian Academy
          of Echocardiography (IAE) and the European Society of Cardiology
          (ESC), and has performed more than 10,000 echocardiography
          examinations. Medcare brings diabetes, obesity and heart care under
          one roof, with an advanced echocardiography lab, a weekly Heart
          Function Clinic recognised by the Heart Failure Association of India
          (HFAI), and in-house tests, so most patients can be examined, tested
          and treated in one place.
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
