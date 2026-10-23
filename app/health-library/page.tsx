import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import Badge from "@/components/Badge";
import RouteLink from "@/components/RouteLink";
import ConfirmChip from "@/components/ConfirmChip";
import { CtaBand } from "@/components/content/PageParts";
import { accent, allContentUrls, getPage, pageH1 } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { pageGraph } from "@/lib/page-schema";
import { pageMeta, SITE_BASE } from "@/lib/metadata";
import { blogImages } from "@/lib/blog-images";
import type { BadgeSlug } from "@/lib/service-badges";

export const metadata: Metadata = pageMeta({
  title: "Health Library | Medcare Bongaigaon",
  description:
    "Plain-language articles on diabetes, weight, heart health, thyroid, sleep and more, written and reviewed by Dr. Tamoghna Das, MD Medicine.",
  url: "/health-library/",
});

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

type PostCard = {
  url: string;
  h1: string;
  category: string;
  badge?: BadgeSlug;
  readingTime?: number;
  datePublished?: string;
  description: string;
  kind: string;
  clusterOrder: number;
  img?: string;
};

function postCard(url: string): PostCard {
  const p = getPage(url);
  const fx = p.frontmatter as Record<string, unknown>;
  return {
    url,
    h1: pageH1(p).replace(/\*/g, ""),
    category: p.frontmatter.category || "General medicine",
    badge: p.frontmatter.badge as BadgeSlug | undefined,
    readingTime: p.frontmatter.readingTime,
    datePublished: p.frontmatter.datePublished,
    description: p.frontmatter.description || "",
    kind: (fx.kind as string) || "article",
    clusterOrder: typeof fx.clusterOrder === "number" ? fx.clusterOrder : 99,
    img: typeof fx.image === "string" ? blogImages[fx.image]?.src : undefined,
  };
}

export default function Page() {
  const page = getPage("/health-library/");
  const h1 = pageH1(page);
  const intro = page.kv["Intro"] || "";

  const urls = allContentUrls().filter(
    (u) => u.startsWith("/health-library/") && u !== "/health-library/",
  );
  const cards = urls.map(postCard);

  // Group by cluster (frontmatter) with the pillar first; legacy posts last.
  const groups = new Map<string, PostCard[]>();
  for (const c of cards) {
    const p = getPage(c.url);
    const cluster = (p.frontmatter as Record<string, unknown>).cluster as string | undefined;
    const label = cluster || "More articles";
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(c);
  }
  const clusters = [...groups.entries()]
    .map(([label, list]) => ({
      label,
      order: Math.min(...list.map((c) => c.clusterOrder)),
      list: list.sort(
        (a, b) => (a.kind === "pillar" ? -1 : b.kind === "pillar" ? 1 : a.url < b.url ? -1 : 1),
      ),
    }))
    .sort((a, b) => a.order - b.order);

  const graph = pageGraph({
    page,
    crumbs: [{ name: "Health Library", href: "/health-library/" }],
    pageType: "CollectionPage",
  }) as { "@graph": Record<string, unknown>[] };
  graph["@graph"].push({
    "@type": "ItemList",
    "@id": `${SITE_BASE}/health-library/#list`,
    numberOfItems: cards.length,
    itemListElement: cards.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_BASE}${c.url}`,
      name: c.h1,
    })),
  });

  let glow = 0;
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
          <nav className="hl-chips" aria-label="Article groups">
            {clusters.map((c) => (
              <a className="chip" href={`#${slugify(c.label)}`} key={c.label}>
                {c.label}
              </a>
            ))}
          </nav>

          {clusters.map((cluster) => (
            <section className="hl-cluster" id={slugify(cluster.label)} key={cluster.label}>
              <h2 className="hl-cluster-h">{cluster.label}</h2>
              <div className="hl-grid">
                {cluster.list.map((p) => (
                  <RouteLink
                    className={`hl-card g${(glow++ % 4) + 1}`}
                    key={p.url}
                    href={p.url}
                  >
                    <div className="hl-cover" aria-hidden>
                      {p.img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className="hl-photo" src={p.img} alt="" width={1280} height={720} loading="lazy" />
                      ) : p.badge ? (
                        <Badge slug={p.badge} size="md" />
                      ) : null}
                    </div>
                    <div className="hl-meta">
                      <span className="chip sm">{p.category}</span>
                      <h3>{p.h1}</h3>
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
            </section>
          ))}
        </div>
      </div>

      <CtaBand url="/health-library/" />
    </>
  );
}
