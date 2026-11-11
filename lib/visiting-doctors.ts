/**
 * visiting-doctors.ts · Visiting specialists who hold clinics at Medcare,
 * Bongaigaon, on set dates or by appointment. The current specialists from
 * Yashoda Hospitals, Hyderabad carry `hospital`; others consult on request.
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
  hospital?: string;       // "Yashoda Hospitals, Hitec City, Hyderabad"
  qualifications?: string[]; // degree / training lines, shown in this order
  registration?: string;   // "AMC 22748", shown as "Reg. No. ..."
  specialInterest?: string;
  conditions: string[];
  photo: string;           // /images/visiting-doctors/....webp
  photoFallback: string;   // .jpg
  photoAlt?: string;       // defaults to "name, title"
  poster: string;          // full-size webp
  posterSmall: string;     // 640w webp
  posterFallback: string;  // jpg
  posterWidth: number;     // real pixels, for <img> and srcset (no CLS)
  posterHeight: number;
  visits: string[];        // "YYYY-MM-DD", any order; [] = next date on request
  /** schema.org MedicalSpecialty URL(s), used in the page's Physician JSON-LD. */
  medicalSpecialty: string | string[];
  /** One-line note for llms.txt and directory listings (no visit dates). */
  llmsDetail?: string;
  /** Physician schema description, when the page should output one. */
  schemaDescription?: string;
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
    posterWidth: 1200,
    posterHeight: 1200,
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
    posterWidth: 1200,
    posterHeight: 1200,
    visits: ["2026-10-08"],
    medicalSpecialty: "https://schema.org/Gastroenterologic",
  },
  {
    slug: "dr-nyrvan-baishya",
    name: "Dr. Nyrvan Baishya",
    specialty: "Pulmonology",
    title: "Pulmonologist (Respiratory, Critical Care & Sleep Medicine)",
    photoAlt: "Dr. Nyrvan Baishya, Pulmonologist",
    registration: "AMC 22748",
    qualifications: [
      "MBBS - GMCH",
      "MD Respiratory Medicine, Seth GS Medical College, Mumbai",
      "DM Pulmonary, Critical Care & Sleep Medicine, All India Institute of Medical Sciences, Rishikesh",
    ],
    specialInterest: "ILD, Lung Cancer Interventions",
    conditions: [
      "Asthma",
      "COPD / Bronchitis",
      "Bronchiectasis",
      "Interstitial Lung Disease (ILD)",
      "Lung Tumours",
      "Lung Cancers",
      "Sleep Disorders",
      "Lung Interventions",
    ],
    photo: `${IMG}/dr-nyrvan-baishya.webp`,
    photoFallback: `${IMG}/dr-nyrvan-baishya.jpg`,
    poster: `${IMG}/dr-nyrvan-baishya-poster.webp`,
    posterSmall: `${IMG}/dr-nyrvan-baishya-poster-640w.webp`,
    posterFallback: `${IMG}/dr-nyrvan-baishya-poster.jpg`,
    posterWidth: 905,
    posterHeight: 1280,
    visits: [],
    medicalSpecialty: "https://schema.org/Pulmonary",
    llmsDetail: "DM Pulmonary, Critical Care & Sleep Medicine, AIIMS Rishikesh",
    schemaDescription:
      "Pulmonologist (Respiratory, Critical Care & Sleep Medicine). Consultations at Medcare, Bongaigaon by appointment.",
  },
  {
    slug: "dr-abhishek-kayal",
    name: "Dr. Abhishek Kayal",
    specialty: "Paediatric Orthopaedics",
    title: "Consultant Paediatric Orthopaedic Surgeon",
    qualifications: [
      "MBBS, MS (Orthopaedics), FIPO",
      "Ex-Resident, Paediatric Orthopaedics, King George Medical College, Lucknow",
      "Trained in SRCC Children's Hospital, Mumbai",
    ],
    conditions: [
      "Clubfoot (Congenital Talipes Equinovarus)",
      "Hip Dysplasia (Developmental Dysplasia of the Hip)",
      "Cerebral Palsy (Orthopaedic Management)",
      "Torticollis (Muscular / Congenital)",
      "Paediatric Fractures (Non-operative & Operative Management)",
      "Radial Club Hand (Congenital Upper Limb Deformities)",
    ],
    photo: `${IMG}/dr-abhishek-kayal.webp`,
    photoFallback: `${IMG}/dr-abhishek-kayal.jpg`,
    poster: `${IMG}/dr-abhishek-kayal-poster.webp`,
    posterSmall: `${IMG}/dr-abhishek-kayal-poster-640w.webp`,
    posterFallback: `${IMG}/dr-abhishek-kayal-poster.jpg`,
    posterWidth: 1023,
    posterHeight: 1280,
    visits: [],
    medicalSpecialty: [
      "https://schema.org/Pediatric",
      "https://schema.org/Musculoskeletal",
    ],
    llmsDetail: "MBBS, MS (Orthopaedics), FIPO",
    schemaDescription:
      "Consultant Paediatric Orthopaedic Surgeon. Consultations at Medcare, Bongaigaon by appointment.",
  },
];

/**
 * Visiting specialists book by phone only, on the clinic's second number.
 * Value reused from siteConfig.phone.numbers[1] so it is not hard-coded
 * twice.
 */
export const visitingPhone = {
  display: siteConfig.phone.numbers[1].display,
  displayIntl: siteConfig.phone.numbers[1].displayIntl,
  tel: siteConfig.phone.numbers[1].tel,
};

export type VisitStatus = "today" | "upcoming" | "on-request" | "past";

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
 * "on-request" when no visit is announced, "today" if any visit date is
 * today, "upcoming" with the nearest future date otherwise, or "past" with
 * the most recent past date. Adding a date to an on-request doctor moves
 * them to "upcoming" automatically.
 */
export function doctorStatus(
  d: VisitingDoctor,
  today = todayKolkata(),
): { status: VisitStatus; date: string } {
  const visits = [...d.visits].sort();
  if (!visits.length) return { status: "on-request", date: "" };
  if (visits.includes(today)) return { status: "today", date: today };
  const next = visits.find((v) => v > today);
  if (next) return { status: "upcoming", date: next };
  return { status: "past", date: visits[visits.length - 1] };
}

/** Doctors split for the page sections and the homepage strip: bookable (today/upcoming, soonest first), on-request (data order) and past (most recent first). */
export function doctorsByStatus(today = todayKolkata()) {
  const rows = visitingDoctors.map((doctor) => ({
    doctor,
    ...doctorStatus(doctor, today),
  }));
  const upcoming = rows
    .filter((r) => r.status === "today" || r.status === "upcoming")
    .sort((a, b) => a.date.localeCompare(b.date));
  const onRequest = rows.filter((r) => r.status === "on-request");
  const past = rows
    .filter((r) => r.status === "past")
    .sort((a, b) => b.date.localeCompare(a.date));
  return { upcoming, onRequest, past };
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

/** "Visiting 27 October 2026" / "Last visit 8 October 2026". */
export function visitLabel(v: { date: string; kind: "next" | "last" }): string {
  return `${v.kind === "next" ? "Visiting" : "Last visit"} ${formatDate(v.date)}`;
}
