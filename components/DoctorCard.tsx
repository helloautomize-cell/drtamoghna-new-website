import BookButton from "./BookButton";
import { siteConfig } from "@/lib/site-config";
import { images } from "@/lib/images";

/**
 * Doctor feature card (one doctor): image left 38%, details right,
 * chips, BookButton "Book with Dr. Das" and "View profile".
 * No star ratings.
 */
export default function DoctorCard() {
  const d = siteConfig.doctor;
  return (
    <article className="doc">
      <div className="doc-img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images.portrait.src}
          alt={images.portrait.alt}
          width={images.portrait.width}
          height={images.portrait.height}
          loading="lazy"
        />
      </div>
      <div className="b">
        <h3>{d.name}</h3>
        <div className="q">
          {d.qualifications}, GMCH Guwahati · Fellowship in Clinical Echocardiography
        </div>
        <div className="role">
          {d.shortTitle}, {siteConfig.shortName}
        </div>
        <div className="q">
          Former Divisional Medical Officer (Medicine Specialist), Indian Railways. Secretary, IMA
          Bongaigaon and API Bongaigaon. Co-author of a 2025 Indian Heart Journal study on early
          heart failure.
        </div>
        <div className="chips">
          <span className="chip xp">{d.experienceChip}</span>
          {d.languages.map((l) => (
            <span className="chip" key={l}>
              {l}
            </span>
          ))}
        </div>
        <div className="acts">
          <BookButton label="Book with Dr. Das" />
          <a className="btn btn-s" href="/dr-tamoghna-das/">
            View profile
          </a>
        </div>
      </div>
    </article>
  );
}
