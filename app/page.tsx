import type { Metadata } from "next";
import { ArrowRight, Clock, Mail, MapPin, MessageCircle, Phone, TriangleAlert } from "lucide-react";
import Hero from "@/components/Hero";
import ConcernPills from "@/components/ConcernPills";
import WhyCards from "@/components/WhyCards";
import AboutSection from "@/components/AboutSection";
import ServiceTabs from "@/components/ServiceTabs";
import StepTracker from "@/components/StepTracker";
import VisitBand from "@/components/VisitBand";
import DoctorCard from "@/components/DoctorCard";
import ConditionsMarquee from "@/components/ConditionsMarquee";
import SectionHeading from "@/components/SectionHeading";
import MapCard from "@/components/MapCard";
import RouteLink from "@/components/RouteLink";
import Badge from "@/components/Badge";
import JsonLd from "@/components/JsonLd";
import ConfirmChip from "@/components/ConfirmChip";
import AutoScrollRow from "@/components/AutoScrollRow";
import Faqs from "@/components/content/Faqs";
import { CtaBand } from "@/components/content/PageParts";
import { BookingFormController } from "@/components/forms/booking-form-controller";
import { ObfuscatedEmail } from "@/components/FooterBits";
import { getPage, mdToHtml, pageH1 } from "@/lib/content";
import { pageGraph } from "@/lib/page-schema";
import { pageMeta } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";
import WhatsAppMenu from "@/components/WhatsAppMenu";
import { formatDate } from "@/lib/format";
import type { BadgeSlug } from "@/lib/service-badges";
import type { Faq } from "@/lib/content-types";

const page = getPage("/");

const HOME_FAQS: { q: string; a: string }[] = [
  {
    q: "Do I need an appointment, or can I walk in?",
    a: "Booking is better, because your time is reserved and waiting is shorter. You can book online, call or WhatsApp [60031 21297](tel:+916003121297) or [93651 75235](tel:+919365175235), and we confirm within 30 to 60 minutes during clinic hours. If you walk in, we will fit you in when a slot is free, but you may need to wait.",
  },
  {
    q: "Can I get my echo or ECG done on the same day as the consultation?",
    a: "Usually, yes. Dr. Das first examines you and decides which tests will help. ECG, echocardiography, HbA1c and several other tests are done at Medcare, so most patients finish the consultation and tests in one visit. Some tests, such as Holter monitoring or a sleep study, are worn at home and returned later. Some tests take longer. The Holter (a disposable ambulatory cardiac monitoring patch) is worn for at least 72 hours, and its report is available after that. The CGM (continuous glucose monitoring) report is available after the device has been worn for 14 days.",
  },
  {
    q: "What should I bring to my first visit?",
    a: "Bring all your current medicines or their strips, old prescriptions, discharge papers and any test reports from the last year. If you check sugar at home, bring the meter or your diary. A list of your questions helps too. If you are coming for a fasting test, ask us when you book whether to come fasting.",
  },
  {
    q: "Is Medcare open on Sunday?",
    a: "Yes. Medcare is open Monday to Saturday from 9 am to 8:30 pm and on Sunday from 9 am to 3:30 pm. Dr. Das is not available on Sunday, except for emergencies by prior appointment. All blood tests and ECG remain available, and the pharmacy is open on Sunday during the hours above.",
  },
];

const POST_URLS = [
  "/health-library/hba1c-explained/",
  "/health-library/echo-for-people-with-diabetes/",
  "/health-library/snoring-and-sleep-apnea/",
] as const;

export function generateMetadata(): Metadata {
  return pageMeta({
    title: page.frontmatter.title,
    description: page.frontmatter.description,
    url: "/",
  });
}

export default function Home() {
  const faqs: Faq[] = HOME_FAQS.map((f) => ({
    q: f.q,
    html: mdToHtml(f.a),
    tokens: [],
  }));
  const posts = POST_URLS.map((u) => {
    const p = getPage(u);
    return {
      url: u,
      h1: pageH1(p).replace(/\*/g, ""),
      category: p.frontmatter.category || "General medicine",
      badge: p.frontmatter.badge as BadgeSlug | undefined,
      readingTime: p.frontmatter.readingTime,
      datePublished: p.frontmatter.datePublished,
      description: p.frontmatter.description || "",
    };
  });
  const graph = pageGraph({
    page,
    crumbs: [{ name: "Home", href: "/" }],
    pageType: "MedicalWebPage",
    faqs,
  });

  return (
    <div className="container-mc home">
      <JsonLd data={graph} />

      {/* Hero */}
      <section className="home-hero">
        <Hero />
      </section>

      <ConcernPills />

      {/* 01 / Why Medcare */}
      <section className="section-mc">
        <SectionHeading
          reveal
          eyebrow="01 / Why Medcare"
          title="Care that looks at the"
          accent="whole"
        >
          Diabetes, blood pressure, weight, the heart, the thyroid and sleep are
          closely linked. At Medcare, one doctor looks at them together, so
          nothing falls between two clinics.
        </SectionHeading>
        <WhyCards />
      </section>

      {/* 02 / About Medcare */}
      <section className="section-mc">
        <AboutSection />
      </section>

      {/* 03 / How we can help */}
      <section className="section-mc">
        <SectionHeading
          reveal
          eyebrow="03 / How we can help"
          title="Conditions and tests,"
          accent="explained"
        />
        <ServiceTabs />
        <p className="more-link">
          <RouteLink className="link-arrow" href="/services/">
            View all services <ArrowRight size={18} strokeWidth={2} aria-hidden />
          </RouteLink>
        </p>
      </section>

      {/* 04 / Your first visit, step by step */}
      <section className="section-mc">
        <SectionHeading
          reveal
          eyebrow="04 / Your first visit"
          title="Your first visit, step by"
          accent="step"
        />
        <StepTracker />
      </section>

      <div data-reveal>
        <VisitBand />
      </div>

      {/* 05 / Meet your doctor */}
      <section className="section-mc">
        <SectionHeading
          reveal
          eyebrow="05 / Meet your doctor"
          title="Meet"
          accent="Dr. Tamoghna Das"
        >
          More than 15 years as a doctor and more than 10 years as a medicine
          specialist.
        </SectionHeading>
        <DoctorCard />
      </section>

      {/* 07 / Conditions we look after */}
      <section className="section-mc">
        <SectionHeading
          reveal
          eyebrow="07 / Conditions"
          title="Conditions we look"
          accent="after"
        />
        <ConditionsMarquee />
      </section>

      {/* 08 / From our Health Library */}
      <section className="section-mc">
        <SectionHeading
          reveal
          eyebrow="08 / Health Library"
          title="From our Health"
          accent="Library"
        />
        <AutoScrollRow className="hl-row swipe-cards" mobileOnly ctrlClass="mobile-only">
          {posts.map((p, i) => (
            <RouteLink className={`hl-card g${(i % 4) + 1}`} key={p.url} href={p.url}>
              <div className="hl-cover" aria-hidden>
                {p.badge ? <Badge slug={p.badge} size="md" eager={i < 2} /> : null}
              </div>
              <div className="hl-meta">
                <span className="chip sm">{p.category}</span>
                <h2>{p.h1}</h2>
                <p>{p.description}</p>
                <span className="hl-by">
                  Written by Dr. Tamoghna Das ·{" "}
                  {p.datePublished && !/CONFIRM/.test(p.datePublished) ? (
                    formatDate(p.datePublished)
                  ) : (
                    <>
                      <ConfirmChip>launch date</ConfirmChip> Coming soon
                    </>
                  )}
                  {p.readingTime ? ` · ${p.readingTime} min read` : null}
                </span>
              </div>
            </RouteLink>
          ))}
        </AutoScrollRow>
        <p className="more-link">
          <RouteLink className="link-arrow" href="/health-library/">
            Visit the Health Library <ArrowRight size={18} strokeWidth={2} aria-hidden />
          </RouteLink>
        </p>
      </section>

      {/* 09 / Quick answers */}
      <section className="section-mc">
        <SectionHeading reveal eyebrow="09 / Quick answers" title="Quick" accent="answers" />
        <Faqs faqs={faqs} />
        <p className="more-link">
          <RouteLink className="link-arrow" href="/faqs/">
            See all FAQs <ArrowRight size={18} strokeWidth={2} aria-hidden />
          </RouteLink>
        </p>
      </section>

      {/* 10 / Book online */}
      <section className="section-mc" id="book">
        <SectionHeading
          reveal
          eyebrow="10 / Book online"
          title="Book an"
          accent="appointment"
        >
          Pick a day and an hourly slot. We call you to confirm; pay nothing
          online.
        </SectionHeading>
        <div className="book-home">
          <BookingFormController surface="home" layout="compact" />
        </div>
      </section>

      {/* Contact block */}
      <section className="section-mc">
        <SectionHeading reveal eyebrow="Contact" title="Find" accent="us" />
        <div className="hcontact">
          <div className="hc-rows">
            <p className="hc-row">
              <MapPin size={18} strokeWidth={1.9} aria-hidden />
              <span>
                {siteConfig.address.lines.join(", ")}
                <br />
                <a
                  className="hc-dir"
                  href={siteConfig.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get directions
                </a>
              </span>
            </p>
            <p className="hc-row">
              <Phone size={18} strokeWidth={1.9} aria-hidden />
              <a href={`tel:${siteConfig.phone.tel}`}>
                Call {siteConfig.phone.display}
              </a>
              <WhatsAppMenu>
                <MessageCircle size={15} strokeWidth={2} aria-hidden /> WhatsApp{" "}
                {siteConfig.whatsapp.display}
              </WhatsAppMenu>
            </p>
            <p className="hc-row">
              <Mail size={18} strokeWidth={1.9} aria-hidden />
              <ObfuscatedEmail />
            </p>
            <p className="hc-row">
              <Clock size={18} strokeWidth={1.9} aria-hidden />
              <span>{siteConfig.hours.display}</span>
            </p>
            <p className="hc-row hc-em">
              <TriangleAlert size={18} strokeWidth={1.9} aria-hidden />
              <a href="tel:112">Medical emergency? Call 108 or 112.</a>
            </p>
          </div>
          <MapCard />
        </div>
      </section>

      <CtaBand url="/" />
    </div>
  );
}
