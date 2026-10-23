/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { images } from "@/lib/images";
import BookButton from "@/components/BookButton";
import UtilityBar from "@/components/UtilityBar";
import HeaderSpecimen from "@/components/HeaderSpecimen";
import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import ContrastTable from "@/components/ContrastTable";
import GoogleRatingChip from "@/components/GoogleRatingChip";
import ConfirmChip from "@/components/ConfirmChip";
import WhyCards from "@/components/WhyCards";
import ServiceTabs from "@/components/ServiceTabs";
import BadgeGrid from "@/components/BadgeGrid";
import StepTracker from "@/components/StepTracker";
import CenteredCarousel from "@/components/CenteredCarousel";
import DoctorCard from "@/components/DoctorCard";
import { EmergencyCallout, ReviewerCallout, TipCallout } from "@/components/Callouts";
import PhoneFrame from "@/components/PhoneFrame";
import WhatsAppMenu from "@/components/WhatsAppMenu";
import Breadcrumbs from "@/components/Breadcrumbs";
import IconGrid from "@/components/IconGrid";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const photoRows = Object.entries(images).filter(([k]) => k !== "echoLoop");

const swatches: [string, string, string, string][] = [
  ["#00838F", "Primary · Medcare teal", "#00838F · 4.52:1 on white", "--primary"],
  ["#1E3D49", "Secondary · deep slate", "#1E3D49 · 11.55:1", "--secondary"],
  ["#007680", "Teal text", "#007680 · 5.38:1 · links, eyebrows", "--primary-500"],
  ["#006973", "Teal pressed", "#006973 · 6.43:1", "--primary-700"],
  ["#D9F1F3", "Teal tint", "#D9F1F3 · tabs, chips, tiles", "--primary-100"],
  ["#F1FAFB", "Teal wash", "#F1FAFB · section tints", "--primary-50"],
  ["#14303A", "Ink", "#14303A · text · 13.87:1", "--ink"],
  ["#4A6570", "Ink soft", "#4A6570 · captions · 6.20:1", "--ink-2"],
  ["#DCE9EC", "Line", "#DCE9EC · borders", "--line"],
  ["#2AD4D8", "Aqua · logo shine", "#2AD4D8 · glow only", "--aqua"],
  ["#F2A98B", "Peach", "#F2A98B · glow only", "--accent"],
  ["#C8302A", "Alert red", "#C8302A · emergency · 5.37:1", "--alert"],
  ["#2F7D5B", "Success", "#2F7D5B · 4.99:1", "--success"],
  ["#F2B233", "Star", "#F2B233 · rating icon only", "--star"],
];

const typeRows: [string, React.ReactNode][] = [
  [
    "Display · 64/68 · 700",
    <span className="t-display" key="d">
      Care that looks at the <em className="acc">whole</em> picture
    </span>,
  ],
  [
    "H1 · 52/58 · 700",
    <span className="t-h1" key="h1">
      Diabetes in <em className="acc">pregnancy</em>
    </span>,
  ],
  [
    "H2 · 40/48 · 650",
    <span className="t-h2" key="h2">
      Your first visit, step by step
    </span>,
  ],
  [
    "H3 · 22/30 · 600",
    <span className="t-h3" key="h3">
      What happens at Medcare
    </span>,
  ],
  [
    "Body large · 19/30",
    <span className="t-lg" key="lg">
      Echocardiography with strain imaging can show early changes in heart muscle function,
      sometimes before symptoms appear.
    </span>,
  ],
  [
    "Body · 17/28",
    <span key="b">
      Bring your old prescriptions, reports and the medicines you take. If you have diabetes, bring
      your sugar diary or meter.
    </span>,
  ],
  [
    "Small · 14/20 · 500",
    <span className="t-sm" key="sm">
      Written by {siteConfig.doctor.name} · 6 min read
    </span>,
  ],
  [
    "Eyebrow · 13 · 600",
    <span className="eyebrow" key="eb">
      03 / How we can help
    </span>,
  ],
  [
    "Devanagari (only if used)",
    <span className="deva" key="dv">
      मधुमेह · स्वास्थ्य जाँच
    </span>,
  ],
];

export default function StyleguidePage() {
  return (
    <div className="container-mc styleguide-body" style={{ paddingBlock: "0 96px" }}>
      {/* SITE SHELL SPECIMEN */}
      <section className="section-mc" style={{ borderTop: 0, paddingTop: 56 }}>
        <SectionHeading eyebrow="Site shell" title="Utility bar and" accent="header">
          Thin white utility bar with hours and the emergency line, then the sticky header with
          the logo, mega menus and the two-part Book button. The live versions are at the top of
          this page.
        </SectionHeading>
        <div className="shell" data-reveal>
          <UtilityBar />
          <HeaderSpecimen />
        </div>
      </section>

      {/* BREADCRUMBS */}
      <section className="section-mc">
        <SectionHeading eyebrow="Navigation" title="Breadcrumbs with" accent="JSON-LD">
          On every inner page. Emits a BreadcrumbList schema node; the current
          page is text, not a link.
        </SectionHeading>
        <div className="shell" data-reveal style={{ padding: "14px 20px" }}>
          <Breadcrumbs
            items={[
              { label: "Heart health", href: "/heart-health/" },
              { label: "Echocardiography", href: "/heart-health/echocardiography/" },
            ]}
          />
        </div>
      </section>

      {/* HERO */}
      <section className="section-mc">
        <SectionHeading eyebrow="Home hero" title="One doctor, one" accent="portrait">
          Dr. Das is the only doctor, so the hero is ONE large portrait card with a frosted name
          caption and one glass label off the face.
        </SectionHeading>
        <Hero />
      </section>

      {/* PALETTE */}
      <section className="section-mc" data-reveal>
        <SectionHeading eyebrow="Colour · locked" title="Medcare teal to deep" accent="slate">
          The teal is sampled from the Medcare logo. Bright aqua and warm peach are used only as
          soft glows, never for text.
        </SectionHeading>
        <div className="gradbar">
          <span>Brand gradient</span>
          <span>#00838F to #1E3D49</span>
        </div>
        <div className="swatches">
          {swatches.map(([hex, name, note, token]) => (
            <div className="sw" key={token}>
              <div
                style={{
                  background: hex,
                  borderBottom: hex === "#F1FAFB" ? "1px solid #DCE9EC" : undefined,
                }}
              />
              <p>
                <b>{name}</b>
                <span>{note}</span>
                <code>{token}</code>
              </p>
            </div>
          ))}
        </div>
        <ContrastTable />
        <div className="rules">
          <div>
            <h3>Do</h3>
            <ul>
              <li>
                White page background everywhere; tints only for chips, tabs, washes and glows
              </li>
              <li>One gradient surface per viewport</li>
              <li>Teal text #007680 for links and eyebrows, so they pass on tints too</li>
              <li>Peach and aqua only inside glows, blobs and badge highlights</li>
              <li>Red only for the emergency line and the emergency callout</li>
            </ul>
          </div>
          <div>
            <h3>Do not</h3>
            <ul>
              <li>Pure black text, or grey text lighter than #4A6570</li>
              <li>Teal #00838F for small text on tints (fails 4.5:1)</li>
              <li>Colours not in this palette (WhatsApp green only on the WhatsApp button)</li>
              <li>A red cross or red plus anywhere</li>
              <li>Dark full-width hero panels (ours is white with glows)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* LOGO */}
      <section className="section-mc" data-reveal>
        <SectionHeading eyebrow="Logo" title="Medcare logo in" accent="use">
          Original PNG next to the SVG redraw, at header size and full width, for approval. The
          heart mark alone is for the favicon and app icon.
        </SectionHeading>
        <div className="logo-cmp">
          <figure>
            <img
              src="/brand/medcare-logo.png"
              alt="Medcare logo, original PNG"
              style={{ width: 300 }}
            />
            <figcaption>Original PNG · 300 px wide</figcaption>
          </figure>
          <figure>
            <img
              src="/brand/medcare-logo.svg"
              alt="Medcare logo, SVG redraw"
              style={{ width: 300 }}
            />
            <figcaption>SVG redraw · 300 px wide</figcaption>
          </figure>
          <figure>
            <img
              src="/brand/medcare-logo.png"
              alt="Medcare logo, original PNG"
              style={{ height: 46, width: "auto" }}
            />
            <figcaption>Original PNG · 46 px tall</figcaption>
          </figure>
          <figure>
            <img
              src="/brand/medcare-logo.svg"
              alt="Medcare logo, SVG redraw"
              style={{ height: 46, width: "auto" }}
            />
            <figcaption>SVG redraw · 46 px tall</figcaption>
          </figure>
        </div>
        <div className="logos">
          <figure>
            <img src="/brand/medcare-logo.svg" alt="Medcare full logo" />
            <figcaption>Full · on white · clear space = height of the M bowl</figcaption>
          </figure>
          <figure className="on-grad">
            <img src="/brand/medcare-logo-white.svg" alt="Medcare white logo" />
            <figcaption>White · on gradient or slate</figcaption>
          </figure>
          <figure>
            <img src="/brand/medcare-mark.svg" alt="Medcare heart mark" style={{ maxHeight: 80 }} />
            <figcaption>Mark · favicon, app icon</figcaption>
          </figure>
        </div>
      </section>

      {/* TYPE */}
      <section className="section-mc" data-reveal>
        <SectionHeading
          eyebrow="Typography · locked"
          title="Figtree, with one"
          accent="serif accent"
        >
          Figtree for everything. Instrument Serif italic for a single accent word in a heading.
          Body text never drops below 17px.
        </SectionHeading>
        <div className="type-grid">
          {typeRows.map(([lab, node]) => (
            <div className="row" key={lab as string}>
              <span className="lab">{lab}</span>
              {node}
            </div>
          ))}
        </div>
      </section>

      {/* BUTTONS */}
      <section className="section-mc" data-reveal>
        <SectionHeading eyebrow="Buttons and links" title="Clear actions, gentle" accent="motion">
          The two-part Book button is the main action: teal icon block, deep slate label, single
          line.
        </SectionHeading>
        <div className="btns">
          <BookButton />
          <button className="btn btn-p" type="button">
            Book with Dr. Das
          </button>
          <a className="btn btn-s" href={`tel:${siteConfig.phone.tel}`}>
            Call {siteConfig.phone.display}
          </a>
          <WhatsAppMenu className="btn wa-btn">
            WhatsApp {siteConfig.whatsapp.display}
          </WhatsAppMenu>
          <a className="link-arrow" href="/dr-tamoghna-das/">
            View profile <ArrowRight size={18} strokeWidth={2} aria-hidden />
          </a>
        </div>
        <div className="btns">
          <GoogleRatingChip demo />
          <span style={{ fontSize: 14, color: "var(--ink-2)", maxWidth: 560 }}>
            Google rating chip: Visit band, Contact block and footer only. Never in the hero or next
            to Dr. Das. Manual numbers until launch; hidden while <code>googleRating.value</code> is
            null.
          </span>
        </div>
      </section>

      {/* WHY CARDS */}
      <section className="section-mc" data-reveal>
        <SectionHeading eyebrow="01 / Why Medcare" title="Care that looks at the" accent="whole">
          Diabetes, blood pressure, weight, the heart, the thyroid and sleep are closely linked. At
          Medcare, one doctor looks at them together, so nothing falls between two clinics.
        </SectionHeading>
        <WhyCards />
      </section>

      {/* SERVICE BADGES */}
      <section className="section-mc" data-reveal>
        <SectionHeading
          eyebrow="03 / How we can help"
          title="Conditions and tests,"
          accent="explained"
        >
          Each service is its badge on its own, floating on the section wash with a soft round glow.
          No box or arch behind it. Hover: the orbit ring spins once, the badge lifts and flips like
          a coin, a sheen passes and the arrow slides.
        </SectionHeading>
        <ServiceTabs />
      </section>

      {/* STEP TRACKER */}
      <section className="section-mc" data-reveal>
        <SectionHeading
          eyebrow="04 / Your first visit"
          title="Your first visit, step by"
          accent="step"
        >
          On the site this follows your scroll. Click a step or scroll the page. Inactive steps stay
          at 72% opacity so they still pass contrast. Steps 1 and 6 use code-built phone mock-ups;
          the rest are photo slots.
        </SectionHeading>
        <StepTracker />
      </section>

      {/* CENTRED CAROUSEL */}
      <section className="section-mc" data-reveal>
        <SectionHeading eyebrow="Health Library and conditions" title="Centred" accent="carousel">
          Side cards fade and tilt; the active dot widens into a pill. Arrows, dots or swipe.
        </SectionHeading>
        <CenteredCarousel />
      </section>

      {/* DOCTOR CARD */}
      <section className="section-mc" data-reveal>
        <SectionHeading eyebrow="05 / Meet your doctor" title="Meet" accent="Dr. Tamoghna Das">
          One doctor, so one wide feature card. Qualifications, role, experience and languages. No
          star ratings.
        </SectionHeading>
        <DoctorCard />
      </section>

      {/* CALLOUTS */}
      <section className="section-mc" data-reveal>
        <SectionHeading eyebrow="Callouts" title="Medical page" accent="notices" />
        <EmergencyCallout />
        <ReviewerCallout />
        <TipCallout />
        <p style={{ margin: 0, fontSize: 14, color: "var(--ink-2)" }}>
          The yellow <ConfirmChip>example</ConfirmChip> chip shows in development only. It is hidden
          in production, and <code>npm run launch-check</code> fails while any remain.
        </p>
      </section>

      {/* BADGE GRID */}
      <section className="section-mc" data-reveal>
        <SectionHeading eyebrow="Service badges" title="All 22 badges, three" accent="sizes">
          The client badges are used unchanged: teal-to-aqua line art on a white coin with a CSS
          ring. sm 56, md 112, lg 160 px.
        </SectionHeading>
        <BadgeGrid />
      </section>

      {/* MOBILE ACTION BAR */}
      <section className="section-mc" data-reveal>
        <SectionHeading eyebrow="Mobile" title="Fixed action bar, in Medcare" accent="teal">
          Shown on every page below 1024px. On this page the real bar is mounted: resize the window
          below 1024px to see it, or find the green WhatsApp button at the bottom right on desktop.
        </SectionHeading>
        <div className="phonewrap">
          <PhoneFrame />
          <div className="specs">
            <p>
              <b>Book Now</b> opens the appointment form (<code>/book/</code>).
            </p>
            <p>
              <b>Call Now</b> opens a sheet with one number: {siteConfig.phone.display}.
            </p>
            <p>
              <b>WhatsApp</b> opens a chooser with both clinic numbers (
              {siteConfig.whatsapp.display}) and a message built from the page.
            </p>
            <p>
              Teal to slate gradient at 92% under glass, 64px tall buttons, 16px top corners,
              safe-area padding. Hidden while typing in a form and on the thank-you page.
            </p>
          </div>
        </div>
      </section>

      {/* LINE ICONS */}
      <section className="section-mc" data-reveal>
        <SectionHeading eyebrow="Line icons" title="Lucide UI icons, 24px, stroke" accent="1.75">
          For small UI use only (32px and under); never inside the service badges.
        </SectionHeading>
        <IconGrid />
      </section>

      {/* PHOTO SET */}
      <section className="section-mc" data-reveal>
        <SectionHeading eyebrow="Photo set" title="Every published image, with key and" accent="alt">
          All website photos are built from the manifest into public/images: JPEG q85, sRGB, no
          metadata, never upscaled.
        </SectionHeading>
        <div className="psheet">
          {photoRows.map(([key, im]) => (
            <figure key={key}>
              <img src={im.src} alt={im.alt} loading="lazy" />
              <figcaption>
                <b>{key}</b> {im.width}×{im.height}
                <span>{im.alt || "(decorative)"}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

    </div>
  );
}
