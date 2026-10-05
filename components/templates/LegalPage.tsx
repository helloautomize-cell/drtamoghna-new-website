import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import ConfirmChip from "@/components/ConfirmChip";
import RichHtml from "@/components/content/RichHtml";
import { sectionId } from "@/components/content/PageParts";
import { accent, getPage, pageH1 } from "@/lib/content";
import { pageGraph } from "@/lib/page-schema";
import { pageMeta } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";
import { formatDate } from "@/lib/format";
import { images, imgSrcSet } from "@/lib/images";

/**
 * LegalPage · sticky left table of contents on desktop, "Last updated"
 * from site-config.legalLastUpdated ([CONFIRM] until set), print styles.
 */
export function legalMetadata(url: string): Metadata {
  const page = getPage(url);
  return pageMeta({
    title: page.frontmatter.title,
    description: page.frontmatter.description,
    url,
  });
}

export default function LegalPage({
  url,
  imageIn = [],
}: {
  url: string;
  imageIn?: { match: RegExp; img: keyof typeof images }[];
}) {
  const page = getPage(url);
  const h1 = pageH1(page);
  const crumbs = [{ name: h1.replace(/\*/g, ""), href: url }];

  const graph = pageGraph({ page, crumbs, pageType: "WebPage" });
  const updated = siteConfig.legalLastUpdated;

  return (
    <>
      <Breadcrumbs items={crumbs.map((c) => ({ label: c.name, href: c.href }))} jsonLd={false} />
      <JsonLd data={graph} />

      <div className="legal">
        <aside className="legal-toc" aria-label="On this page">
          <nav>
            <b>On this page</b>
            <ol>
              {page.sections.map((s, i) => (
                <li key={i}>
                  <a href={`#${sectionId(s.heading)}`}>{s.heading}</a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <div className="legal-main">
          <h1 dangerouslySetInnerHTML={{ __html: accent(h1) }} />
          <p className="legal-updated">
            Last updated:{" "}
            {updated ? formatDate(updated) : <ConfirmChip>launch date</ConfirmChip>}
          </p>

          {page.sections.map((s, i) => {
            const id = sectionId(s.heading);
            const img = imageIn.find((x) => x.match.test(s.heading));
            return (
              <section className="psec legal-sec" key={i} aria-labelledby={id}>
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
                  </figure>
                ) : null}
                <RichHtml html={s.html} tokens={page.tokens} />
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
