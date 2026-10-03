/**
 * site-config.ts · Single source of facts for Medcare Diabetes & Obesity Clinic.
 * Every value comes from resources/docs/client-answers.md. Nothing invented.
 * Anything awaiting Dr. Das's confirmation is listed in TODO_CONFIRM.
 */

export const siteConfig = {
  name: "Medcare Diabetes & Obesity Clinic",
  shortName: "Medcare",
  tagline: "Diabetes, weight, heart and thyroid care in Bongaigaon",

  // Q21: canonical NAP, word for word. Display breaks per client-answers.
  address: {
    full: "Medcare Diabetes & Obesity Clinic, Chapaguri Road, opposite Domino's, North Bongaigaon, Gurunanak Nagar, Bongaigaon, Assam 783380",
    lines: [
      "Chapaguri Road, opposite Domino's",
      "North Bongaigaon, Gurunanak Nagar",
      "Bongaigaon, Assam 783380",
    ],
    streetAddress: "Chapaguri Road, opposite Domino's, Gurunanak Nagar",
    locality: "Bongaigaon",
    region: "Assam",
    regionCode: "AS",
    postalCode: "783380",
    country: "IN",
  },
  mapsUrl: "https://maps.app.goo.gl/pywFP4CULqxi2RBGA", // Q6
  reviewUrl: "https://g.page/r/CZGbIjaCH779EBM/review", // Q6

  // Q22: OPD hours, open 7 days.
  hours: {
    weekday: { days: "Mon to Sat", opens: "09:00", closes: "20:30", display: "9 am to 8:30 pm" },
    sunday: { days: "Sun", opens: "09:00", closes: "15:30", display: "9 am to 3:30 pm" },
    display: "Mon to Sat 9 am to 8:30 pm · Sun 9 am to 3:30 pm",
    openDaysLabel: "Open 7 days",
  },

  // Q24: two different numbers, labelled clearly.
  phone: {
    display: "60031 21297",
    displayIntl: "+91 60031 21297",
    tel: "+916003121297",
    schema: "+91-6003121297",
  },
  whatsapp: {
    display: "98642 66191",
    wa: "919864266191",
    // Message pattern lives in lib/whatsapp.ts (single source).
  },
  email: "medcarebongaigaon@gmail.com", // Q25, obfuscated in HTML

  emergencyLine: "Medical emergency? Call 108 or 112.",

  doctor: {
    name: "Dr. Tamoghna Das",
    qualifications: "MBBS, MD (Medicine)",
    titleLine:
      "Consultant physician in internal medicine, diabetes and heart health, with advanced training in echocardiography",
    shortTitle: "Internal Medicine and Cardio-Diabetic Consultant",
    registration: "Assam Council of Medical Registration No. 20276",
    registrationNumber: "20276",
    registrationBody: "Assam Council of Medical Registration",
    languages: ["English", "Assamese", "Bengali", "Bodo", "Hindi"],
    languageCodes: ["en", "as", "bn", "brx", "hi"],
    experience: "more than 15 years",
    experienceSpecialist: "more than 10 years as a specialist",
    experienceChip: "15+ years",
  },

  foundingDate: "2023-09", // Q20
  foundedDisplay: "since 2023",

  // Q26
  bookingConfirmation: "30 to 60 minutes",

  // Q27
  amenities: ["Ground floor", "Wheelchair available"],

  // Q33
  paymentAccepted: "Cash, UPI, Credit Card, Debit Card",
  currenciesAccepted: "INR",

  // Q55
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61551113781226",
    instagram: "https://www.instagram.com/medcarebongaigaon/",
  },

  // Q54b: manual mode until go-live, hidden while value is null.
  googleRating: {
    value: null as number | null,
    count: null as number | null,
    checkedOn: null as string | null,
    source: "manual" as "manual" | "places-api",
  },

  // Q52: becomes the launch date.
  legalLastUpdated: null as string | null,

  siteIndexable: process.env.SITE_INDEXABLE === "true",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "",
} as const;

/**
 * [CONFIRM] items from client-answers.md that the UI touches.
 * Rendered as yellow chips in development, hidden in production.
 */
/**
 * Standard legal identity block, used where content marks {IDENTITY}.
 * Verbatim from new-website-content.md Part 6.
 */
export const IDENTITY =
  'This website is run by Medcare Diabetes & Obesity Clinic ("Medcare", "we", "us"), Chapaguri Road, opposite Domino\'s, North Bongaigaon, Gurunanak Nagar, Bongaigaon, Assam 783380, owned by Dr. Tamoghna Das. Phone: +91 60031 21297. Email: medcarebongaigaon@gmail.com.';

export const TODO_CONFIRM = [
  "Exact lat/long from the Maps pin (Q21)",
  "Floor or building name for the address (Q21)",
  "Holiday hours: open, short hours or closed (Q22)",
  "Whether Dr. Das personally covers all OPD hours (Q22)",
  "Whether 98642 66191 is a clinic or personal phone (Q24)",
  "Any step at the clinic entrance; parking type (Q27)",
  "Nearest railway station and bus stand, distance to clinic (Q28)",
  "Bhutan border towns mention OK (Q28)",
  "Sleep study: home kit or overnight at the clinic (Q30)",
  "Refund of mistaken payments within 7 working days (Q35)",
  "Current Google rating and review count from the GBP (Q54b)",
  "Device maker portals for Holter, CGM or echo data (Q48)",
  "Consent form names the website (Q44)",
  "Assam Clinical Establishments registration number (Q46)",
  "Last reviewed date: set at Dr. Das sign-off (Q58)",
] as const;
