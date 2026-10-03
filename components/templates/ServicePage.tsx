import { Phone } from "lucide-react";
import Badge from "@/components/Badge";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import BookButton from "@/components/BookButton";
import RouteLink from "@/components/RouteLink";
import ServiceBadgeCard from "@/components/ServiceBadgeCard";
import Faqs from "@/components/content/Faqs";
import RichHtml from "@/components/content/RichHtml";
import {
  AtAGlance,
  CtaBand,
  ReviewerBox,
  Sources,
  StepsList,
  TocAside,
  sectionId,
} from "@/components/content/PageParts";
import {
  accent,
  getPage,
  pageH1,
  type Section,
} from "@/lib/content";
import { bookingHref } from "@/lib/booking-context";
import { siteConfig } from "@/lib/site-config";
import { serviceTabs, type ServiceCard } from "@/lib/services";
import { serviceBadges, type BadgeSlug } from "@/lib/service-badges";
import { pageGraph } from "@/lib/page-schema";
import JsonLd from "@/components/JsonLd";
import EchoVideo from "@/components/EchoVideo";
import { pageMeta } from "@/lib/metadata";
import type { Metadata } from "next";

const HUB_URLS = new Set([
  "/diabetes-care/",
  "/weight-management/",
  "/heart-health/",
  "/internal-medicine/",
]);

/** All service cards flattened, for glass-card and related resolution. */
const allCards: ServiceCard[] = serviceTabs.flatMap((t) => t.cards);

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function cardForName(name: string): ServiceCard | undefined {
  const n = norm(name);
  return (
    allCards.find((c) => norm(c.title) === n) ||
    allCards.find((c) => norm(c.title).startsWith(n) || n.startsWith(norm(c.title)))
  );
}

function cardForUrl(url: string): ServiceCard | undefined {
  return allCards.find((c) => c.href === url);
}

function crumbsFor(url: string): Crumb[] {
  const parts = url.split("/").filter(Boolean);
  const crumbs: Crumb[] = [];
  if (parts.length > 1) {
    const parentUrl = `/${parts[0]}/`;
    const parent = getPage(parentUrl);
    crumbs.push({
      label: (pageH1(parent) || parts[0]).replace(/\*/g, ""),
      href: parentUrl,
    });
  }
  const self = getPage(url);
  crumbs.push({ label: pageH1(self).replace(/\*/g, ""), href: url });
  return crumbs;
}

function postCards(urls: string[]) {
  return urls.map((u) => {
    try {
      const p = getPage(u);
      return { title: pageH1(p).replace(/\*/g, ""), href: u, meta: p.frontmatter.category };
    } catch {
      return null;
    }
  }).filter(Boolean) as { title: string; href: string; meta?: string }[];
}

export function serviceMetadata(url: string): Metadata {
  const page = getPage(url);
  return pageMeta({
    title: page.frontmatter.title,
    description: page.frontmatter.description,
    url,
  });
}

export default function ServicePage({ url }: { url: string }) {
  const page = getPage(url);
  const fm = page.frontmatter;
  const hub = HUB_URLS.has(url);
  const crumbs = crumbsFor(url);
  const h1 = pageH1(page);
  const badge = (fm.badge || serviceBadges[url as keyof typeof serviceBadges]) as
    | BadgeSlug
    | undefined;
  const faqSection = page.sections.find((s) => s.kind === "faqs");
  const faqs = faqSection?.faqs || [];
  const introSection = page.sections.find((s) => /^intro/i.test(s.heading));
  const related = (fm.related || []).map(cardForUrl).filter(Boolean) as ServiceCard[];
  const posts = postCards(fm.posts || []);
  const tocSections = page.sections.filter(
    (s) => !/^intro/i.test(s.heading) && s.kind !== "skip",
  );

  const graph = pageGraph({
    page,
    crumbs: crumbs.map((c) => ({ name: c.label, href: c.href })),
    pageType: "MedicalWebPage",
    faqs,
  });

  return (
    <>
      <Breadcrumbs items={crumbs} jsonLd={false} />
      <JsonLd data={graph} />

      <section className={`page-hero ${hub ? "hub" : "detail"}`}>
        <div className="ph-in">
          <div className="ph-text">
            <h1 dangerouslySetInnerHTML={{ __html: accent(h1) }} />
            {introSection ? (
              <div className="ph-intro">
                <RichHtml html={introSection.html} tokens={page.tokens} />
              </div>
            ) : null}
            <div className="ph-actions">
              <BookButton href={bookingHref(url)} label="Book an appointment" />
              <a className="btn ghost" href={`tel:${siteConfig.phone.tel}`}>
                <Phone size={18} strokeWidth={2} aria-hidden /> Call{" "}
                {siteConfig.phone.display}
              </a>
            </div>
          </div>
          {badge ? (
            <div className="ph-badge">
              <Badge slug={badge} size="lg" />
            </div>
          ) : null}
        </div>
      </section>

      <div className={`page-body ${hub ? "" : "with-toc"}`}>
        <div className="pb-main">
          {page.sections.map((s, i) => (
            <SectionBlock
              key={i}
              section={s}
              tokens={page.tokens}
              hub={hub}
              url={url}
            />
          ))}

          {related.length ? (
            <section className="psec" aria-labelledby="rel">
              <h2 id="rel">Related care</h2>
              <div className="sgc-row">
                {related.map((c, i) => (
                  <ServiceBadgeCard key={c.href} card={c} glow={`g${(i % 4) + 1}`} />
                ))}
              </div>
            </section>
          ) : null}

          {posts.length ? (
            <section className="psec" aria-labelledby="rposts">
              <h2 id="rposts">From the Health Library</h2>
              <div className="post-links">
                {posts.map((p) => (
                  <RouteLink className="post-link" key={p.href} href={p.href}>
                    <span dangerouslySetInnerHTML={{ __html: accent(p.title) }} />
                  </RouteLink>
                ))}
              </div>
            </section>
          ) : null}

          <ReviewerBox lastReviewed={fm.lastReviewed} />
        </div>

        {!hub ? <TocAside sections={tocSections} url={url} /> : null}
      </div>

      <CtaBand url={url} title={h1.replace(/\*/g, "")} />
    </>
  );
}

function SectionBlock({
  section,
  tokens,
  hub,
  url,
}: {
  section: Section;
  tokens: Parameters<typeof RichHtml>[0]["tokens"];
  hub: boolean;
  url: string;
}) {
  if (/^intro/i.test(section.heading)) return null;
  const id = sectionId(section.heading);
  const echoVideo =
    url === "/heart-health/echocardiography/" &&
    /^what happens/i.test(section.heading);

  switch (section.kind) {
    case "glance":
      return <AtAGlance items={section.glance || []} id={id} />;
    case "faqs":
      return (
        <section className="psec" aria-labelledby={id}>
          <h2 id={id}>{section.heading}</h2>
          <Faqs faqs={section.faqs || []} />
        </section>
      );
    case "sources":
      return <Sources items={section.sources || []} />;
    case "steps":
      return (
        <section className="psec" aria-labelledby={id}>
          <h2 id={id}>{hub ? "What your care includes" : section.heading}</h2>
          {section.steps?.length ? <StepsList steps={section.steps} /> : null}
          {section.html ? <RichHtml html={section.html} tokens={tokens} /> : null}
        </section>
      );
    default: {
      // Prose: possible glass-card row + html. "Sources"-like inline lines
      // are handled inside the HTML stream.
      const resolved = (section.cards || [])
        .map((c) => ({ card: cardForName(c.title), fallback: c }))
        .filter((x) => x);
      return (
        <section className="psec" aria-labelledby={id}>
          <h2 id={id}>{section.heading}</h2>
          {echoVideo ? <EchoVideo /> : null}
          {resolved.length ? (
            <div className="sgc-row">
              {resolved.map(({ card, fallback }, i) =>
                card ? (
                  <ServiceBadgeCard key={i} card={card} glow={`g${(i % 4) + 1}`} />
                ) : (
                  <span key={i} className="pcard plain">
                    <b dangerouslySetInnerHTML={{ __html: accent(fallback.title) }} />
                    {fallback.line ? <span>{fallback.line}</span> : null}
                  </span>
                ),
              )}
            </div>
          ) : null}
          {section.html ? <RichHtml html={section.html} tokens={tokens} /> : null}
        </section>
      );
    }
  }
}
