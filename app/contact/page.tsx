import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone, TriangleAlert } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import BookingForm from "@/components/BookingForm";
import BookDirectCard from "@/components/BookDirectCard";
import JsonLd from "@/components/JsonLd";
import MapCard from "@/components/MapCard";
import RouteLink from "@/components/RouteLink";
import SocialLinks, { clinicSocial } from "@/components/SocialLinks";
import { CtaBand } from "@/components/content/PageParts";
import { dateBounds } from "@/lib/booking-validation";
import { getPage, pageH1, accent } from "@/lib/content";
import { pageGraph } from "@/lib/page-schema";
import { pageMeta } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";
import WhatsAppMenu from "@/components/WhatsAppMenu";
import { images, imgSrcSet } from "@/lib/images";
import { isReasonSlug } from "@/lib/booking-context";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMeta({
  title: "Book an Appointment | Medcare Bongaigaon",
  description:
    "Book with Dr. Tamoghna Das at Medcare, North Bongaigaon. Call 60031 21297 or WhatsApp 60031 21297 or 93651 75235. We confirm within 30 to 60 minutes.",
  url: "/contact/",
});

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const reason = typeof params.reason === "string" && isReasonSlug(params.reason)
    ? params.reason
    : undefined;
  const page = getPage("/contact/");
  const h1 = pageH1(page);
  const intro = page.kv["Intro"] || "";
  const emergency =
    page.kv["Emergency notice above the form"] ||
    "This form is not for emergencies. In a medical emergency, call 108 or 112.";
  const { min, max } = dateBounds();

  const graph = pageGraph({
    page,
    crumbs: [{ name: "Book an appointment", href: "/contact/" }],
    pageType: "ContactPage",
  });

  return (
    <>
      <Breadcrumbs
        items={[{ label: "Contact and book", href: "/contact/" }]}
        jsonLd={false}
      />
      <JsonLd data={graph} />

      <section className="page-hero detail">
        <div className="ph-in">
          <div className="ph-text">
            <h1 dangerouslySetInnerHTML={{ __html: accent(h1) }} />
            <p className="ph-intro">{intro}</p>
          </div>
        </div>
      </section>

      <div className="page-body">
        <p className="callout em contact-em">
          <TriangleAlert size={20} strokeWidth={2} aria-hidden /> {emergency}{" "}
          <a href="tel:112">Call 112</a>
        </p>

        <div className="contact-grid">
          {process.env.RESEND_API_KEY ? (
            <BookingForm
              // eslint-disable-next-line react-hooks/purity -- dynamic page; ts must be per-request for the fill-time check
              ts={Date.now()}
              reason={reason}
              dateMin={min}
              dateMax={max}
              source={`/contact/${reason ? `?reason=${reason}` : ""}#book`}
              turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
            />
          ) : (
            <BookDirectCard />
          )}

          <aside className="contact-cards" aria-label="Other ways to reach us">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="cc-bg"
              src={images.exterior.src}
              srcSet={imgSrcSet(images.exterior)}
              sizes="(max-width: 899px) 100vw, 560px"
              alt=""
              loading="lazy"
              aria-hidden
            />
            <div className="cc-stack">
              <a className="ccard" href={`tel:${siteConfig.phone.tel}`}>
                <Phone size={20} strokeWidth={2} aria-hidden />
                <span>
                  <b>Call</b> {siteConfig.phone.display}
                </span>
              </a>
              <WhatsAppMenu className="ccard" pageTitle="an appointment">
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
                  <b>Address</b> {siteConfig.address.full.split(", ").slice(1).join(", ")}{" "}
                  ·{" "}
                  <a href={siteConfig.mapsUrl} target="_blank" rel="noopener noreferrer">
                    Get directions
                  </a>
                </span>
              </div>
              <div className="ccard static">
                <span>
                  <b>Hours</b> {siteConfig.hours.display}
                </span>
              </div>
              <p className="ccard note">
                Coming from outside Bongaigaon?{" "}
                <RouteLink href="/coming-from-outside-bongaigaon/">
                  Plan a one-day visit
                </RouteLink>
              </p>
            </div>
          </aside>
        </div>

        <section className="psec" aria-labelledby="map-h">
          <h2 id="map-h">Find us on the map</h2>
          <MapCard />
        </section>
      </div>

      <CtaBand url="/contact/" title="an appointment" />
    </>
  );
}
