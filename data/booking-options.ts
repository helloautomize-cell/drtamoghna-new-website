/**
 * booking-options.ts · One source for the booking form's choices, shared by
 * the UI and the zod validation. Stored values equal these labels verbatim:
 * the Sheet row carries the label exactly as written here.
 */

export const VISIT_TYPES = [
  "New consultation",
  "Follow-up",
  "Show reports",
  "Test only",
] as const;
export type VisitType = (typeof VISIT_TYPES)[number];

/** Reasons offered for the three consultation visit types. */
export const VISIT_REASONS = [
  "Diabetes or high sugar",
  "Weight and GLP-1 medicines",
  "High blood pressure",
  "Heart (chest pain, breathlessness, palpitations)",
  "Thyroid",
  "Asthma or COPD",
  "Snoring or sleep apnea",
  "Diabetes in pregnancy",
  "Fever and general medicine",
  "Health check-up",
  "Not sure, please advise",
] as const;

// DRAFT FOR DR. DAS TO APPROVE before launch.
export const TESTS: { name: string; prep: string }[] = [
  {
    name: "Echocardiography (echo)",
    prep: "No special preparation. Wear a top that is easy to open at the front.",
  },
  { name: "ECG", prep: "No special preparation." },
  {
    name: "Holter monitoring",
    prep: "Bathe before you come. The device stays on for 24 to 48 hours and is returned to the clinic.",
  },
  {
    name: "24-hour BP monitoring",
    prep: "Wear a loose-sleeved top. The cuff stays on for 24 hours and is returned the next day.",
  },
  {
    name: "Blood tests (sugar, HbA1c, thyroid, lipids)",
    prep: "Fasting sugar and lipid tests need 8 to 10 hours without food. Water is fine. Please ask us before skipping any diabetes medicine.",
  },
  {
    name: "Spirometry (lung test)",
    prep: "We will tell you on the confirmation call if any inhaler should be paused.",
  },
  {
    name: "Sleep study",
    prep: "The kit is set up in the evening and returned the next morning. We will explain on the confirmation call.",
  },
  {
    name: "Body composition",
    prep: "Avoid a heavy meal for 2 hours before.",
  },
  { name: "Diabetic foot check", prep: "No special preparation." },
];

export const TEST_NAMES = TESTS.map((t) => t.name);

/** Reason options for a visit type; the test list applies to Test only. */
export function reasonsFor(visitType: string): readonly string[] {
  return visitType === "Test only" ? TEST_NAMES : VISIT_REASONS;
}

export function isReasonFor(visitType: string, reason: string): boolean {
  return (reasonsFor(visitType) as readonly string[]).includes(reason);
}

/* ------------------------- Standard slot table ------------------------ */

export type StandardSlot = { day: string; start: string; end: string };

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The clinic's standard bookable hours, used as the offline fallback when
 * the Sheet cannot be reached: Mon to Sat 09:00 to 20:30 and Sun 09:00 to
 * 15:30, hourly, with the last slot being the half hour.
 */
export const STANDARD_SLOTS: StandardSlot[] = (() => {
  const rows: StandardSlot[] = [];
  for (const day of ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]) {
    for (let h = 9; h < 20; h++) {
      rows.push({ day, start: `${pad(h)}:00`, end: `${pad(h + 1)}:00` });
    }
    rows.push({ day, start: "20:00", end: "20:30" });
  }
  for (let h = 9; h < 15; h++) {
    rows.push({ day: "Sun", start: `${pad(h)}:00`, end: `${pad(h + 1)}:00` });
  }
  rows.push({ day: "Sun", start: "15:00", end: "15:30" });
  return rows;
})();

export const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function dayName(ymd: string): string {
  return DAY_NAMES[new Date(`${ymd}T00:00:00Z`).getUTCDay()];
}

/** "09:00" -> "9 am", "20:30" -> "8:30 pm" (mirrors the Apps Script clock). */
export function clockLabel(hhmm: string): string {
  const h = Number(hhmm.slice(0, 2));
  const m = hhmm.slice(3, 5);
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}${m === "00" ? "" : `:${m}`} ${suffix}`;
}

export function slotLabel(start: string, end: string): string {
  return `${clockLabel(start)} to ${clockLabel(end)}`;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** "2026-10-28" -> "Wed 28 Oct". */
export function prettyDate(ymd: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return ymd;
  return `${dayName(ymd)} ${Number(ymd.slice(8))} ${MONTHS[Number(ymd.slice(5, 7)) - 1]}`;
}

/** Short strip label: "Wed 29". */
export function stripDateLabel(ymd: string): string {
  return `${dayName(ymd)} ${Number(ymd.slice(8))}`;
}

/* ------------------- Legacy ?reason= slug mapping --------------------- */

/**
 * Older links pass /contact/?reason=<slug>#book or /book/?reason=<slug>.
 * Each slug maps to a visit type plus the new stored label. Unknown values
 * are ignored by the form (no prefill).
 */
export const REASON_SLUG_MAP: Record<
  string,
  { visitType: VisitType; reason: string }
> = {
  diabetes: { visitType: "New consultation", reason: "Diabetes or high sugar" },
  "diabetes-in-pregnancy": {
    visitType: "New consultation",
    reason: "Diabetes in pregnancy",
  },
  "diabetic-foot": {
    visitType: "New consultation",
    reason: "Diabetes or high sugar",
  },
  "cgm-insulin": {
    visitType: "New consultation",
    reason: "Diabetes or high sugar",
  },
  weight: {
    visitType: "New consultation",
    reason: "Weight and GLP-1 medicines",
  },
  glp1: { visitType: "New consultation", reason: "Weight and GLP-1 medicines" },
  "blood-pressure": {
    visitType: "New consultation",
    reason: "High blood pressure",
  },
  heart: {
    visitType: "New consultation",
    reason: "Heart (chest pain, breathlessness, palpitations)",
  },
  echocardiography: {
    visitType: "Test only",
    reason: "Echocardiography (echo)",
  },
  holter: { visitType: "Test only", reason: "Holter monitoring" },
  thyroid: { visitType: "New consultation", reason: "Thyroid" },
  "asthma-copd": { visitType: "New consultation", reason: "Asthma or COPD" },
  sleep: {
    visitType: "New consultation",
    reason: "Snoring or sleep apnea",
  },
  fever: {
    visitType: "New consultation",
    reason: "Fever and general medicine",
  },
  "fatty-liver": {
    visitType: "New consultation",
    reason: "Fever and general medicine",
  },
  "joint-pain": {
    visitType: "New consultation",
    reason: "Fever and general medicine",
  },
  headache: {
    visitType: "New consultation",
    reason: "Fever and general medicine",
  },
  anaemia: {
    visitType: "New consultation",
    reason: "Fever and general medicine",
  },
  checkup: { visitType: "New consultation", reason: "Health check-up" },
  other: {
    visitType: "New consultation",
    reason: "Not sure, please advise",
  },
};
