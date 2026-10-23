import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import ConfirmChip from "@/components/ConfirmChip";
import ServiceBadgeCard from "@/components/ServiceBadgeCard";
import RouteLink from "@/components/RouteLink";
import Faqs from "@/components/content/Faqs";
import RichHtml from "@/components/content/RichHtml";
import { AuthorBox, CtaBand, PostNotice, ReviewerBox, Sources, sectionId } from "@/components/content/PageParts";
import { accent, allContentUrls, getPage, mdToHtml, pageH1, resolveTokens, type ParsedPage } from "@/lib/content";
import { serviceTabs } from "@/lib/services";
import { images, imgSrcSet, type ImageKey } from "@/lib/images";
import { blogImages } from "@/lib/blog-images";
import { pageGraph } from "@/lib/page-schema";
import { pageMeta } from "@/lib/metadata";
import { formatDate } from "@/lib/format";
import { siteConfig } from "@/lib/site-config";

export const POST_URLS = allContentUrls().filter(
  (u) => u.startsWith("/health-library/") && u !== "/health-library/",
);

const allCards = serviceTabs.flatMap((t) => t.cards);

export function postMetadata(url: string): Metadata {
  const page = getPage(url);
  const fm = page.frontmatter as Record<string, unknown>;
  const img = typeof fm.image === "string" ? blogImages[fm.image] : undefined;
  return pageMeta({
    title: page.frontmatter.title,
    description: page.frontmatter.description,
    url,
    ...(img
      ? {
          image: {
            src: img.src,
            width: img.width,
            height: img.height,
            alt: (fm.imageAlt as string) || img.alt,
          },
        }
      : {}),
    ...(page.frontmatter.datePublished && !/CONFIRM/.test(page.frontmatter.datePublished)
      ? {
          publishedTime: page.frontmatter.datePublished,
          modifiedTime: page.frontmatter.dateModified || page.frontmatter.datePublished,
        }
      : {}),
  });
}

/**
 * Preamble shape: optional lead paragraphs, the "**In brief**" or
 * "**Quick answer**" glance block, then optional trailing paragraphs.
 */
function preambleParts(page: ParsedPage): {
  leadBefore: string;
  label: string;
  brief: string;
  leadAfter: string;
} {
  const blocks = (page.preambleRest || "")
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);
  const marker = blocks.findIndex((b) => /^\*\*(in brief|quick answer)\*\*/i.test(b));
  if (marker === -1) {
    return { leadBefore: blocks.join("\n\n"), label: "In brief", brief: "", leadAfter: "" };
  }
  const m = blocks[marker].match(/^\*\*(in brief|quick answer)\*\*\s*/i);
  const label = m ? m[1].replace(/^./, (c) => c.toUpperCase()) : "In brief";
  return {
    leadBefore: blocks.slice(0, marker).join("\n\n"),
    label,
    brief: blocks[marker].replace(/^\*\*(in brief|quick answer)\*\*\s*/i, "").trim(),
    leadAfter: blocks.slice(marker + 1).join("\n\n"),
  };
}

const md = (text: string, tokens: import("@/lib/content-types").RenderToken[]) =>
  resolveTokens(
    mdToHtml(
      text.replace(/\[CONFIRM[^\]]*\]/g, (m) => {
        tokens.push({
          kind: "confirm",
          note: m.replace(/\[CONFIRM:?\s*|\]/g, ""),
        });
        return `%%TOK_${tokens.length - 1}%%`;
      }),
    ),
    tokens,
  );

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function PostPage({
  url,
  imageIn = [],
}: {
  url: string;
  imageIn?: { match: RegExp; img: ImageKey; caption?: string }[];
}) {
  const page = getPage(url);
  const fm = page.frontmatter;
  const fx = fm as Record<string, unknown>;
  const h1 = pageH1(page);
  const cluster = typeof fx.cluster === "string" ? fx.cluster : undefined;
  const crumbs = [
    { label: "Health Library", href: "/health-library/" },
    ...(cluster ? [{ label: cluster, href: `/health-library/#${slugify(cluster)}` }] : []),
    { label: h1.replace(/\*/g, ""), href: url },
  ];
  const faqs = page.sections.find((s) => s.kind === "faqs")?.faqs || [];
  const pre = preambleParts(page);
  const leadTokens: import("@/lib/content-types").RenderToken[] = [];
  const briefTokens: import("@/lib/content-types").RenderToken[] = [];
  const leadBeforeHtml = pre.leadBefore ? md(pre.leadBefore, leadTokens) : "";
  const briefHtml = pre.brief ? md(pre.brief, briefTokens) : "";
  const leadAfterHtml = pre.leadAfter ? md(pre.leadAfter, leadTokens) : "";
  const related = (fm.related || [])
    .map((u) => allCards.find((c) => c.href === u))
    .filter(Boolean);
  const postUrls = (Array.isArray(fx.posts) && (fx.posts as string[]).length
    ? (fx.posts as string[])
    : POST_URLS.filter((u) => u !== url)
  );
  const otherPosts = postUrls
    .filter((u) => u !== url)
    .map((u) => {
      try {
        const p = getPage(u);
        return { href: u, title: pageH1(p).replace(/\*/g, ""), category: p.frontmatter.category };
      } catch {
        return null;
      }
    })
    .filter(Boolean) as { href: string; title: string; category?: string }[];
  const dateOk = fm.datePublished && !/CONFIRM/.test(fm.datePublished);
  const hero = typeof fx.image === "string" ? blogImages[fx.image] : undefined;
  const heroAlt = (fx.imageAlt as string) || hero?.alt || "";

  const graph = pageGraph({
    page,
    crumbs: crumbs.map((c) => ({ name: c.label, href: c.href })),
    pageType: "BlogPosting",
    faqs,
  });

  return (
    <>
      <JsonLd data={graph} />

      <article className="post">
        <Breadcrumbs items={crumbs} jsonLd={false} />
        <header className="post-head">
          {cluster || fm.category ? <span className="chip">{cluster || fm.category}</span> : null}
          <h1 dangerouslySetInnerHTML={{ __html: accent(h1) }} />
          <p className="byline">
            Written by{" "}
            <RouteLink href="/dr-tamoghna-das/">{siteConfig.doctor.name}</RouteLink>,{" "}
            {siteConfig.doctor.shortTitle}, Bongaigaon
            {dateOk ? (
              <>
                {" "}· Published <time dateTime={fm.datePublished!}>{formatDate(fm.datePublished!)}</time>
                {" "}· Updated{" "}
                <time dateTime={fm.dateModified || fm.datePublished!}>
                  {formatDate(fm.dateModified || fm.datePublished!)}
                </time>
              </>
            ) : (
              <>
                {" "}· <ConfirmChip>launch date</ConfirmChip> Coming soon
              </>
            )}
            {fm.readingTime ? (
              <span className="nbw">{" "}· {fm.readingTime} min read</span>
            ) : null}
          </p>
        </header>

        {hero ? (
          <figure className="post-hero-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={hero.src}
              alt={heroAlt}
              width={hero.width}
              height={hero.height}
              fetchPriority="high"
            />
          </figure>
        ) : null}

        {leadBeforeHtml ? (
          <RichHtml html={leadBeforeHtml} tokens={leadTokens} />
        ) : null}

        {briefHtml ? (
          <div className="glance inbrief">
            <h2 className="glance-h">{pre.label}</h2>
            <RichHtml html={briefHtml} tokens={briefTokens} />
          </div>
        ) : null}

        {leadAfterHtml ? (
          <RichHtml html={leadAfterHtml} tokens={leadTokens} />
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
                      srcSet={imgSrcSet(images[img.img])}
                      sizes="(max-width: 767px) calc(100vw - 40px), 720px"
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
                ) : s.kind === "sources" ? (
                  <Sources items={s.sources || []} />
                ) : (
                  <RichHtml html={s.html} tokens={page.tokens} />
                )}
              </section>
            );
          })}
        </div>

        <ReviewerBox lastReviewed={fm.lastReviewed} />
        <AuthorBox url={url} />
        <PostNotice />

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
          <h2 id="more-posts">
            {Array.isArray(fx.posts) && fx.posts.length ? "Related reading" : "More from the Health Library"}
          </h2>
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

      <CtaBand url={url} />
    </>
  );
}
