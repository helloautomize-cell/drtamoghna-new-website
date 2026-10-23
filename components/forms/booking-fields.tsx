import { type FormEvent, type RefObject } from "react";
import { CalendarDays, CheckCircle2, Info, Phone } from "lucide-react";
import RouteLink from "@/components/RouteLink";
import {
  VISIT_TYPES,
  prettyDate,
  reasonsFor,
  type VisitType,
} from "@/data/booking-options";
import { maskMobile } from "@/lib/booking-schema";
import { siteConfig } from "@/lib/site-config";

/**
 * The single source of booking-form markup: visit type cards, reason/test
 * select with prep note, the scrolling day strip, the slot grid and the
 * details step. BookingFormController owns the state and hands everything
 * down as props.
 */

export type BookingLayout = "page" | "compact";

export type BookingValues = {
  visitType: "" | VisitType;
  reason: string;
  date: string;
  slotStart: string;
  name: string;
  mobile: string;
  notes: string;
  consent: boolean;
};

export type BookingErrors = Partial<Record<keyof BookingValues, string>>;

export const emptyBookingValues: BookingValues = {
  visitType: "",
  reason: "",
  date: "",
  slotStart: "",
  name: "",
  mobile: "",
  notes: "",
  consent: false,
};

/** One chip in the day strip. */
export type DayStripItem = {
  date: string;
  main: string;
  sub: string;
  closed: boolean;
  disabled: boolean;
};

/** One slot in the grid for the selected day. */
export type SlotView = {
  start: string;
  label: string;
  open: boolean;
  left?: number;
};

export type BookingFieldsProps = {
  layout: BookingLayout;
  idPrefix: string;
  formRef: RefObject<HTMLFormElement | null>;
  /** Anchor on the form element so /contact/#book keeps working. */
  formId?: string;
  values: BookingValues;
  errors: BookingErrors;
  isSubmitting: boolean;
  startedAt: string;
  /** Code-defined surface name sent to the action (book, home, contact). */
  surface: string;
  today: string;
  maxDate: string;
  stripDays: DayStripItem[];
  /** The picked date when it sits outside the 14 day strip. */
  extraDay: DayStripItem | null;
  /** Sub-line under the slots heading for the selected day. */
  dayNote: string | null;
  slots: SlotView[] | null;
  slotsLoading: boolean;
  offline: boolean;
  liveText: string;
  /** "That time just filled up" style error pinned near the slot grid. */
  slotError: string | null;
  slotErrorRef: RefObject<HTMLParagraphElement | null>;
  prepNote: string | null;
  setField: <K extends keyof BookingValues>(
    key: K,
    value: BookingValues[K],
  ) => void;
  pickDate: (date: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function BookingFields({
  layout,
  idPrefix,
  formRef,
  formId,
  values,
  errors,
  isSubmitting,
  startedAt,
  surface,
  today,
  maxDate,
  stripDays,
  extraDay,
  dayNote,
  slots,
  slotsLoading,
  offline,
  liveText,
  slotError,
  slotErrorRef,
  prepNote,
  setField,
  pickDate,
  onSubmit,
}: BookingFieldsProps) {
  const id = (part: string) => `${idPrefix}-${part}`;
  const err = (key: keyof BookingValues) =>
    errors[key] ? (
      <span className="fld-err" role="alert" id={id(`err-${key}`)}>
        {errors[key]}
      </span>
    ) : null;

  const isTest = values.visitType === "Test only";
  const reasonOptions = values.visitType ? reasonsFor(values.visitType) : [];
  const dayChip = (d: DayStripItem, key: string) => (
    <label
      key={key}
      className={`day${d.closed ? " closed" : ""}${values.date === d.date ? " on" : ""}`}
    >
      <input
        type="radio"
        name="date"
        value={d.date}
        checked={values.date === d.date}
        disabled={d.disabled}
        onChange={() => pickDate(d.date)}
      />
      <span className="day-l">{d.main}</span>
      <span className="day-s">{d.sub}</span>
    </label>
  );

  return (
    <form
      className={`bform booking${layout === "compact" ? " compact" : ""}`}
      id={formId}
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
    >
      {/* 1. Visit type */}
      <fieldset className="bk-step">
        <legend>1. What brings you in?</legend>
        <div className="vt-grid">
          {VISIT_TYPES.map((t) => (
            <label
              key={t}
              className={`vt-card${values.visitType === t ? " on" : ""}`}
            >
              <input
                type="radio"
                name="visitType"
                value={t}
                checked={values.visitType === t}
                onChange={() => setField("visitType", t)}
                aria-describedby={errors.visitType ? id("err-visitType") : undefined}
              />
              <span>{t}</span>
            </label>
          ))}
        </div>
        {err("visitType")}
      </fieldset>

      {/* 2. Reason or test */}
      <div className="bk-step">
        <div className="fld">
          <label htmlFor={id("reason")}>
            {isTest ? "2. Which test?" : "2. Reason for visit"}
          </label>
          <select
            id={id("reason")}
            name="reason"
            value={values.reason}
            disabled={!values.visitType}
            onChange={(e) => setField("reason", e.target.value)}
            aria-invalid={!!errors.reason}
            aria-describedby={
              [errors.reason ? id("err-reason") : "", prepNote ? id("prep") : ""]
                .join(" ")
                .trim() || undefined
            }
          >
            <option value="" disabled>
              {values.visitType
                ? isTest
                  ? "Choose a test"
                  : "Choose a reason"
                : "Choose what brings you in first"}
            </option>
            {reasonOptions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {prepNote ? (
            <p className="bk-prep" id={id("prep")}>
              <Info size={16} strokeWidth={2} aria-hidden /> {prepNote}
            </p>
          ) : null}
          {err("reason")}
        </div>
      </div>

      {/* 3. Day and time */}
      <fieldset className="bk-step">
        <legend>3. Choose a day and time</legend>
        <div className="day-strip" role="group" aria-label="Next 14 days">
          {stripDays.map((d) => dayChip(d, d.date))}
          {extraDay ? dayChip(extraDay, `extra-${extraDay.date}`) : null}
          <label className={`day more${extraDay ? " on" : ""}`}>
            <CalendarDays size={15} strokeWidth={2} aria-hidden />
            <span className="day-l">More dates</span>
            <input
              type="date"
              id={id("more-date")}
              suppressHydrationWarning
              min={today}
              max={maxDate}
              value={extraDay ? extraDay.date : ""}
              onChange={(e) => pickDate(e.target.value)}
              aria-label="Pick a later date"
            />
          </label>
        </div>
        <p className="visually-hidden" aria-live="polite">
          {liveText}
        </p>
        {offline ? (
          <p className="fld-note">
            Showing our usual hours. We will confirm the exact time on the
            confirmation call.
          </p>
        ) : null}
        {slotsLoading ? (
          <div className="slot-grid" aria-hidden>
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className="slot skeleton" />
            ))}
          </div>
        ) : null}
        {!slotsLoading && slots && slots.length ? (
          <div className="slot-grid">
            {slots.map((s) => (
              <label
                key={s.start}
                className={`slot${s.open ? "" : " off"}${values.slotStart === s.start ? " on" : ""}`}
              >
                <input
                  type="radio"
                  name="slotStart"
                  value={s.start}
                  checked={values.slotStart === s.start}
                  disabled={!s.open}
                  onChange={() => setField("slotStart", s.start)}
                  aria-describedby={
                    errors.slotStart ? id("err-slotStart") : undefined
                  }
                />
                <span className="slot-l">{s.label}</span>
                <span className="slot-n">
                  {s.open
                    ? s.left != null
                      ? `${s.left} left`
                      : "Available"
                    : s.left != null && s.left > 0
                      ? "Past"
                      : "Full"}
                </span>
              </label>
            ))}
          </div>
        ) : null}
        {!slotsLoading && dayNote ? (
          <p className="fld-note bk-daynote">{dayNote}</p>
        ) : null}
        {slotError ? (
          <p
            className="fld-err form-err bk-slot-err"
            role="alert"
            tabIndex={-1}
            ref={slotErrorRef}
          >
            {slotError}
          </p>
        ) : null}
        {err("date")}
        {err("slotStart")}
      </fieldset>

      {/* 4. Your details */}
      <fieldset className="bk-step">
        <legend>4. Your details</legend>
        <div className="fld">
          <label htmlFor={id("name")}>Name</label>
          <input
            id={id("name")}
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(e) => setField("name", e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? id("err-name") : undefined}
          />
          {err("name")}
        </div>
        <div className="fld">
          <label htmlFor={id("mobile")}>Mobile</label>
          <input
            id={id("mobile")}
            name="mobile"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+91 mobile number"
            value={values.mobile}
            onChange={(e) => setField("mobile", e.target.value)}
            aria-invalid={!!errors.mobile}
            aria-describedby={errors.mobile ? id("err-mobile") : undefined}
          />
          {err("mobile")}
        </div>
        <div className="fld">
          <label htmlFor={id("notes")}>
            Anything we should know? <span className="opt">(optional)</span>
          </label>
          <textarea
            id={id("notes")}
            name="notes"
            rows={3}
            maxLength={300}
            value={values.notes}
            onChange={(e) => setField("notes", e.target.value)}
            aria-invalid={!!errors.notes}
            aria-describedby={`${id("notes-count")}${errors.notes ? ` ${id("err-notes")}` : ""}`}
          />
          <span className="fld-note" id={id("notes-count")}>
            {300 - values.notes.length} characters left
          </span>
          {err("notes")}
        </div>
        <div className="fld check">
          <label htmlFor={id("consent")}>
            <input
              type="checkbox"
              id={id("consent")}
              name="consent"
              checked={values.consent}
              onChange={(e) => setField("consent", e.target.checked)}
              aria-invalid={!!errors.consent}
              aria-describedby={errors.consent ? id("err-consent") : undefined}
            />{" "}
            I agree that Medcare may call me about this request. I have read
            the{" "}
            <RouteLink href="/privacy-policy/">Privacy policy</RouteLink>.
          </label>
          {err("consent")}
        </div>
      </fieldset>

      {/* Honeypot: hidden from humans, bots fill it. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor={id("website")}>Website</label>
        <input
          id={id("website")}
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <input type="hidden" name="startedAt" value={startedAt} />
      <input type="hidden" name="surface" value={surface} />

      <button className="bform-submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Request appointment"}
      </button>
      <p className="fld-note under">
        No advance payment. Pay at the clinic by cash, UPI or card.
      </p>
      <p className="fld-note under">
        We confirm most requests within 30 to 60 minutes during clinic hours.
        Requests after closing are confirmed the next morning.
      </p>
      <p className="fld-note under bk-em">
        This form is not for emergencies.{" "}
        <a href="tel:112">Call 108 or 112</a>.
      </p>
    </form>
  );
}

/** Shown after a request is accepted (or silently accepted). */
export function BookingSuccessCard({
  bookingId,
  mobile,
  date,
  slotLabel,
  visitType,
  reason,
  onBookAnother,
}: {
  bookingId?: string;
  mobile?: string;
  date?: string;
  slotLabel?: string;
  visitType?: string;
  reason?: string;
  onBookAnother: () => void;
}) {
  return (
    <div className="bform bk-success" role="status">
      <span className="bk-tick" aria-hidden>
        <CheckCircle2 size={30} strokeWidth={2} />
      </span>
      <h2>Request received</h2>
      <p>
        Not confirmed yet. We will call you within 30 to 60 minutes during
        clinic hours.
      </p>
      {date && slotLabel ? (
        <p className="bk-sum">
          <b>{prettyDate(date)}</b> · {slotLabel}
        </p>
      ) : null}
      {visitType && reason ? (
        <p className="bk-sum">
          {visitType}: {reason}
        </p>
      ) : null}
      {bookingId ? (
        <p className="bk-sum">
          Booking ID: <b>{bookingId}</b>
        </p>
      ) : null}
      {mobile ? (
        <p className="bk-sum">We will call {maskMobile(mobile)}</p>
      ) : null}
      <button type="button" className="btn ghost" onClick={onBookAnother}>
        Book another
      </button>
    </div>
  );
}

/** Same mobile already has a request for that day. */
export function BookingDuplicateCard({
  onBookAnother,
}: {
  onBookAnother: () => void;
}) {
  return (
    <div className="bform bk-success" role="status">
      <span className="bk-tick" aria-hidden>
        <CheckCircle2 size={30} strokeWidth={2} />
      </span>
      <h2>You already have a request for that day</h2>
      <p>
        We will call you soon, or call{" "}
        <a href={`tel:${siteConfig.phone.tel}`}>{siteConfig.phone.display}</a>.
      </p>
      <div className="bk-acts">
        <a className="btn btn-p" href={`tel:${siteConfig.phone.tel}`}>
          <Phone size={17} strokeWidth={2} aria-hidden /> Call{" "}
          {siteConfig.phone.display}
        </a>
        <button type="button" className="btn ghost" onClick={onBookAnother}>
          Pick another day
        </button>
      </div>
    </div>
  );
}
