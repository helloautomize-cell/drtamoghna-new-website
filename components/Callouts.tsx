import { CircleAlert, Info, TriangleAlert } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { images, imgSrcSet } from "@/lib/images";

export function EmergencyCallout() {
  return (
    <div className="callout em">
      <TriangleAlert className="co-ic" size={24} strokeWidth={2} aria-hidden />
      <p>
        <b>When to get help straight away.</b> Call 108 or 112, or go to the nearest hospital
        emergency, if you have chest pain or pressure, sudden breathlessness, fainting, weakness or
        numbness on one side of the body, slurred speech, confusion, or a seizure. Do not wait for a
        clinic appointment.
      </p>
    </div>
  );
}

export function ReviewerCallout() {
  return (
    <div className="callout info">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="co-avatar"
        src={images.avatar.src}
        srcSet={imgSrcSet(images.avatar)}
        sizes="48px"
        alt=""
        width={48}
        height={48}
        loading="lazy"
      />
      <p>
        <b>Medically reviewed by</b> {siteConfig.doctor.name}, {siteConfig.doctor.qualifications} ·{" "}
        {siteConfig.doctor.registration} · Last reviewed {siteConfig.reviewDateDisplay}
      </p>
    </div>
  );
}

export function TipCallout() {
  return (
    <div className="callout warn">
      <CircleAlert className="co-ic" size={24} strokeWidth={2} aria-hidden />
      <p>
        <b>Tip.</b> You do not need to fast for HbA1c. At Medcare it can be tested during your
        visit.
      </p>
    </div>
  );
}

export function InfoCallout() {
  return (
    <div className="callout info">
      <Info className="co-ic" size={24} strokeWidth={2} aria-hidden />
      <p>
        <b>Medically reviewed by</b> {siteConfig.doctor.name}, {siteConfig.doctor.qualifications} ·{" "}
        {siteConfig.doctor.registration} · Last reviewed {siteConfig.reviewDateDisplay}
      </p>
    </div>
  );
}
