import type { Metadata } from "next";
import { TriangleAlert } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import RouteLink from "@/components/RouteLink";
import VisitingDoctorCard from "@/components/VisitingDoctorCard";
import { CtaBand } from "@/components/content/PageParts";
import { accent, type ParsedPage } from "@/lib/content";
import { pageGraph } from "@/lib/page-schema";
import { pageMeta, SITE_BASE } from "@/lib/metadata";
import { clinicGeoCoordinates, clinicPostalAddress, clinicPriceRange } from "@/lib/schema";
import { siteConfig } from "@/lib/site-config";
import { visitingDoctors, visitingPhone } from "@/lib/visiting-doctors";

// Visit status depends on the date in India; re-check hourly instead of
// freezing "today/upcoming/past" at build time.
export const revalidate = 3600;

const PAGE_URL = "/visiting-doctors/";
const TITLE =
  "Visiting specialists from Yashoda Hospitals | Medcare Bongaigaon";
const DESCRIPTION =
  "Orthopedics and gastroenterology specialists from Yashoda Hospitals, Hyderabad hold clinics at Medcare, Bongaigaon on set dates. Call to book a consultation slot.";
const H1 = "Visiting specialists at *Medcare*";

export const metadata: Metadata = pageMeta({
  title: TITLE,
  description: DESCRIPTION,
  url: PAGE_URL,
});

export default function Page() {

  const pageStub: ParsedPage = {
    frontmatter: {
      title: TITLE,
      h1: H1,
      description: DESCRIPTION,
      url: PAGE_URL,
    },
    kv: {},
    preambleRest: "",
    sections: [],
    tokens: [],
  };
  const graph = pageGraph({
    page: pageStub,
    crumbs: [{ name: "Visiting doctors", href: PAGE_URL }],
    pageType: "CollectionPage",
  });
  // One Physician per visiting doctor plus a shared Hospital node for their
  // affiliation. They are independent consultants: hospitalAffiliation, never
  // worksFor, and no Event or Review nodes.
  // Hospital facts verified against yashodahospitals.com's own
  // /locations/hitec-city/ JSON-LD (address, geo, phone, map, 24/7 hours).
  const yashodaId = `${SITE_BASE}${PAGE_URL}#yashoda-hitec-city`;
  const visitHours = (date: string) => {
    const weekday = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      timeZone: "Asia/Kolkata",
    }).format(new Date(`${date}T12:00:00+05:30`));
    const h = weekday === "Sunday" ? siteConfig.hours.sunday : siteConfig.hours.weekday;
    return {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: weekday,
      opens: h.opens,
      closes: h.closes,
      validFrom: date,
      validThrough: date,
    };
  };
  graph["@graph"].push(
    {
      "@type": "Hospital",
      "@id": yashodaId,
      name: "Yashoda Hospitals, Hitec City",
      url: "https://www.yashodahospitals.com/locations/hitec-city/",
      image:
        "https://www.yashodahospitals.com/wp-content/uploads/2023/12/yashoda-hospitals-logo.png",
      telephone: "+91-4045674567",
      hasMap: "https://maps.app.goo.gl/gjt1PHS8Ua4oRnfX8",
      address: {
        "@type": "PostalAddress",
        streetAddress: "JNTU to Hitec City Road, Kothaguda",
        addressLocality: "Hyderabad",
        addressRegion: "Telangana",
        postalCode: "500084",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 17.4623137,
        longitude: 78.3849124,
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
      priceRange: "₹₹₹",
    },
    // Visiting specialists hold clinics at Medcare, so their practice
    // address, geo, bookable phone and consultable hours are the clinic's,
    // scoped to the listed visit dates.
    ...visitingDoctors.map((d) => ({
      "@type": "Physician",
      "@id": `${SITE_BASE}${PAGE_URL}#${d.slug}`,
      name: d.name,
      url: `${SITE_BASE}${PAGE_URL}`,
      image: `${SITE_BASE}${d.photo}`,
      telephone: siteConfig.whatsapp.numbers[1].schema,
      medicalSpecialty: d.medicalSpecialty,
      address: clinicPostalAddress,
      geo: clinicGeoCoordinates,
      priceRange: clinicPriceRange,
      openingHoursSpecification: d.visits.map(visitHours),
      hospitalAffiliation: { "@id": yashodaId },
    })),
  );

  return (
    <>
      <Breadcrumbs
        items={[{ label: "Visiting doctors", href: PAGE_URL }]}
        jsonLd={false}
      />
      <JsonLd data={graph} />

      <section className="page-hero detail">
        <div className="ph-in">
          <div className="ph-text">
            <h1 dangerouslySetInnerHTML={{ __html: accent(H1) }} />
            <p className="ph-intro">
              Senior specialists from Yashoda Hospitals, Hyderabad hold
              clinics at Medcare, Bongaigaon on set dates. Call{" "}
              <a href={`tel:${visitingPhone.tel}`}>{visitingPhone.display}</a>{" "}
              to book a consultation slot.
            </p>
          </div>
        </div>
      </section>

      <div className="page-body">
        <div className="pb-main">
          <section className="psec" aria-label="Visiting specialists">
            <div className="vd-grid">
              {visitingDoctors.map((doctor) => (
                <VisitingDoctorCard key={doctor.slug} doctor={doctor} />
              ))}
            </div>
          </section>

          <p className="vd-note">
            Visiting specialists are independent consultants from Yashoda
            Hospitals. Fees and timings are confirmed when you call{" "}
            <a href={`tel:${visitingPhone.tel}`}>{visitingPhone.display}</a>.{" "}
            <RouteLink href="/plan-your-visit/">Plan your visit</RouteLink> for
            directions.
          </p>

          <p className="callout em vd-em">
            <TriangleAlert size={20} strokeWidth={2} aria-hidden />
            <span>
              This page is not for emergencies.{" "}
              <a href="tel:112">Medical emergency? Call 108 or 112.</a>
            </span>
          </p>
        </div>
      </div>

      <CtaBand url={PAGE_URL} />
    </>
  );
}
