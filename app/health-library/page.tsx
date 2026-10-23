import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import Badge from "@/components/Badge";
import RouteLink from "@/components/RouteLink";
import ConfirmChip from "@/components/ConfirmChip";
import { CtaBand } from "@/components/content/PageParts";
import { accent, getPage, pageH1 } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { pageGraph } from "@/lib/page-schema";
import { pageMeta } from "@/lib/metadata";
import type { BadgeSlug } from "@/lib/service-badges";

export const metadata: Metadata = pageMeta({
  title: "Health Library | Medcare Bongaigaon",
  description:
    "Plain-language articles on diabetes, weight, heart health, thyroid, sleep and more, written and reviewed by Dr. Tamoghna Das, MD Medicine.",
  url: "/health-library/",
});

const POST_URLS = [
  "/health-library/hba1c-explained/",
  "/health-library/echo-for-people-with-diabetes/",
  "/health-library/snoring-and-sleep-apnea/",
] as const;

const CATEGORIES = [
  "All",
  "Diabetes",
  "Weight",
  "Heart",
  "Thyroid",
  "Lungs and sleep",
  "General medicine",
];

export default function Page() {
  const page = getPage("/health-library/");
  const h1 = pageH1(page);
  const intro = page.kv["Intro"] || "";
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
    crumbs: [{ name: "Health Library", href: "/health-library/" }],
    pageType: "CollectionPage",
  });

  return (
    <>
      <Breadcrumbs items={[{ label: "Health Library", href: "/health-library/" }]} jsonLd={false} />
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
        <div className="pb-main">
          <div className="hl-chips" role="list">
            {CATEGORIES.map((c, i) => (
              <span className={`chip ${i === 0 ? "on" : ""}`} key={c} role="listitem">
                {c}
              </span>
            ))}
          </div>

          <div className="hl-grid">
            {posts.map((p, i) => (
              <RouteLink className={`hl-card g${(i % 4) + 1}`} key={p.url} href={p.url}>
                <div className="hl-cover" aria-hidden>
                  {p.badge ? <Badge slug={p.badge} size="md" /> : null}
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
          </div>
        </div>
      </div>

      <CtaBand url="/health-library/" />
    </>
  );
}
