import type { Metadata } from "next";
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  TriangleAlert,
} from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import RouteLink from "@/components/RouteLink";
import SocialLinks, { clinicSocial } from "@/components/SocialLinks";
import WhatsAppMenu from "@/components/WhatsAppMenu";
import { BookingFormController } from "@/components/forms/booking-form-controller";
import { REASON_SLUG_MAP } from "@/data/booking-options";
import { SITE_BASE, pageMeta } from "@/lib/metadata";
import { schemaIds } from "@/lib/page-schema";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

const TITLE = "Book an appointment with Dr. Tamoghna Das";
const DESCRIPTION =
  "Pick a day and an hourly slot at Medcare, North Bongaigaon. The clinic confirms your request by phone within 30 to 60 minutes during clinic hours.";

export const metadata: Metadata = {
  ...pageMeta({ title: TITLE, description: DESCRIPTION, url: "/book/" }),
  robots: { index: false, follow: true },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const prefill =
    typeof params.reason === "string"
      ? REASON_SLUG_MAP[params.reason]
      : undefined;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_BASE}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Book an appointment",
            item: `${SITE_BASE}/book/`,
          },
        ],
      },
      {
        "@type": "ContactPage",
        "@id": `${SITE_BASE}/book/#webpage`,
        url: `${SITE_BASE}/book/`,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: "en-IN",
        isPartOf: { "@id": schemaIds.website },
        about: { "@id": schemaIds.clinic },
      },
    ],
  };

  return (
    <>
      <Breadcrumbs
        items={[{ label: "Book an appointment", href: "/book/" }]}
        jsonLd={false}
      />
      <JsonLd data={graph} />

      <section className="page-hero detail">
        <div className="ph-in">
          <div className="ph-text">
            <h1>
              Book an <em>appointment</em> with Dr. Tamoghna Das
            </h1>
            <p className="ph-intro">
              Choose a visit type, a day and an hourly slot. We call you to
              confirm; pay nothing online.
            </p>
          </div>
        </div>
      </section>

      <div className="page-body">
        <p className="callout em contact-em">
          <TriangleAlert size={20} strokeWidth={2} aria-hidden /> This form is
          not for emergencies. <a href="tel:112">Call 108 or 112</a>.
        </p>

        <div className="contact-grid">
          <BookingFormController
            surface="book"
            layout="page"
            initialVisitType={prefill?.visitType}
            initialReason={prefill?.reason}
          />

          <aside className="contact-cards" aria-label="Other ways to book">
            <div className="cc-stack">
              <a className="ccard" href={`tel:${siteConfig.phone.tel}`}>
                <Phone size={20} strokeWidth={2} aria-hidden />
                <span>
                  <b>Call</b> {siteConfig.phone.display}
                </span>
              </a>
              <WhatsAppMenu className="ccard">
                <MessageCircle size={20} strokeWidth={2} aria-hidden />
                <span>
                  <b>WhatsApp</b> {siteConfig.whatsapp.display}
                </span>
              </WhatsAppMenu>
              <a className="ccard" href={`mailto:${siteConfig.email}`}>
                <Mail size={20} strokeWidth={2} aria-hidden />
                <span>
                  <b>Email</b> medcarebongaigaon at gmail dot com
                </span>
              </a>
              <div className="ccard static follow">
                <span>
                  <b>Follow Medcare:</b>
                </span>
                <SocialLinks
                  links={[clinicSocial.instagram, clinicSocial.facebook]}
                />
              </div>
              <div className="ccard static">
                <MapPin size={20} strokeWidth={2} aria-hidden />
                <span>
                  <b>Address</b>{" "}
                  {siteConfig.address.lines.join(", ")}{" "}
                  ·{" "}
                  <a
                    href={siteConfig.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get directions
                  </a>
                </span>
              </div>
              <div className="ccard static">
                <Clock size={20} strokeWidth={2} aria-hidden />
                <span>
                  <b>Hours</b> {siteConfig.hours.display}
                </span>
              </div>
              <p className="ccard note">
                Prefer to talk to us first?{" "}
                <RouteLink href="/contact/">
                  See all ways to reach the clinic
                </RouteLink>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
