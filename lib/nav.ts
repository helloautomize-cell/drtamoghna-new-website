import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Baby,
  Bone,
  Brain,
  ClipboardCheck,
  Droplet,
  Droplets,
  FlaskConical,
  Footprints,
  Gauge,
  Heart,
  HeartPulse,
  MoonStar,
  PersonStanding,
  Pill,
  Scale,
  Stethoscope,
  TestTube,
  Thermometer,
  Timer,
  Waves,
  Wind,
  ScanHeart,
  ShieldCheck,
} from "lucide-react";

/**
 * nav.ts · Single source for site navigation (site-plan section 3, verbatim).
 * Desktop mega menus, the mobile accordion menu and the footer columns all
 * read from this one structure.
 */

export type NavLink = {
  label: string;
  href: string;
  icon?: LucideIcon;
};

export type NavColumn = {
  heading: string;
  links: NavLink[];
};

export type MegaMenu = {
  id: "diabetes-weight" | "heart-health" | "more-care";
  label: string;
  columns: NavColumn[];
  /** CSS grid template for the link columns (doctor card appended by CSS). */
  grid: string;
};

/* ----------------------------- Mega menus ----------------------------- */

export const megaMenus: MegaMenu[] = [
  {
    id: "diabetes-weight",
    label: "Diabetes and weight",
    grid: "repeat(3, minmax(0, 1fr))",
    columns: [
      {
        heading: "Diabetes",
        links: [
          { label: "Diabetes care", href: "/diabetes-care/", icon: Droplets },
          {
            label: "Diabetes in pregnancy",
            href: "/diabetes-care/diabetes-in-pregnancy/",
            icon: Baby,
          },
          {
            label: "Diabetic foot care",
            href: "/diabetes-care/diabetic-foot-care/",
            icon: Footprints,
          },
          {
            label: "CGM, insulin and diet counselling",
            href: "/diabetes-care/continuous-glucose-monitoring/",
            icon: Activity,
          },
        ],
      },
      {
        heading: "Weight",
        links: [
          {
            label: "Obesity and weight management",
            href: "/weight-management/",
            icon: Scale,
          },
          {
            label: "GLP-1 weight-loss medicines",
            href: "/weight-management/glp-1-medicines/",
            icon: Pill,
          },
        ],
      },
      {
        heading: "Tests",
        links: [
          { label: "HbA1c", href: "/diabetes-care/#hba1c", icon: TestTube },
          {
            label: "Body composition",
            href: "/weight-management/#body-composition",
            icon: PersonStanding,
          },
          {
            label: "Foot nerve and circulation check",
            href: "/diabetes-care/diabetic-foot-care/#foot-check",
            icon: Footprints,
          },
        ],
      },
    ],
  },
  {
    id: "heart-health",
    label: "Heart health",
    grid: "repeat(2, minmax(0, 1fr))",
    columns: [
      {
        heading: "Care",
        links: [
          { label: "Heart health overview", href: "/heart-health/", icon: HeartPulse },
          {
            label: "High blood pressure",
            href: "/heart-health/high-blood-pressure/",
            icon: Gauge,
          },
          {
            label: "Heart failure care",
            href: "/heart-health/heart-failure/",
            icon: Heart,
          },
        ],
      },
      {
        heading: "Tests",
        links: [
          {
            label: "Echocardiography with strain imaging",
            href: "/heart-health/echocardiography/",
            icon: ScanHeart,
          },
          {
            label: "Holter monitoring",
            href: "/heart-health/holter-monitoring/",
            icon: Timer,
          },
          { label: "ECG", href: "/heart-health/#ecg", icon: Activity },
          {
            label: "24-hour BP monitoring",
            href: "/heart-health/high-blood-pressure/#abpm",
            icon: Waves,
          },
        ],
      },
    ],
  },
  {
    id: "more-care",
    label: "More care",
    grid: "repeat(3, minmax(0, 1fr))",
    columns: [
      {
        heading: "Hormones, lungs and sleep",
        links: [
          { label: "Thyroid disorders", href: "/thyroid-disorders/", icon: ShieldCheck },
          { label: "Asthma and COPD", href: "/asthma-copd/", icon: Wind },
          { label: "Sleep apnea", href: "/sleep-apnea/", icon: MoonStar },
        ],
      },
      {
        heading: "Internal medicine",
        links: [
          { label: "Overview", href: "/internal-medicine/", icon: Stethoscope },
          {
            label: "Fever and infections",
            href: "/internal-medicine/fever-and-infections/",
            icon: Thermometer,
          },
          {
            label: "Fatty liver",
            href: "/internal-medicine/fatty-liver/",
            icon: FlaskConical,
          },
          {
            label: "Joint pain and arthritis",
            href: "/internal-medicine/joint-pain-arthritis/",
            icon: Bone,
          },
          {
            label: "Migraine and headache",
            href: "/internal-medicine/migraine-headache/",
            icon: Brain,
          },
          { label: "Anaemia", href: "/internal-medicine/anaemia/", icon: Droplet },
        ],
      },
      {
        heading: "Prevention",
        links: [
          {
            label: "Preventive health check-ups",
            href: "/health-check-ups/",
            icon: ClipboardCheck,
          },
        ],
      },
    ],
  },
];

export const headerLinks: NavLink[] = [
  { label: "Dr. Das", href: "/dr-tamoghna-das/" },
  { label: "About", href: "/about/" },
];

/* ----------------------------- Mobile menu ----------------------------- */
/* Site-plan section 3: accordion groups, all collapsed; leaf items are
   plain 48px rows. */

export type MobileNavItem =
  | { type: "group"; label: string; links: NavLink[] }
  | { type: "link"; label: string; href: string };

const diabetesWeightLinks: NavLink[] = [
  ...megaMenus[0].columns[0].links,
  ...megaMenus[0].columns[1].links,
  ...megaMenus[0].columns[2].links,
];
const heartLinks: NavLink[] = [
  ...megaMenus[1].columns[0].links,
  ...megaMenus[1].columns[1].links,
];
const hormonesLungsSleepLinks: NavLink[] = megaMenus[2].columns[0].links;
const internalMedicineLinks: NavLink[] = megaMenus[2].columns[1].links;

export const mobileNav: MobileNavItem[] = [
  { type: "group", label: "Diabetes and weight", links: diabetesWeightLinks },
  { type: "group", label: "Heart health", links: heartLinks },
  { type: "group", label: "Hormones, lungs and sleep", links: hormonesLungsSleepLinks },
  { type: "group", label: "Internal medicine", links: internalMedicineLinks },
  { type: "group", label: "Check-ups", links: megaMenus[2].columns[2].links },
  { type: "link", label: "Dr. Tamoghna Das", href: "/dr-tamoghna-das/" },
  { type: "link", label: "About Medcare", href: "/about/" },
  { type: "link", label: "Plan your visit", href: "/plan-your-visit/" },
  {
    type: "link",
    label: "Coming from outside Bongaigaon",
    href: "/coming-from-outside-bongaigaon/",
  },
  { type: "link", label: "Health Library", href: "/health-library/" },
  { type: "link", label: "FAQs", href: "/faqs/" },
  { type: "link", label: "Contact", href: "/contact/" },
];

/* ------------------------------- Footer ------------------------------- */

export const footerColumns: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Diabetes and weight",
    links: [
      megaMenus[0].columns[0].links[0],
      megaMenus[0].columns[0].links[1],
      megaMenus[0].columns[0].links[2],
      megaMenus[0].columns[0].links[3],
      megaMenus[0].columns[1].links[0],
      megaMenus[0].columns[1].links[1],
    ],
  },
  {
    heading: "Heart health",
    links: [
      { label: "Heart health", href: "/heart-health/" },
      megaMenus[1].columns[0].links[1],
      megaMenus[1].columns[0].links[2],
      megaMenus[1].columns[1].links[0],
      megaMenus[1].columns[1].links[1],
    ],
  },
  {
    heading: "More care",
    links: [
      megaMenus[2].columns[0].links[0],
      megaMenus[2].columns[0].links[1],
      megaMenus[2].columns[0].links[2],
      ...megaMenus[2].columns[1].links,
      megaMenus[2].columns[2].links[0],
    ],
  },
  {
    heading: "Patient information",
    links: [
      { label: "Plan your visit", href: "/plan-your-visit/" },
      {
        label: "Coming from outside Bongaigaon",
        href: "/coming-from-outside-bongaigaon/",
      },
      { label: "FAQs", href: "/faqs/" },
      { label: "Health Library", href: "/health-library/" },
      { label: "Contact", href: "/contact/" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy/" },
      { label: "Terms of Use", href: "/terms-of-use/" },
      { label: "Medical Disclaimer", href: "/medical-disclaimer/" },
      { label: "Editorial and Medical Review Policy", href: "/editorial-policy/" },
      { label: "Patient Rights and Responsibilities", href: "/patient-rights/" },
      {
        label: "Appointments, Cancellation and Refund",
        href: "/appointments-cancellation-refund/",
      },
      { label: "Accessibility Statement", href: "/accessibility/" },
    ],
  },
];

export const catchmentLine =
  "Patients come to us from Bongaigaon, Kokrajhar, Chirang, Dhubri, Goalpara, Barpeta and across the Northeast.";

export const footerTagline =
  "Physician-led care for diabetes, weight, heart health and more, in North Bongaigaon since 2023.";

/**
 * Routes that exist so far. Link prefetch is disabled for the rest so
 * unbuilt pages do not log 404s for their RSC prefetch requests. Add each
 * route here as its phase ships.
 */
export const builtRoutes = new Set([
  "/",
  "/styleguide/",
  "/about/",
  "/dr-tamoghna-das/",
  "/services/",
  "/plan-your-visit/",
  "/coming-from-outside-bongaigaon/",
  "/contact/",
  "/faqs/",
  "/health-library/",
  "/health-library/hba1c-explained/",
  "/health-library/echo-for-people-with-diabetes/",
  "/health-library/snoring-and-sleep-apnea/",
  "/diabetes-care/",
  "/diabetes-care/diabetes-in-pregnancy/",
  "/diabetes-care/diabetic-foot-care/",
  "/diabetes-care/continuous-glucose-monitoring/",
  "/weight-management/",
  "/weight-management/glp-1-medicines/",
  "/heart-health/",
  "/heart-health/high-blood-pressure/",
  "/heart-health/heart-failure/",
  "/heart-health/echocardiography/",
  "/heart-health/holter-monitoring/",
  "/thyroid-disorders/",
  "/sleep-apnea/",
  "/asthma-copd/",
  "/internal-medicine/",
  "/internal-medicine/fever-and-infections/",
  "/internal-medicine/fatty-liver/",
  "/internal-medicine/joint-pain-arthritis/",
  "/internal-medicine/migraine-headache/",
  "/internal-medicine/anaemia/",
  "/health-check-ups/",
  "/privacy-policy/",
  "/terms-of-use/",
  "/medical-disclaimer/",
  "/editorial-policy/",
  "/patient-rights/",
  "/appointments-cancellation-refund/",
  "/accessibility/",
]);

export function routeExists(href: string): boolean {
  return builtRoutes.has(href.split("#")[0]);
}
