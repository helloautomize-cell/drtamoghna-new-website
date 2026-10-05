import { siteConfig } from "@/lib/site-config";
import { images, imgSrcSet } from "@/lib/images";

/**
 * Hero doctor chip: one avatar (Dr. Das is the only doctor) + name line.
 */
export default function DoctorChip() {
  return (
    <span className="chip-doc">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="avatar"
        src={images.avatar.src}
        srcSet={imgSrcSet(images.avatar)}
        sizes="42px"
        alt=""
        width={42}
        height={42}
        loading="lazy"
      />
      <span>
        Physician-led care
        <small>
          {siteConfig.doctor.name}, {siteConfig.doctor.qualifications}
        </small>
      </span>
    </span>
  );
}
