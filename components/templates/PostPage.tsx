import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import ConfirmChip from "@/components/ConfirmChip";
import ServiceBadgeCard from "@/components/ServiceBadgeCard";
import RouteLink from "@/components/RouteLink";
import Faqs from "@/components/content/Faqs";
import RichHtml from "@/components/content/RichHtml";
import { CtaBand, ReviewerBox, sectionId } from "@/components/content/PageParts";
import { accent, getPage, mdToHtml, pageH1, type ParsedPage } from "@/lib/content";
import { serviceTabs } from "@/lib/services";
import { images, type ImageKey } from "@/lib/images";
import { pageGraph } from "@/lib/page-schema";
import { pageMeta } from "@/lib/metadata";

export const POST_URLS = [
  "/health-library/hba1c-explained/",
  "/health-library/echo-for-people-with-diabetes/",
  "/health-library/snoring-and-sleep-apnea/",
] as const;

const allCards = serviceTabs.flatMap((t) => t.cards);

export function postMetadata(url: string): Metadata {
  const page = getPage(url);
  return pageMeta({
    title: page.frontmatter.title,
    description: page.frontmatter.description,
    url,
  });
}

function inBrief(page: ParsedPage): string {
  const rest = page.preambleRest;
  if (!rest) return "";
  return rest.replace(/^\*\*In brief\*\*\s*/i, "").trim();
}

export default function PostPage({
  url,
  imageIn = [],
}: {
  url: string;
  imageIn?: { match: RegExp; img: ImageKey; caption?: string }[];
}) {
  const page = getPage(url);
  const fm = page.frontmatter;
  const h1 = pageH1(page);
  const crumbs = [
    { label: "Health Library", href: "/health-library/" },
    { label: h1.replace(/\*/g, ""), href: url },
  ];
  const faqs = page.sections.find((s) => s.kind === "faqs")?.faqs || [];
  const brief = inBrief(page);
  const briefTokens: import("@/lib/content-types").RenderToken[] = [];
  const briefHtml = brief
    ? mdToHtml(
        brief.replace(/\[CONFIRM[^\]]*\]/g, (m) => {
          briefTokens.push({
            kind: "confirm",
            note: m.replace(/\[CONFIRM:?\s*|\]/g, ""),
          });
          return `%%TOK_${briefTokens.length - 1}%%`;
        }),
      )
    : "";
  const related = (fm.related || [])
    .map((u) => allCards.find((c) => c.href === u))
    .filter(Boolean);
  const otherPosts = POST_URLS.filter((u) => u !== url).map((u) => {
    const p = getPage(u);
    return { href: u, title: pageH1(p).replace(/\*/g, ""), category: p.frontmatter.category };
  });
  const dateOk = fm.datePublished && !/CONFIRM/.test(fm.datePublished);

  const graph = pageGraph({
    page,
    crumbs: crumbs.map((c) => ({ name: c.label, href: c.href })),
    pageType: "BlogPosting",
    faqs,
  });

  return (
    <>
      <Breadcrumbs items={crumbs} jsonLd={false} />
      <JsonLd data={graph} />

      <article className="post">
        <header className="post-head">
          {fm.category ? <span className="chip">{fm.category}</span> : null}
          <h1 dangerouslySetInnerHTML={{ __html: accent(h1) }} />
          <p className="byline">
            Written by Dr. Tamoghna Das ·{" "}
            {dateOk ? (
              fm.datePublished
            ) : (
              <>
                <ConfirmChip>launch date</ConfirmChip> Coming soon
              </>
            )}
            {fm.readingTime ? ` · ${fm.readingTime} min read` : null}
          </p>
        </header>

        {brief ? (
          <div className="glance inbrief">
            <h2 className="glance-h">In brief</h2>
            <RichHtml html={briefHtml} tokens={briefTokens} />
          </div>
        ) : null}

        <div className="post-body">
          {page.sections.map((s, i) => {
            const id = sectionId(s.heading);
            const img = imageIn.find((x) => x.match.test(s.heading));
            return (
              <section className="psec" key={i} aria-labelledby={id}>
                <h2 id={id}>{s.heading}</h2>
                {img ? (
                  <figure className="sec-img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={images[img.img].src}
                      alt={images[img.img].alt}
                      width={images[img.img].width}
                      height={images[img.img].height}
                      loading="lazy"
                    />
                    {img.caption ? <figcaption>{img.caption}</figcaption> : null}
                  </figure>
                ) : null}
                {s.kind === "faqs" ? (
                  <Faqs faqs={s.faqs || []} />
                ) : (
                  <RichHtml html={s.html} tokens={page.tokens} />
                )}
              </section>
            );
          })}
        </div>

        <ReviewerBox lastReviewed={fm.lastReviewed} />

        {related.length ? (
          <section className="psec" aria-labelledby="rel-svc">
            <h2 id="rel-svc">Related care at Medcare</h2>
            <div className="sgc-row">
              {related.map((c, i) => (
                <ServiceBadgeCard key={c!.href} card={c!} glow={`g${(i % 4) + 1}`} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="psec" aria-labelledby="more-posts">
          <h2 id="more-posts">More from the Health Library</h2>
          <div className="post-links">
            {otherPosts.map((p) => (
              <RouteLink className="post-link" key={p.href} href={p.href}>
                {p.category ? <span className="chip sm">{p.category}</span> : null}
                <span>{p.title}</span>
              </RouteLink>
            ))}
          </div>
        </section>
      </article>

      <CtaBand url={url} title={h1.replace(/\*/g, "")} />
    </>
  );
}
