import { siteConfig } from "./site-config";

/**
 * schema.ts · Site-wide JSON-LD graph (site-plan section 7).
 * One @graph emitted in the root layout: WebSite, MedicalClinic (#clinic)
 * and Physician (#dr-tamoghna-das). Per-page nodes (BreadcrumbList,
 * MedicalWebPage, FAQPage, BlogPosting) are added by each page.
 *
 * Compliance: no AggregateRating, no Review (IMC rules).
 * Geo and GeoCircle omitted until the Maps-pin lat/long is confirmed
 * (TODO_CONFIRM in site-config).
 */

const base =
  siteConfig.siteUrl || "https://drtamoghna-new-website.vercel.app";

export const inHouseTests = [
  "Echocardiography with strain imaging",
  "Patch Holter monitoring",
  "Continuous glucose monitoring (CGM)",
  "ECG",
  "Blood sugar finger-prick check",
  "HbA1c point-of-care test",
  "Body composition analysis",
  "Diabetic foot nerve and circulation check",
  "Spirometry (lung function test)",
  "24-hour blood pressure monitoring (ABPM)",
  "Sleep study",
];

const areaServed = [
  // Tier 1: towns
  ...["Bongaigaon", "Abhayapuri", "Bijni", "Chapaguri"].map((name) => ({
    "@type": "City",
    name,
  })),
  // Tier 2: districts
  ...[
    "Bongaigaon",
    "Chirang",
    "Kokrajhar",
    "Dhubri",
    "Goalpara",
    "Barpeta",
    "Bodoland Territorial Region",
  ].map((name) => ({ "@type": "AdministrativeArea", name })),
  // Tier 3: the 8 Northeast states
  ...[
    "Assam",
    "Arunachal Pradesh",
    "Meghalaya",
    "Nagaland",
    "Manipur",
    "Mizoram",
    "Tripura",
    "Sikkim",
  ].map((name) => ({ "@type": "State", name })),
];

const memberships = [
  "Association of Physicians of India (API)",
  "Research Society for the Study of Diabetes in India (RSSDI)",
  "Indian Medical Association (IMA)",
  "Indian Academy of Echocardiography (IAE)",
  "European Society of Cardiology (ESC)",
  "European Association of Cardiovascular Imaging (EACVI)",
  "Heart Failure Association of the ESC (HFA)",
  "Heart Failure Association of India (HFAI)",
  "Indian Society of Critical Care Medicine (ISCCM)",
  "Clinical Cardio-Diabetic Society of India (CCDSI)",
  "Doctors AI",
];

export const physicianNode = {
  "@type": "Physician",
  "@id": `${base}/#dr-tamoghna-das`,
  name: siteConfig.doctor.name,
  honorificSuffix: "MBBS, MD",
  medicalSpecialty: ["Internal medicine", "Endocrine", "Cardiovascular"],
  alumniOf: [
    "Gauhati Medical College and Hospital",
    "JROP Institute, Delhi",
    "IMMAST, Mumbai",
    "Parul University",
  ].map((name) => ({ "@type": "Organization", name })),
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "degree",
      name: "MBBS, Gauhati Medical College and Hospital",
    },
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "degree",
      name: "MD (Medicine)",
    },
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Medical registration",
      name: siteConfig.doctor.registration,
      recognizedBy: {
        "@type": "Organization",
        name: siteConfig.doctor.registrationBody,
      },
      identifier: siteConfig.doctor.registrationNumber,
    },
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Certificate of Completion",
      name: "Certificate Course on Artificial Intelligence in Medicine (CCAIM)",
      description: "Batch 4, 4 months, June to September 2026. Approved by Universal AI University; conducted by Doctors AI Education and Research Foundation and the Indian College of Artificial Intelligence in Medicine (ICAIM). Certificate issued 18 September 2026.",
    },
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Certificate of Achievement",
      name: "Competency Enhancement Program: Training on AI in Medicine",
      description: "42 hours, Healthcare Sector Skill Council. Issued 18 September 2026.",
    },
  ],
  memberOf: memberships.map((name) => ({ "@type": "Organization", name })),
  award: "COVID-19 award for exemplary service, Rangiya Division (N.F. Railway), 2021",
  knowsLanguage: siteConfig.doctor.languageCodes,
  sameAs: [
    siteConfig.doctor.social.linkedin,
    siteConfig.doctor.social.x,
    siteConfig.doctor.social.facebook,
  ],
  // Dr. Das's own consultation hours; the clinic's wider hours are on
  // the MedicalClinic node below.
  openingHoursSpecification: siteConfig.doctor.consultHours.specs.map((s) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [...s.dayOfWeek],
    opens: s.opens,
    closes: s.closes,
  })),
  worksFor: { "@id": `${base}/#clinic` },
  subjectOf: [
    {
      "@type": "ScholarlyArticle",
      name: "Prevalence of stage B heart failure in patients undergoing echocardiography during regular clinical practice",
      isPartOf: { "@type": "Periodical", name: "Indian Heart Journal" },
      datePublished: "2025",
    },
    {
      "@type": "ScholarlyArticle",
      name: "Cryptogenic Burkholderia cepacia Sepsis in a Haemoglobin E Disease Patient with Splenic and Hepatic Abscesses",
      author: ["S Baruah", "B Thakuria", "T Das", "S Kalunkhe"].map((name) => ({ "@type": "Person", name })),
      genre: "Case report",
      description: "Department of Medicine, Gauhati Medical College.",
      isPartOf: {
        "@type": "PublicationIssue",
        issueNumber: "2",
        isPartOf: {
          "@type": "PublicationVolume",
          volumeNumber: "7",
          isPartOf: { "@type": "Periodical", name: "Assam Journal of Internal Medicine" },
        },
      },
      datePublished: "2017-07",
      pagination: "38",
    },
    {
      "@type": "PresentationDigitalDocument",
      name: "Optimizing the Design of an Artificial Pancreas to Improve Diabetes Management",
      description: "Speaker, World Congress of Diabetes Technology & Therapeutics (DTech 2025), Jaipur, 9 to 11 May 2025. Talk: Optimizing the Design of an Artificial Pancreas to Improve Diabetes Management.",
      author: { "@id": `${base}/#dr-tamoghna-das` },
    },
  ],
};

export const clinicNode = {
  "@type": "MedicalClinic",
  "@id": `${base}/#clinic`,
  name: siteConfig.name,
  alternateName: ["Medcare", "Medcare Clinic Bongaigaon"],
  url: `${base}/`,
  image: "https://www.medcare.org.in/images/medcare-storefront.jpg",
  logo: `${base}/brand/medcare-logo.png`,
  // Maps pin resolved via g.page -> place id 0x3758ffe383475f4b, CID below.
  // geo + GeoCircle stay omitted: exact lat/long still TODO_CONFIRM.
  hasMap: "https://www.google.com/maps?cid=18284086181285239697",
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.streetAddress,
    addressLocality: siteConfig.address.locality,
    addressRegion: siteConfig.address.region,
    postalCode: siteConfig.address.postalCode,
    addressCountry: siteConfig.address.country,
  },
  telephone: siteConfig.phone.schema,
  contactPoint: siteConfig.whatsapp.numbers.map((n) => ({
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone: n.schema,
    url: `https://wa.me/${n.wa}`,
    availableLanguage: siteConfig.doctor.languageCodes,
  })),
  email: siteConfig.email,
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: siteConfig.hours.weekday.opens,
      closes: siteConfig.hours.weekday.closes,
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: siteConfig.hours.sunday.opens,
      closes: siteConfig.hours.sunday.closes,
    },
  ],
  foundingDate: siteConfig.foundingDate,
  founder: { "@id": `${base}/#dr-tamoghna-das` },
  employee: { "@id": `${base}/#dr-tamoghna-das` },
  medicalSpecialty: ["Endocrine", "Cardiovascular", "Pulmonary"],
  knowsAbout: [
    "Diabetes",
    "Obesity and weight management",
    "Heart health",
    "Thyroid disorders",
    "Asthma and COPD",
    "Sleep apnea",
    "Internal medicine",
  ],
  availableService: inHouseTests.map((name) => ({
    "@type": "MedicalTest",
    name,
  })),
  paymentAccepted: siteConfig.paymentAccepted,
  currenciesAccepted: siteConfig.currenciesAccepted,
  amenityFeature: siteConfig.amenities.map((name) => ({
    "@type": "LocationFeatureSpecification",
    name,
    value: true,
  })),
  areaServed,
  sameAs: [
    siteConfig.mapsUrl,
    siteConfig.social.facebook,
    siteConfig.social.instagram,
  ],
  // Online appointment request page (hourly slots, confirmed by phone).
  potentialAction: {
    "@type": "ReserveAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${base}/book/`,
      actionPlatform: [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/MobileWebPlatform",
      ],
    },
    result: { "@type": "Reservation", name: "Appointment request" },
  },
};

export const websiteNode = {
  "@type": "WebSite",
  "@id": `${base}/#website`,
  url: `${base}/`,
  name: siteConfig.name,
  inLanguage: "en-IN",
  publisher: { "@id": `${base}/#clinic` },
};

export const siteGraph = {
  "@context": "https://schema.org",
  "@graph": [websiteNode, clinicNode, physicianNode],
};

export function breadcrumbJsonLd(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${base}${item.href}`,
    })),
  };
}
