"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { getSlots, submitBooking } from "@/lib/booking-action";
import {
  addDays,
  bookingSchema,
  istDateString,
} from "@/lib/booking-schema";
import {
  STANDARD_SLOTS,
  TESTS,
  dayName,
  prettyDate,
  slotLabel,
  stripDateLabel,
} from "@/data/booking-options";
import { ContactFallbackPanel } from "@/components/forms/contact-fallback-panel";
import LeadTracker from "@/components/LeadTracker";
import {
  BookingDuplicateCard,
  BookingFields,
  BookingSuccessCard,
  emptyBookingValues,
  type BookingErrors,
  type BookingLayout,
  type BookingValues,
  type DayStripItem,
  type SlotView,
} from "@/components/forms/booking-fields";
import type { AvailabilityDate } from "@/lib/google-sheets";

/**
 * State and submission for the shared booking form. Loads the 14 day strip
 * on mount (and single days for "More dates"), validates with the shared
 * zod schema, calls submitBooking and swaps in the success, duplicate or
 * fallback card. When the Sheet is unreachable the clinic's standard slots
 * stay selectable; the book call still checks capacity.
 */

const LEAD_MS = 60 * 60 * 1000; // same-day lead, mirrors MinLeadMinutes
const FALLBACK_MESSAGE =
  "Your request could not be sent just now. Please call or WhatsApp us and we will book you in.";

type Phase = "form" | "success" | "duplicate" | "failed";

type SuccessData = {
  bookingId?: string;
  mobile?: string;
  date?: string;
  slotLabel?: string;
  visitType?: string;
  reason?: string;
};

/** The clinic's standard hours as a day view, for the offline fallback. */
function offlineDay(date: string): AvailabilityDate {
  const dow = dayName(date);
  const slots = STANDARD_SLOTS.filter((r) => r.day === dow).map((r) => ({
    start: r.start,
    end: r.end,
    label: slotLabel(r.start, r.end),
    capacity: 1,
    left: 1,
    open: Date.parse(`${date}T${r.start}:00+05:30`) - Date.now() >= LEAD_MS,
  }));
  return {
    date,
    closed: slots.length === 0,
    reason: slots.length ? "" : "Clinic closed",
    slots,
  };
}

export function BookingFormController({
  surface,
  layout,
  formId,
  initialVisitType = "",
  initialReason = "",
}: {
  /** Where the request came from: book, home or contact. */
  surface: string;
  layout: BookingLayout;
  /** Anchor on the form element so old #book links keep working. */
  formId?: string;
  initialVisitType?: BookingValues["visitType"];
  initialReason?: string;
}) {
  const idPrefix = useId().replace(/[^a-zA-Z0-9]/g, "");
  const formRef = useRef<HTMLFormElement>(null);
  const slotErrorRef = useRef<HTMLParagraphElement>(null);
  const [startedAt] = useState(() => new Date().toISOString());
  // IST date string is the same on server and client except within the
  // seconds around an IST midnight boundary.
  const [today] = useState(() => istDateString());
  const [values, setValues] = useState<BookingValues>({
    ...emptyBookingValues,
    visitType: initialVisitType,
    reason: initialReason,
  });
  const [errors, setErrors] = useState<BookingErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phase, setPhase] = useState<Phase>("form");
  const [success, setSuccess] = useState<SuccessData>({});
  const [days, setDays] = useState<Record<string, AvailabilityDate>>({});
  const [stripOrder, setStripOrder] = useState<string[]>([]);
  const [loadingDays, setLoadingDays] = useState(true);
  const [offline, setOffline] = useState(false);
  const [liveText, setLiveText] = useState("");
  const [slotError, setSlotError] = useState<string | null>(null);

  /* ------------------------- Availability --------------------------- */

  function mergeDays(dates: AvailabilityDate[]) {
    setDays((prev) => {
      const next = { ...prev };
      for (const d of dates) next[d.date] = d;
      return next;
    });
  }

  function offlineRange(from: string, count: number): AvailabilityDate[] {
    const last = addDays(istDateString(), 30);
    const out: AvailabilityDate[] = [];
    for (let i = 0; i < count; i++) {
      const d = addDays(from, i);
      if (d > last) break;
      out.push(offlineDay(d));
    }
    return out;
  }

  async function loadStrip(t: string) {
    setLoadingDays(true);
    setLiveText("Loading times");
    const res = await getSlots(t, 14);
    if (res.ok) {
      mergeDays(res.dates);
      setStripOrder(res.dates.map((d) => d.date));
      setOffline(false);
    } else {
      const dates = offlineRange(t, 14);
      mergeDays(dates);
      setStripOrder(dates.map((d) => d.date));
      setOffline(true);
    }
    setLoadingDays(false);
    setLiveText("Times loaded");
  }

  async function loadDay(date: string) {
    setLiveText("Loading times");
    const res = await getSlots(date, 1);
    let n = 0;
    if (res.ok) {
      mergeDays(res.dates);
      n = res.dates[0]?.slots.filter((s) => s.open).length ?? 0;
    } else {
      const offlineDates = offlineRange(date, 1);
      mergeDays(offlineDates);
      setOffline(true);
      n = offlineDates[0]?.slots.filter((s) => s.open).length ?? 0;
    }
    setLiveText(`${n} times available for ${prettyDate(date)}`);
  }

  useEffect(() => {
    // Defer past the synchronous effect body: the strip load sets state.
    const mq = () => loadStrip(istDateString());
    queueMicrotask(mq);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------------------- Handlers ----------------------------- */

  function setField<K extends keyof BookingValues>(
    key: K,
    value: BookingValues[K],
  ) {
    setValues((v) => {
      const next = { ...v, [key]: value };
      // A different visit type means a different option list for reason.
      if (key === "visitType" && v.visitType !== value) {
        const isTest = value === "Test only";
        const wasTest = v.visitType === "Test only";
        if (isTest !== wasTest) next.reason = "";
      }
      return next;
    });
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
    if (key === "slotStart") setSlotError(null);
  }

  function pickDate(date: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
    setValues((v) => ({ ...v, date, slotStart: "" }));
    setErrors((e) => ({
      ...e,
      date: undefined,
      slotStart: undefined,
    }));
    setSlotError(null);
    if (!days[date]) loadDay(date);
    else {
      const n = days[date].slots.filter((s) => s.open).length;
      setLiveText(`${n} times available for ${prettyDate(date)}`);
    }
  }

  function focusFirstInvalid(next: BookingErrors) {
    const order: (keyof BookingValues)[] = [
      "visitType",
      "reason",
      "date",
      "slotStart",
      "name",
      "mobile",
      "notes",
      "consent",
    ];
    const key = order.find((k) => next[k]);
    if (!key || !formRef.current) return;
    const el =
      formRef.current.querySelector<HTMLElement>(
        `[name="${key}"]:not(:disabled)`,
      ) ??
      formRef.current.querySelector<HTMLElement>(`[id$="-${key}"]`);
    el?.focus();
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const parsed = bookingSchema.safeParse(values);
    if (!parsed.success) {
      const next: BookingErrors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0];
        if (
          typeof k === "string" &&
          k in emptyBookingValues &&
          !next[k as keyof BookingValues]
        ) {
          next[k as keyof BookingValues] = issue.message;
        }
      }
      setErrors(next);
      focusFirstInvalid(next);
      return;
    }
    setErrors({});
    setSlotError(null);
    setIsSubmitting(true);
    try {
      // Build from the live form so a bot's honeypot value is sent as typed.
      const fd = new FormData(form);
      fd.set("name", parsed.data.name);
      fd.set("mobile", parsed.data.mobile);
      fd.set("visitType", parsed.data.visitType);
      fd.set("reason", parsed.data.reason);
      fd.set("date", parsed.data.date);
      fd.set("slotStart", parsed.data.slotStart);
      fd.set("notes", parsed.data.notes);
      fd.set("consent", parsed.data.consent ? "on" : "");
      fd.set("startedAt", startedAt);
      fd.set("surface", surface);

      const res = await submitBooking(fd);
      if (res.ok) {
        setSuccess({
          bookingId: res.bookingId,
          mobile: res.mobile ?? parsed.data.mobile,
          date: parsed.data.date,
          slotLabel:
            res.slotLabel ??
            slots?.find((s) => s.start === parsed.data.slotStart)?.label,
          visitType: parsed.data.visitType,
          reason: parsed.data.reason,
        });
        setPhase("success");
      } else if (res.reason === "slot_unavailable") {
        setValues((v) => ({ ...v, slotStart: "" }));
        setSlotError(
          "Sorry, that time just filled up. Please pick another time.",
        );
        await loadDay(parsed.data.date);
        slotErrorRef.current?.focus();
      } else if (res.reason === "duplicate") {
        setPhase("duplicate");
      } else {
        setPhase("failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function reset() {
    setValues({ ...emptyBookingValues });
    setErrors({});
    setSlotError(null);
    setSuccess({});
    setPhase("form");
    if (today) loadStrip(today);
  }

  /* ---------------------------- Derived ------------------------------ */

  const prepNote = values.visitType
    ? TESTS.find((t) => t.name === values.reason)?.prep ?? null
    : null;

  const stripDays: DayStripItem[] = [];
  for (const [i, date] of stripOrder.entries()) {
    const d = days[date];
    const openCount = d ? d.slots.filter((s) => s.open).length : 0;
    const main = i === 0 ? "Today" : i === 1 ? "Tomorrow" : stripDateLabel(date);
    if (i === 0 && d && !d.closed && openCount === 0) continue; // hide a spent today
    stripDays.push({
      date,
      main,
      sub: d?.closed ? d.reason || "Closed" : d && openCount === 0 ? "Full" : "",
      closed: Boolean(d?.closed),
      disabled: !d || d.closed || openCount === 0,
    });
  }

  const extraDay: DayStripItem | null =
    values.date && !stripOrder.includes(values.date)
      ? {
          date: values.date,
          main: prettyDate(values.date),
          sub: days[values.date]?.closed
            ? days[values.date].reason || "Closed"
            : "",
          closed: Boolean(days[values.date]?.closed),
          disabled: false,
        }
      : null;

  const selected = values.date ? days[values.date] : undefined;
  const slots: SlotView[] | null = selected
    ? selected.slots.map((s) => ({
        start: s.start,
        label: s.label,
        open: s.open,
        left: offline ? undefined : s.left,
      }))
    : null;
  const dayNote = !values.date
    ? loadingDays
      ? null
      : "Pick a day to see times."
    : !selected
      ? "Loading times..."
      : selected.closed
        ? selected.reason || "Clinic closed"
        : selected.slots.length === 0
          ? "No online slots for this day. Call us and we will help."
          : selected.slots.every((s) => !s.open)
            ? "All times are taken for this day. Pick another day."
            : null;

  if (phase === "failed") {
    return <ContactFallbackPanel message={FALLBACK_MESSAGE} />;
  }
  if (phase === "duplicate") {
    return <BookingDuplicateCard onBookAnother={reset} />;
  }
  if (phase === "success") {
    return (
      <>
        {/* Silently accepted bot submits have no bookingId; the old flow
            rejected them before /thank-you/, so no lead event for them. */}
        {success.bookingId ? <LeadTracker formType="appointment" /> : null}
        <BookingSuccessCard
          bookingId={success.bookingId}
          mobile={success.mobile}
          date={success.date}
          slotLabel={success.slotLabel}
          visitType={success.visitType}
          reason={success.reason}
          onBookAnother={reset}
        />
      </>
    );
  }

  return (
    <BookingFields
      layout={layout}
      idPrefix={idPrefix}
      formRef={formRef}
      formId={formId}
      values={values}
      errors={errors}
      isSubmitting={isSubmitting}
      startedAt={startedAt}
      surface={surface}
      today={today}
      maxDate={today ? addDays(today, 30) : ""}
      stripDays={stripDays}
      extraDay={extraDay}
      dayNote={dayNote}
      slots={slots}
      slotsLoading={values.date ? !selected : loadingDays}
      offline={offline}
      liveText={liveText}
      slotError={slotError}
      slotErrorRef={slotErrorRef}
      prepNote={prepNote}
      setField={setField}
      pickDate={pickDate}
      onSubmit={onSubmit}
    />
  );
}
