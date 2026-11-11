import { Building2, CalendarDays, Phone } from "lucide-react";
import PosterLightbox from "./PosterLightbox";
import {
  displayVisit,
  doctorStatus,
  visitLabel,
  visitingPhone,
  type VisitingDoctor,
} from "@/lib/visiting-doctors";

/**
 * Visiting specialist card: headshot, name, title, optional hospital and
 * visit-date badge in the identity block, then credentials (qualifications,
 * registration), optional special interest, the treats list, and one phone
 * booking button plus the poster lightbox. Cards stretch to the row height
 * and the action row is pinned to the bottom so CTAs align across a grid
 * row even when content lengths differ. No WhatsApp or online booking
 * links: visiting specialists are phone-booking only.
 */
export default function VisitingDoctorCard({
  doctor,
}: {
  doctor: VisitingDoctor;
}) {
  const { status } = doctorStatus(doctor);
  const visit = displayVisit(doctor);
  const badge = visit
    ? visitLabel(visit)
    : status === "on-request"
      ? "Next date on request"
      : null;
  return (
    <article className="vdc">
      <div className="vdc-head">
        <picture>
          <source srcSet={doctor.photo} type="image/webp" />
          <img
            className="vdc-photo"
            src={doctor.photoFallback}
            alt={doctor.photoAlt ?? `${doctor.name}, ${doctor.title}`}
            width={480}
            height={480}
            loading="lazy"
          />
        </picture>
        <div className="vdc-id">
          <h3>{doctor.name}</h3>
          <p className="vdc-role">{doctor.title}</p>
          {doctor.hospital ? (
            <p className="vdc-hosp">
              <Building2 size={14} strokeWidth={2} aria-hidden />
              {doctor.hospital}
            </p>
          ) : null}
          {badge ? (
            <p className="vdc-date-row">
              <span className="chip vd-date">
                <CalendarDays size={14} strokeWidth={2} aria-hidden />
                {badge}
              </span>
            </p>
          ) : null}
        </div>
      </div>
      {doctor.qualifications?.length || doctor.registration ? (
        <div className="vdc-creds">
          <b className="vdc-label">Qualifications</b>
          {doctor.qualifications?.length ? (
            <ul className="vdc-quals">
              {doctor.qualifications.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          ) : null}
          {doctor.registration ? (
            <p className="vdc-reg">Reg. No. {doctor.registration}</p>
          ) : null}
        </div>
      ) : null}
      {doctor.specialInterest ? (
        <p className="vdc-interest">
          <b>Special interest:</b> {doctor.specialInterest}
        </p>
      ) : null}
      <div
        className={
          doctor.conditions.length > 5 ? "vdc-treats many" : "vdc-treats"
        }
      >
        <b className="vdc-label">Treats</b>
        <ul>
          {doctor.conditions.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>
      <div className="vdc-acts">
        <a className="btn btn-p" href={`tel:${visitingPhone.tel}`}>
          <Phone size={17} strokeWidth={2} aria-hidden /> Call{" "}
          {visitingPhone.display} to book
        </a>
        <PosterLightbox doctor={doctor} date={visit?.date ?? ""} />
      </div>
    </article>
  );
}
