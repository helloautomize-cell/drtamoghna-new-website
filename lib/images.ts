/**
 * Typed map of published images. Components import from here;
 * no hard-coded image paths in components.
 */
export type SiteImage = { src: string; width: number; height: number; alt: string };

const B = "/images";

export const images = {
  heroDesktop: {
    src: `${B}/doctors/dr-das-hero.jpg`,
    width: 793,
    height: 1190,
    alt: "Dr. Tamoghna Das, physician at Medcare Diabetes & Obesity Clinic, Bongaigaon, in a white coat with a stethoscope",
  },
  heroMobile: {
    src: `${B}/doctors/dr-das-hero-mobile.jpg`,
    width: 793,
    height: 991,
    alt: "Dr. Tamoghna Das, physician at Medcare Diabetes & Obesity Clinic, Bongaigaon, in a white coat with a stethoscope",
  },
  portrait: {
    src: `${B}/doctors/dr-das-portrait.jpg`,
    width: 793,
    height: 991,
    alt: "Dr. Tamoghna Das, physician at Medcare Diabetes & Obesity Clinic, Bongaigaon, in a white coat with a stethoscope",
  },
  avatar: { src: `${B}/doctors/dr-das-avatar.jpg`, width: 512, height: 512, alt: "Dr. Tamoghna Das" },
  consultation: {
    src: `${B}/doctors/dr-das-consultation.jpg`,
    width: 1536,
    height: 960,
    alt: "Dr. Tamoghna Das explaining a report to a patient during a consultation at Medcare",
  },
  consultation3x2: {
    src: `${B}/doctors/dr-das-consultation-3x2.jpg`,
    width: 1536,
    height: 1024,
    alt: "Dr. Tamoghna Das explaining a report to a patient during a consultation at Medcare",
  },
  writingPlan: {
    src: `${B}/doctors/dr-das-writing-plan.jpg`,
    width: 910,
    height: 569,
    alt: "Dr. Tamoghna Das writing a treatment plan at his desk",
  },
  cmeTalk: {
    src: `${B}/doctors/dr-das-api-cme-talk.jpg`,
    width: 1280,
    height: 853,
    alt: "Dr. Tamoghna Das speaking at the Association of Physicians of India Mid Term CME, Assam State Chapter",
  },
  plaques: {
    src: `${B}/doctors/dr-das-plaques.jpg`,
    width: 1536,
    height: 1024,
    alt: "Plaques from the RSSDI Assam Chapter Mid-Term CME 2022 and HEPATOCON 2024",
  },
  awardsShelf: {
    src: `${B}/clinic/dr-das-awards-shelf.jpg`,
    width: 915,
    height: 645,
    alt: "",
  },
  consultationRoom: {
    src: `${B}/clinic/clinic-consultation-room.jpg`,
    width: 1246,
    height: 934,
    alt: "Dr. Tamoghna Das at his desk in the consultation room at Medcare, Bongaigaon",
  },
  echoScreen: {
    src: `${B}/clinic/echo-screen.jpg`,
    width: 1536,
    height: 1024,
    alt: "Echocardiography images with Doppler measurements on the screen of the echo system at Medcare",
  },
  exteriorWide: {
    src: `${B}/clinic/clinic-exterior-wide.jpg`,
    width: 1320,
    height: 742,
    alt: "Front of Medcare Diabetes & Obesity Clinic on Chapaguri Road, North Bongaigaon, at dusk",
  },
  exterior: {
    src: `${B}/clinic/clinic-exterior.jpg`,
    width: 1320,
    height: 880,
    alt: "Front of Medcare Diabetes & Obesity Clinic on Chapaguri Road, North Bongaigaon, at dusk",
  },
  reception: {
    src: `${B}/clinic/clinic-reception.jpg`,
    width: 1536,
    height: 960,
    alt: "Reception desk at Medcare, where patients register on arrival",
  },
  examRoom: {
    src: `${B}/clinic/clinic-exam-room.jpg`,
    width: 1536,
    height: 1024,
    alt: "Examination couch behind privacy curtains at Medcare",
  },
  doorSign: {
    src: `${B}/clinic/clinic-door-sign.jpg`,
    width: 1312,
    height: 875,
    alt: "Consultation room door sign for Dr. Tamoghna Das, MBBS, MD Internal Medicine, Gauhati Medical College",
  },
  openingDay: {
    src: `${B}/clinic/clinic-opening-day.jpg`,
    width: 1536,
    height: 1024,
    alt: "Medcare decorated with marigold garlands on its opening day in September 2023",
  },
  echoLoop: {
    src: `${B}/video/echo-room-loop.mp4`,
    width: 960,
    height: 540,
    alt: "Dr. Tamoghna Das performing an echocardiogram at Medcare",
  },
  echoPoster: {
    src: `${B}/video/echo-room-poster.jpg`,
    width: 960,
    height: 540,
    alt: "Dr. Tamoghna Das performing an echocardiogram at Medcare",
  },
} as const satisfies Record<string, SiteImage>;

export type ImageKey = keyof typeof images;
