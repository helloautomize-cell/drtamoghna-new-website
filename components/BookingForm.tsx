"use client";

import { useActionState, useState } from "react";
import { bookAppointment, type BookingState } from "@/app/contact/actions";
import { BOOKING_REASONS } from "@/lib/booking-context";
import { siteConfig } from "@/lib/site-config";
import RouteLink from "./RouteLink";

/**
 * BookingForm · content Page 7. Progressive enhancement: posts to the
 * Server Action and works without JavaScript. Client-side Sunday check
 * hides the Evening option; the server still validates everything.
 */
const initial: BookingState = { errors: {} };

export default function BookingForm({
  ts,
  reason,
  dateMin,
  dateMax,
  emailReady,
}: {
  ts: number;
  reason?: string;
  dateMin: string;
  dateMax: string;
  emailReady: boolean;
}) {
  const [state, action, pending] = useActionState(bookAppointment, initial);
  const v = state.values || {};
  const [under18, setUnder18] = useState(v.under18 === "on");
  const [sunday, setSunday] = useState(false);
  const e = state.errors;

  const onDate = (d: string) => {
    if (!d) return setSunday(false);
    const day = new Date(`${d}T12:00:00`).getDay();
    setSunday(day === 0);
  };

  const err = (k: string) =>
    e[k] ? (
      <span className="fld-err" role="alert" id={`err-${k}`}>
        {e[k]}
      </span>
    ) : null;

  return (
    <form className="bform" id="book" action={action} noValidate={false}>
      {state.formError ? (
        <p className="fld-err form-err" role="alert">
          {state.formError}
        </p>
      ) : null}

      <div className="fld">
        <label htmlFor="f-name">Patient name</label>
        <input
          id="f-name"
          name="patientName"
          autoComplete="name"
          required
          defaultValue={v.patientName}
          aria-describedby={e.patientName ? "err-patientName" : undefined}
        />
        {err("patientName")}
      </div>

      <div className="fld">
        <label htmlFor="f-mobile">Mobile number</label>
        <div className="fld-phone">
          <span aria-hidden>+91</span>
          <input
            id="f-mobile"
            name="mobile"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="98765 43210"
            required
            defaultValue={v.mobile}
            aria-describedby={e.mobile ? "err-mobile" : undefined}
          />
        </div>
        {err("mobile")}
      </div>

      <div className="fld-row">
        <div className="fld">
          <label htmlFor="f-age">Age</label>
          <input
            id="f-age"
            name="age"
            inputMode="numeric"
            required
            defaultValue={v.age}
            aria-describedby={e.age ? "err-age" : undefined}
          />
          {err("age")}
        </div>
        <div className="fld">
          <label htmlFor="f-ageunit">Age unit</label>
          <select id="f-ageunit" name="ageUnit" defaultValue={v.ageUnit || "years"}>
            <option value="years">years</option>
            <option value="months">months</option>
          </select>
        </div>
      </div>

      <div className="fld">
        <label htmlFor="f-doctor">Doctor</label>
        <select id="f-doctor" name="doctor" defaultValue="dr-tamoghna-das" required>
          <option value="dr-tamoghna-das">
            Dr. Tamoghna Das, MBBS, MD (Medicine)
          </option>
        </select>
      </div>

      <div className="fld">
        <label htmlFor="f-reason">Reason for visit</label>
        <select id="f-reason" name="reason" required defaultValue={v.reason || reason || ""}>
          <option value="" disabled>
            Choose a reason
          </option>
          {BOOKING_REASONS.map((r) => (
            <option key={r.slug} value={r.slug}>
              {r.label}
            </option>
          ))}
        </select>
        {err("reason")}
      </div>

      <div className="fld-row">
        <div className="fld">
          <label htmlFor="f-date">Preferred date</label>
          <input
            id="f-date"
            name="preferredDate"
            type="date"
            min={dateMin}
            max={dateMax}
            required
            defaultValue={v.preferredDate}
            onChange={(ev) => onDate(ev.target.value)}
            aria-describedby={e.preferredDate ? "err-preferredDate" : undefined}
          />
          {err("preferredDate")}
        </div>
        <div className="fld">
          <label htmlFor="f-time">Preferred time</label>
          <select
            id="f-time"
            name="timeOfDay"
            required
            defaultValue={v.timeOfDay || "morning"}
            aria-describedby="sun-note"
          >
            <option value="morning">Morning (9 am to 12 pm)</option>
            <option value="afternoon">Afternoon (12 pm to 4 pm)</option>
            <option value="evening" disabled={sunday}>
              Evening (4 pm to 8:30 pm, Monday to Saturday)
            </option>
          </select>
          {sunday ? (
            <span className="fld-note" id="sun-note">
              On Sunday we are open 9 am to 3:30 pm.
            </span>
          ) : null}
          {err("timeOfDay")}
        </div>
      </div>

      <div className="fld">
        <label htmlFor="f-city">
          Town or city <span className="opt">(optional)</span>
        </label>
        <input id="f-city" name="city" autoComplete="address-level2" defaultValue={v.city} />
      </div>

      <div className="fld check u18wrap">
        <input
          type="checkbox"
          id="f-u18"
          className="u18"
          name="under18"
          checked={under18}
          onChange={(ev) => setUnder18(ev.target.checked)}
        />
        <label htmlFor="f-u18">The patient is under 18</label>

        {/* Revealed by :checked CSS so it also works without JavaScript;
            `required` is applied client-side when the box is ticked. */}
        <div className="guardian">
          <div className="fld">
            <label htmlFor="f-guardian">Parent or guardian&apos;s name</label>
            <input
              id="f-guardian"
              name="guardianName"
              required={under18}
              defaultValue={v.guardianName}
              aria-describedby={e.guardianName ? "err-guardianName" : undefined}
            />
            {err("guardianName")}
          </div>
          <div className="fld check">
            <label>
              <input
                type="checkbox"
                name="guardianConsent"
                required={under18}
                defaultChecked={v.guardianConsent === "on"}
              />{" "}
              I am
              the parent or legal guardian and I consent to Medcare using these
              details to arrange care for this child.
            </label>
            {err("guardianConsent")}
          </div>
        </div>
      </div>

      <div className="fld check">
        <label>
          <input
            type="checkbox"
            name="consent"
            required
            defaultChecked={v.consent === "on"}
          />{" "}
          I agree that Medcare may
          use these details to contact me about my appointment, as explained in the{" "}
          <RouteLink href="/privacy-policy/">Privacy Policy</RouteLink>.
        </label>
        {err("consent")}
      </div>

      {/* Honeypot: hidden from humans, bots fill it. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="f-website">Website</label>
        <input id="f-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="ts" value={ts} />

      <button className="bform-submit" type="submit" disabled={pending}>
        {pending ? "Sending..." : "Request appointment"}
      </button>
      <p className="fld-note under">
        Please do not include detailed medical information here. You can share it
        with Dr. Das at your visit.
      </p>
      {!emailReady ? (
        <p className="fld-note resend">
          Preview: requests are not emailed yet. Please call {siteConfig.phone.display}{" "}
          or WhatsApp {siteConfig.whatsapp.display}.
        </p>
      ) : null}
    </form>
  );
}
