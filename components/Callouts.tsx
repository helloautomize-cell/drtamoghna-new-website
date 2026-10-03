import { CircleAlert, Info, TriangleAlert, User } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import ConfirmChip from "./ConfirmChip";

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
      <span className="co-avatar portrait-ph" aria-hidden>
        <User size={22} strokeWidth={1.75} />
      </span>
      <p>
        <b>Medically reviewed by</b> {siteConfig.doctor.name}, {siteConfig.doctor.qualifications} ·{" "}
        {siteConfig.doctor.registration} · Last reviewed <ConfirmChip>sign-off date</ConfirmChip>
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
        {siteConfig.doctor.registration} · Last reviewed <ConfirmChip>sign-off date</ConfirmChip>
      </p>
    </div>
  );
}
