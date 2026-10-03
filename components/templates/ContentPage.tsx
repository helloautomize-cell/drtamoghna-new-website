import type { Metadata } from "next";
import { Phone } from "lucide-react";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import BookButton from "@/components/BookButton";
import JsonLd from "@/components/JsonLd";
import Faqs from "@/components/content/Faqs";
import RichHtml from "@/components/content/RichHtml";
import {
  AtAGlance,
  CtaBand,
  ReviewerBox,
  Sources,
  StepsList,
  sectionId,
} from "@/components/content/PageParts";
import {
  accent,
  getPage,
  pageH1,
  type ParsedPage,
  type Section,
} from "@/lib/content";
import { bookingHref } from "@/lib/booking-context";
import { siteConfig } from "@/lib/site-config";
import { images, type ImageKey } from "@/lib/images";
import { pageGraph } from "@/lib/page-schema";
import { pageMeta } from "@/lib/metadata";

/**
 * ContentPage · generic template for core pages whose body is plain
 * markdown sections (about, plan-your-visit, coming-from-outside, faqs).
 * Bespoke slots can inject custom React under a matching section heading.
 */

export interface ContentPageOptions {
  /** Hero image key (right side of hero). */
  heroImage?: ImageKey;
  /** Insert an image block inside the section whose heading matches. */
  imageIn?: { match: RegExp; img: ImageKey; caption?: string }[];
  /** Replace the section body with custom content. */
  slots?: { match: RegExp; node: React.ReactNode }[];
  pageType?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" | "FAQPage";
  /** Hide reviewer box (default shown only when frontmatter has reviewer). */
  hideCta?: boolean;
}

export function contentMetadata(url: string): Metadata {
  const page = getPage(url);
  return pageMeta({
    title: page.frontmatter.title,
    description: page.frontmatter.description,
    url,
  });
}

export default function ContentPage({
  url,
  opts = {},
}: {
  url: string;
  opts?: ContentPageOptions;
}) {
  const page = getPage(url);
  const fm = page.frontmatter;
  const h1 = pageH1(page);
  const intro = page.kv["Intro"] || page.kv["Intro (answer-first)"] || "";
  const crumbs: Crumb[] = [{ label: h1.replace(/\*/g, ""), href: url }];
  const allFaqs = page.sections.flatMap((s) => s.faqs || []);

  const graph = pageGraph({
    page,
    crumbs: crumbs.map((c) => ({ name: c.label, href: c.href })),
    pageType: opts.pageType || "WebPage",
    faqs: allFaqs.length ? allFaqs : undefined,
  });

  const heroImg = opts.heroImage ? images[opts.heroImage] : null;

  return (
    <>
      <Breadcrumbs items={crumbs} jsonLd={false} />
      <JsonLd data={graph} />

      <section className="page-hero detail">
        <div className="ph-in">
          <div className="ph-text">
            <h1 dangerouslySetInnerHTML={{ __html: accent(h1) }} />
            {intro ? <p className="ph-intro">{intro}</p> : null}
            <div className="ph-actions">
              <BookButton href={bookingHref(url)} label="Book an appointment" />
              <a className="btn ghost" href={`tel:${siteConfig.phone.tel}`}>
                <Phone size={18} strokeWidth={2} aria-hidden /> Call{" "}
                {siteConfig.phone.display}
              </a>
            </div>
          </div>
          {heroImg ? (
            <figure className="ph-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImg.src}
                alt={heroImg.alt}
                width={heroImg.width}
                height={heroImg.height}
                loading="eager"
                fetchPriority="high"
              />
            </figure>
          ) : null}
        </div>
      </section>

      <div className="page-body">
        <div className="pb-main">
          {page.sections.map((s, i) => (
            <ContentSection key={i} section={s} page={page} opts={opts} />
          ))}
          {fm.reviewer ? <ReviewerBox lastReviewed={fm.lastReviewed} /> : null}
        </div>
      </div>

      {!opts.hideCta ? <CtaBand url={url} title={h1.replace(/\*/g, "")} /> : null}
    </>
  );
}

function ContentSection({
  section,
  page,
  opts,
}: {
  section: Section;
  page: ParsedPage;
  opts: ContentPageOptions;
}) {
  const id = sectionId(section.heading);
  const img = opts.imageIn?.find((x) => x.match.test(section.heading));
  const slot = opts.slots?.find((x) => x.match.test(section.heading));

  const image = img ? (
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
  ) : null;

  let body: React.ReactNode;
  if (slot) {
    body = slot.node;
  } else {
    switch (section.kind) {
      case "glance":
        return <AtAGlance items={section.glance || []} id={id} />;
      case "sources":
        return <Sources items={section.sources || []} />;
      case "steps":
        body = (
          <>
            {section.steps?.length ? <StepsList steps={section.steps} /> : null}
            {section.html ? <RichHtml html={section.html} tokens={page.tokens} /> : null}
          </>
        );
        break;
      default:
        body = section.html ? (
          <RichHtml html={section.html} tokens={page.tokens} />
        ) : null;
    }
  }

  // FAQ sections can appear under any heading (e.g. grouped FAQs page).
  if (section.kind === "faqs") {
    body = <Faqs faqs={section.faqs || []} />;
  }

  return (
    <section className="psec" aria-labelledby={id}>
      <h2 id={id}>{section.heading}</h2>
      {image}
      {body}
    </section>
  );
}
