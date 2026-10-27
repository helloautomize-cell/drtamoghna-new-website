import { CalendarDays, Phone } from "lucide-react";
import PosterLightbox from "./PosterLightbox";
import {
  displayVisit,
  visitLabel,
  visitingPhone,
  type VisitingDoctor,
} from "@/lib/visiting-doctors";

/**
 * Visiting specialist card: headshot, name, title, hospital, visit date,
 * treats list, one phone booking button and a poster lightbox. Visiting
 * specialists come to the clinic regularly, so every card looks the same.
 * No WhatsApp or online booking links: they are phone-booking only.
 */
export default function VisitingDoctorCard({
  doctor,
}: {
  doctor: VisitingDoctor;
}) {
  const visit = displayVisit(doctor);
  return (
    <article className="vdc">
      <div className="vdc-head">
        <picture>
          <source srcSet={doctor.photo} type="image/webp" />
          <img
            className="vdc-photo"
            src={doctor.photoFallback}
            alt={`${doctor.name}, ${doctor.title}`}
            width={480}
            height={480}
            loading="lazy"
          />
        </picture>
        <div className="vdc-id">
          <h3>{doctor.name}</h3>
          <p className="vdc-role">{doctor.title}</p>
          <p className="vdc-hosp">{doctor.hospital}</p>
        </div>
      </div>
      {visit ? (
        <p className="vdc-date-row">
          <span className="chip vd-date">
            <CalendarDays size={15} strokeWidth={2} aria-hidden />
            {visitLabel(visit)}
          </span>
        </p>
      ) : null}
      <div className="vdc-treats">
        <b>Treats</b>
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
