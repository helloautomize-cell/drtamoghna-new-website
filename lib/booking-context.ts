/**
 * booking-context.ts · Booking reason map (site-plan section 6).
 * Every Book button links /book/?reason=<slug> so the booking form's
 * visit type and reason open prefilled (see REASON_SLUG_MAP in
 * data/booking-options.ts).
 */

export const BOOKING_REASONS = [
  { slug: "diabetes", label: "Diabetes or high sugar" },
  { slug: "diabetes-in-pregnancy", label: "Diabetes in pregnancy" },
  { slug: "diabetic-foot", label: "Diabetic foot problem" },
  { slug: "cgm-insulin", label: "CGM or insulin advice" },
  { slug: "weight", label: "Weight concerns" },
  { slug: "glp1", label: "GLP-1 medicine advice" },
  { slug: "blood-pressure", label: "Blood pressure" },
  { slug: "heart", label: "Heart symptoms or heart failure" },
  { slug: "echocardiography", label: "Echocardiography" },
  { slug: "holter", label: "Holter monitoring" },
  { slug: "thyroid", label: "Thyroid" },
  { slug: "asthma-copd", label: "Asthma or COPD" },
  { slug: "sleep", label: "Snoring or sleep problems" },
  { slug: "fever", label: "Fever or infection" },
  { slug: "fatty-liver", label: "Fatty liver" },
  { slug: "joint-pain", label: "Joint pain" },
  { slug: "headache", label: "Headache or migraine" },
  { slug: "anaemia", label: "Anaemia" },
  { slug: "checkup", label: "Health check-up" },
  { slug: "other", label: "Other" },
] as const;

export type ReasonSlug = (typeof BOOKING_REASONS)[number]["slug"];

/** Page URL -> booking reason slug. */
const PAGE_REASON: Record<string, ReasonSlug> = {
  "/diabetes-care/": "diabetes",
  "/diabetes-care/diabetes-in-pregnancy/": "diabetes-in-pregnancy",
  "/diabetes-care/diabetic-foot-care/": "diabetic-foot",
  "/diabetes-care/continuous-glucose-monitoring/": "cgm-insulin",
  "/weight-management/": "weight",
  "/weight-management/glp-1-medicines/": "glp1",
  "/heart-health/": "heart",
  "/heart-health/high-blood-pressure/": "blood-pressure",
  "/heart-health/heart-failure/": "heart",
  "/heart-health/echocardiography/": "echocardiography",
  "/heart-health/holter-monitoring/": "holter",
  "/thyroid-disorders/": "thyroid",
  "/sleep-apnea/": "sleep",
  "/asthma-copd/": "asthma-copd",
  "/internal-medicine/": "fever",
  "/internal-medicine/fever-and-infections/": "fever",
  "/internal-medicine/fatty-liver/": "fatty-liver",
  "/internal-medicine/joint-pain-arthritis/": "joint-pain",
  "/internal-medicine/migraine-headache/": "headache",
  "/internal-medicine/anaemia/": "anaemia",
  "/health-check-ups/": "checkup",
};

/** Health Library article -> booking reason, matched on the topic slug. */
const HL_REASON: [RegExp, ReasonSlug][] = [
  [/sleep|snoring|apnea/, "sleep"],
  [/foot|neuropathy/, "diabetic-foot"],
  [/glp|semaglutide|tirzepatide|insulin|metformin|sglt2/, "cgm-insulin"],
  [/obesity|weight|bmi/, "weight"],
  [/blood-pressure|hypertension|salt/, "blood-pressure"],
  [/ecg|echo|holter|heart|cholesterol|triglycerides|ldl|statin/, "heart"],
  [/diabetes|blood-sugar|hba1c|prediabetes|sugar/, "diabetes"],
];

export function reasonForUrl(url: string): ReasonSlug {
  if (PAGE_REASON[url]) return PAGE_REASON[url];
  if (url.startsWith("/health-library/")) {
    const slug = url.split("/")[2] || "";
    return HL_REASON.find(([re]) => re.test(slug))?.[1] ?? "other";
  }
  return "other";
}

export function bookingHref(url: string): string {
  return `/book/?reason=${reasonForUrl(url)}`;
}

export function isReasonSlug(v: string): v is ReasonSlug {
  return BOOKING_REASONS.some((r) => r.slug === v);
}
