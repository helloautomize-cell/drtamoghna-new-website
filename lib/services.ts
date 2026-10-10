import type { BadgeSlug } from "./service-badges";

/**
 * Service, step and card data for the styleguide and home sections.
 * Copy is verbatim from resources/content/new-website-content.md (Home page)
 * and resources/docs/medcare-styleguide.html where the content file has none.
 */

export interface ServiceCard {
  title: string;
  line: string;
  badge: BadgeSlug;
  href: string;
}

export interface ServiceTab {
  label: string;
  intro: string;
  glow: "g1" | "g2" | "g3" | "g4";
  cards: ServiceCard[];
}

export const serviceTabs: ServiceTab[] = [
  {
    label: "Diabetes and weight",
    intro: "From a first high sugar report to insulin and foot care, at every stage.",
    glow: "g1",
    cards: [
      {
        title: "Diabetes care",
        line: "Type 1, type 2 and other types, managed for the long term",
        badge: "diabetes",
        href: "/diabetes-care/",
      },
      {
        title: "Diabetes in pregnancy",
        line: "Careful sugar control for you and your baby",
        badge: "gdm",
        href: "/diabetes-care/diabetes-in-pregnancy/",
      },
      {
        title: "Diabetic foot care",
        line: "Checks, wound care advice and protection for at-risk feet",
        badge: "diabetic-foot",
        href: "/diabetes-care/diabetic-foot-care/",
      },
      {
        title: "CGM, insulin and diet counselling",
        line: "See your sugar day and night, and learn to act on it",
        badge: "cgm",
        href: "/diabetes-care/continuous-glucose-monitoring/",
      },
      {
        title: "Obesity and weight management",
        line: "A medical plan for weight, with tests and follow-up",
        badge: "weight",
        href: "/weight-management/",
      },
      {
        title: "GLP-1 weight-loss medicines",
        line: "Honest assessment of whether these medicines suit you",
        badge: "glp1",
        href: "/weight-management/glp-1-medicines/",
      },
    ],
  },
  {
    label: "Heart",
    intro: "For high BP, breathlessness, palpitations, and heart checks in people with diabetes.",
    glow: "g2",
    cards: [
      {
        title: "Heart health",
        line: "Find and manage your heart risk early",
        badge: "heart",
        href: "/heart-health/",
      },
      {
        title: "High blood pressure",
        line: "Confirm, treat and track BP, including 24-hour monitoring",
        badge: "blood-pressure",
        href: "/heart-health/high-blood-pressure/",
      },
      {
        title: "Heart failure care",
        line: "Ongoing care to keep you active and out of hospital",
        badge: "heart-failure",
        href: "/heart-health/heart-failure/",
      },
      {
        title: "Echocardiography",
        line: "Heart ultrasound with strain imaging, done by Dr. Das",
        badge: "echo",
        href: "/heart-health/echocardiography/",
      },
      {
        title: "Holter monitoring",
        line: "A small patch that records your heartbeat for days",
        badge: "holter",
        href: "/heart-health/holter-monitoring/",
      },
    ],
  },
  {
    label: "Internal medicine",
    intro: "Care for adults with everyday and long-standing medical problems.",
    glow: "g3",
    cards: [
      {
        title: "Internal medicine",
        line: "Adult medical care from an MD physician",
        badge: "internal-medicine",
        href: "/internal-medicine/",
      },
      {
        title: "Fever and infections",
        line: "Dengue, malaria, typhoid and other fevers",
        badge: "fever",
        href: "/internal-medicine/fever-and-infections/",
      },
      {
        title: "Fatty liver",
        line: "Find the cause, check the liver, and protect it",
        badge: "liver",
        href: "/internal-medicine/fatty-liver/",
      },
      {
        title: "Joint pain and arthritis",
        line: "Sort out the cause and ease the pain",
        badge: "joints",
        href: "/internal-medicine/joint-pain-arthritis/",
      },
      {
        title: "Migraine and headache",
        line: "Fewer, milder attacks with a clear plan",
        badge: "headache",
        href: "/internal-medicine/migraine-headache/",
      },
      {
        title: "Anaemia",
        line: "Find out why your haemoglobin is low",
        badge: "anaemia",
        href: "/internal-medicine/anaemia/",
      },
    ],
  },
  {
    label: "Thyroid, lungs and sleep",
    intro: "Hormones, breathing and sleep, tested and treated in one place.",
    glow: "g4",
    cards: [
      {
        title: "Thyroid disorders",
        line: "Underactive, overactive and thyroid in pregnancy",
        badge: "thyroid",
        href: "/thyroid-disorders/",
      },
      {
        title: "Asthma and COPD",
        line: "Breathing tests and inhaler plans that work",
        badge: "lungs",
        href: "/asthma-copd/",
      },
      {
        title: "Sleep apnea",
        line: "Loud snoring and daytime sleepiness, tested and treated",
        badge: "sleep",
        href: "/sleep-apnea/",
      },
    ],
  },
  {
    label: "Check-ups",
    intro: "Planned by the doctor after a consultation, so no test is wasted.",
    glow: "g1",
    cards: [
      {
        title: "Preventive health check-ups",
        line: "Planned by the doctor, so no test is wasted",
        badge: "checkup",
        href: "/health-check-ups/",
      },
    ],
  },
];

export const visitSteps = [
  {
    name: "Book",
    text: "Use the form, call 60031 21297 or WhatsApp 60031 21297 or 93651 75235. We confirm your time within 30 to 60 minutes during clinic hours.",
    mock: "booking" as const,
  },
  {
    name: "Arrive and register",
    text: "Bring your old prescriptions, reports and the medicines you take. If you have diabetes, bring your sugar diary or meter.",
    mock: null,
    img: "reception" as const,
  },
  {
    name: "Consultation",
    text: "Dr. Das listens to your concerns, asks about your history and examines you. There is time for your questions.",
    mock: null,
    img: "consultation" as const,
  },
  {
    name: "Tests if needed",
    text: "Many tests, such as ECG, echo and HbA1c, can be done the same day. Blood tests are done through our lab partner, Agilus. Samples are collected at Medcare and reports are given at the clinic.",
    mock: null,
    img: "echoScreen" as const,
  },
  {
    name: "Your plan",
    text: "Dr. Das explains the results in plain words and writes a plan you can follow at home: medicines, food, activity and when to come back.",
    mock: null,
    img: "writingPlan" as const,
  },
  {
    name: "Follow-up",
    text: "You return for review as planned. Between visits you can send reports on WhatsApp so the clinic knows they have arrived.",
    mock: "whatsapp" as const,
  },
];

export interface CarouselCard {
  icon: "droplet" | "gauge" | "heartpulse" | "weight" | "moon" | "thermometer";
  title: string;
  sub: string;
  text: string;
}

export const centredCards: CarouselCard[] = [
  {
    icon: "droplet",
    title: "Type 2 diabetes",
    sub: "Long-term control, early checks",
    text: "Personal targets, food first, medicines when needed, and yearly checks for eyes, kidneys, feet and heart.",
  },
  {
    icon: "gauge",
    title: "High blood pressure",
    sub: "Confirmed properly, treated early",
    text: "Clinic and home readings, 24-hour monitoring when needed, and a plan to reach target.",
  },
  {
    icon: "heartpulse",
    title: "Echocardiography",
    sub: "Heart ultrasound with strain imaging",
    text: "Performed and explained by Dr. Das. No fasting, no radiation, about 20 to 40 minutes.",
  },
  {
    icon: "weight",
    title: "Weight and obesity",
    sub: "Health, not just a number",
    text: "Body composition, causes checked, and a plan you can keep, with medicines only when suitable.",
  },
  {
    icon: "moon",
    title: "Sleep apnea",
    sub: "Loud snoring, daytime sleepiness",
    text: "A sleep study, then treatment that can improve energy and blood pressure.",
  },
  {
    icon: "thermometer",
    title: "Monsoon fevers",
    sub: "Dengue, malaria, scrub typhus",
    text: "The right tests for the day of fever, and clear warning signs to watch.",
  },
];

export const whyCards = [
  {
    icon: "user" as const,
    title: "One physician who knows your history",
    text: "Dr. Tamoghna Das sees every patient himself and follows you over time, so you do not repeat your story at each visit.",
  },
  {
    icon: "activity" as const,
    title: "Most tests in one place",
    text: "ECG, echo, Holter, 24-hour BP, HbA1c, spirometry, body composition, foot checks and sleep studies are done right here.",
  },
  {
    icon: "heart" as const,
    title: "Heart checks for people with diabetes",
    text: "Echocardiography with strain imaging can show early changes in heart muscle function, sometimes before symptoms appear.",
  },
  {
    icon: "shield" as const,
    title: "Prevention, not only treatment",
    text: "We look for early signs of complications in the eyes, kidneys, nerves, feet and heart, and act on them early.",
  },
  {
    icon: "clock" as const,
    title: "Open seven days",
    text: "Monday to Saturday 9 am to 8:30 pm, Sunday 9 am to 3:30 pm. Ground floor, with a wheelchair available.",
  },
  {
    icon: "languages" as const,
    title: "Clear words, in your language",
    text: "Dr. Das speaks English, Assamese, Bengali, Bodo and Hindi, and explains every report before you leave.",
  },
];
