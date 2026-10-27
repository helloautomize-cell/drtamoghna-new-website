/**
 * visiting-doctors.ts · Visiting specialists from Yashoda Hospitals,
 * Hyderabad who hold clinics at Medcare, Bongaigaon on set dates.
 *
 * Single source of truth: a future visit only needs a new entry here or a
 * new date in `visits`. These doctors are NOT part of the online booking
 * system (/book/ is for Dr. Tamoghna Das only); their slots are booked by
 * phone.
 */
import { siteConfig } from "./site-config";
import { formatDate } from "./format";

export type VisitingDoctor = {
  slug: string;
  name: string;            // "Dr. Naresh Lalam"
  specialty: string;       // "Orthopedics"
  title: string;           // "Consultant Orthopedics"
  hospital: string;        // "Yashoda Hospitals, Hitec City, Hyderabad"
  conditions: string[];
  photo: string;           // /images/visiting-doctors/....webp
  photoFallback: string;   // .jpg
  poster: string;          // 1200w webp
  posterSmall: string;     // 640w webp
  posterFallback: string;  // jpg
  visits: string[];        // "YYYY-MM-DD", any order
  /** schema.org MedicalSpecialty URL, used in the page's Physician JSON-LD. */
  medicalSpecialty: string;
};

const IMG = "/images/visiting-doctors";

export const visitingDoctors: VisitingDoctor[] = [
  {
    slug: "dr-naresh-lalam",
    name: "Dr. Naresh Lalam",
    specialty: "Orthopedics",
    title: "Consultant Orthopedics",
    hospital: "Yashoda Hospitals, Hitec City, Hyderabad",
    conditions: [
      "Musculoskeletal injuries (fractures, sprains, strains)",
      "Joint problems (arthritis, joint replacements)",
      "Spinal disorders (herniated discs, scoliosis)",
    ],
    photo: `${IMG}/dr-naresh-lalam.webp`,
    photoFallback: `${IMG}/dr-naresh-lalam.jpg`,
    poster: `${IMG}/dr-naresh-lalam-poster.webp`,
    posterSmall: `${IMG}/dr-naresh-lalam-poster-640w.webp`,
    posterFallback: `${IMG}/dr-naresh-lalam-poster.jpg`,
    visits: ["2026-10-27"],
    medicalSpecialty: "https://schema.org/Musculoskeletal",
  },
  {
    slug: "dr-tajuddin-farooqui",
    name: "Dr. Tajuddin Farooqui",
    specialty: "Gastroenterology",
    title: "Consultant Gastroenterologist",
    hospital: "Yashoda Hospitals, Hitec City, Hyderabad",
    conditions: [
      "Gastroesophageal reflux disease (GERD)",
      "Inflammatory bowel disease",
      "Liver diseases",
      "Pancreatic diseases",
      "Hemorrhoids (piles)",
      "Stomach cancer and colon cancer",
    ],
    photo: `${IMG}/dr-tajuddin-farooqui.webp`,
    photoFallback: `${IMG}/dr-tajuddin-farooqui.jpg`,
    poster: `${IMG}/dr-tajuddin-farooqui-poster.webp`,
    posterSmall: `${IMG}/dr-tajuddin-farooqui-poster-640w.webp`,
    posterFallback: `${IMG}/dr-tajuddin-farooqui-poster.jpg`,
    visits: ["2026-10-08"],
    medicalSpecialty: "https://schema.org/Gastroenterologic",
  },
];

/**
 * Visiting specialists book by phone only, on the clinic's second number.
 * Value reused from siteConfig.whatsapp.numbers[1] so it is not hard-coded
 * twice; `wa` holds the digits without the leading "+".
 */
export const visitingPhone = {
  display: siteConfig.whatsapp.numbers[1].display,
  displayIntl: siteConfig.whatsapp.numbers[1].displayIntl,
  tel: `+${siteConfig.whatsapp.numbers[1].wa}`,
};

export type VisitStatus = "today" | "upcoming" | "past";

/** Today's date in Asia/Kolkata (YYYY-MM-DD), never the server's UTC date. */
export function todayKolkata(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/**
 * A doctor's status for `today` (YYYY-MM-DD):
 * "today" if any visit date is today, "upcoming" with the nearest future
 * date otherwise, or "past" with the most recent past date.
 */
export function doctorStatus(
  d: VisitingDoctor,
  today = todayKolkata(),
): { status: VisitStatus; date: string } {
  const visits = [...d.visits].sort();
  if (!visits.length) return { status: "past", date: "" };
  if (visits.includes(today)) return { status: "today", date: today };
  const next = visits.find((v) => v > today);
  if (next) return { status: "upcoming", date: next };
  return { status: "past", date: visits[visits.length - 1] };
}

/** Doctors split for the homepage strip: bookable (today/upcoming, soonest first) and past (most recent first). */
export function doctorsByStatus(today = todayKolkata()) {
  const rows = visitingDoctors.map((doctor) => ({
    doctor,
    ...doctorStatus(doctor, today),
  }));
  const upcoming = rows
    .filter((r) => r.status !== "past")
    .sort((a, b) => a.date.localeCompare(b.date));
  const past = rows
    .filter((r) => r.status === "past")
    .sort((a, b) => b.date.localeCompare(a.date));
  return { upcoming, past };
}

/**
 * The visit date shown on a card: the nearest date today or later when one
 * exists, else the most recent past date. Visiting specialists come to the
 * clinic regularly, so cards treat every doctor the same.
 */
export function displayVisit(
  d: VisitingDoctor,
  today = todayKolkata(),
): { date: string; kind: "next" | "last" } | null {
  const visits = [...d.visits].sort();
  if (!visits.length) return null;
  const future = visits.find((v) => v >= today);
  if (future) return { date: future, kind: "next" };
  return { date: visits[visits.length - 1], kind: "last" };
}

/** "Next visit 27 October 2026" / "Last visit 8 October 2026". */
export function visitLabel(v: { date: string; kind: "next" | "last" }): string {
  return `${v.kind === "next" ? "Next visit" : "Last visit"} ${formatDate(v.date)}`;
}
