import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import ServiceBadgeCard from "@/components/ServiceBadgeCard";
import ConfirmChip from "@/components/ConfirmChip";
import RichHtml from "@/components/content/RichHtml";
import { CtaBand } from "@/components/content/PageParts";
import { getPage, pageH1, accent } from "@/lib/content";
import { serviceTabs } from "@/lib/services";
import { pageGraph } from "@/lib/page-schema";
import { pageMeta } from "@/lib/metadata";
import { bookingHref } from "@/lib/booking-context";
import BookButton from "@/components/BookButton";

export const metadata: Metadata = pageMeta({
  title: "Services and Tests at Medcare Bongaigaon",
  description:
    "Every condition we look after and every test done at Medcare: diabetes, weight, BP, heart, echo, Holter, thyroid, lungs, sleep and general medicine.",
  url: "/services/",
});

export default function Page() {
  const page = getPage("/services/");
  const h1 = pageH1(page);
  const intro = page.kv["Intro"] || "";
  const tableSection = page.sections.find((s) => /tests done/i.test(s.heading));

  const graph = pageGraph({
    page,
    crumbs: [{ name: "Services", href: "/services/" }],
    pageType: "CollectionPage",
  });

  return (
    <>
      <Breadcrumbs items={[{ label: "Services", href: "/services/" }]} jsonLd={false} />
      <JsonLd data={graph} />

      <section className="page-hero detail">
        <div className="ph-in">
          <div className="ph-text">
            <h1 dangerouslySetInnerHTML={{ __html: accent(h1) }} />
            <p className="ph-intro">{intro}</p>
            <div className="ph-actions">
              <BookButton href={bookingHref("/services/")} label="Book an appointment" />
            </div>
          </div>
        </div>
      </section>

      <div className="page-body">
        <div className="pb-main">
          {serviceTabs.map((tab) => (
            <section className="psec" key={tab.label} aria-labelledby={`g-${tab.label}`}>
              <h2 id={`g-${tab.label}`}>{tab.label}</h2>
              <p className="tab-intro">{tab.intro}</p>
              <div className="sgc-row">
                {tab.cards.map((c) => (
                  <ServiceBadgeCard key={c.href} card={c} glow={tab.glow} />
                ))}
              </div>
            </section>
          ))}

          {tableSection ? (
            <section className="psec" aria-labelledby="tests">
              <h2 id="tests">{tableSection.heading}</h2>
              <RichHtml html={tableSection.html} tokens={page.tokens} />
              <p className="fld-note">
                Times are typical and can vary. Dr. Das decides which tests you need
                after examining you.{" "}
                <ConfirmChip>typical times OK</ConfirmChip>
              </p>
            </section>
          ) : null}
        </div>
      </div>

      <CtaBand url="/services/" />
    </>
  );
}
