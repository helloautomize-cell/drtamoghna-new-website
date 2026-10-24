/**
 * page-schema.ts · One JSON-LD @graph per page (site-plan section 7),
 * referencing the layout's #website, #clinic and #dr-tamoghna-das by @id.
 * No AggregateRating, no Review.
 */
import { SITE_BASE } from "./metadata";
import type { ParsedPage, Faq } from "./content";

const ids = {
  website: `${SITE_BASE}/#website`,
  clinic: `${SITE_BASE}/#clinic`,
  physician: `${SITE_BASE}/#dr-tamoghna-das`,
};

function breadcrumbNode(url: string, crumbs: { name: string; href: string }[]) {
  const all = [{ name: "Home", href: "/" }, ...crumbs];
  return {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_BASE}${c.href}`,
    })),
  };
}

function aboutNode(about: NonNullable<ParsedPage["frontmatter"]["about"]>) {
  const type = /^Medical(Condition|Test|Therapy|Procedure|Specialty|WebPage)|DiagnosticProcedure/.test(
    about.type,
  )
    ? about.type
    : "MedicalCondition";
  const extra = about as Record<string, unknown>;
  return {
    "@type": type,
    name: about.name,
    ...(about.alternateName
      ? {
          alternateName: Array.isArray(about.alternateName)
            ? about.alternateName
            : [about.alternateName],
        }
      : {}),
    // Optional entity links to Wikipedia/Wikidata/MeSH from frontmatter.
    ...(Array.isArray(extra.sameAs) && extra.sameAs.length
      ? { sameAs: extra.sameAs.filter((s): s is string => typeof s === "string") }
      : {}),
    ...(typeof extra.codeValue === "string" && extra.codeValue
      ? {
          code: {
            "@type": "MedicalCode",
            codeValue: extra.codeValue,
            codingSystem:
              typeof extra.codingSystem === "string" ? extra.codingSystem : "ICD-10",
          },
        }
      : {}),
  };
}

function faqNode(faqs: Faq[], strip: (h: string) => string) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: strip(f.html) },
    })),
  };
}

function stripHtml(html: string): string {
  return html
    .replace(/%%TOK_\d+%%/g, "")
    .replace(/\[CONFIRM[^\]]*\]/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function pageGraph({
  page,
  crumbs,
  pageType,
  faqs,
}: {
  page: ParsedPage;
  crumbs: { name: string; href: string }[];
  pageType: "MedicalWebPage" | "WebPage" | "ContactPage" | "AboutPage" | "ProfilePage" | "CollectionPage" | "BlogPosting" | "FAQPage";
  faqs?: Faq[];
}) {
  const { frontmatter: fm } = page;
  const url = `${SITE_BASE}${fm.url}`;
  const graph: Record<string, unknown>[] = [breadcrumbNode(url, crumbs)];

  if (pageType === "BlogPosting") {
    const extra = fm as Record<string, unknown>;
    const post: Record<string, unknown> = {
      "@type": "BlogPosting",
      "@id": `${url}#post`,
      headline: (fm.h1 || fm.title).replace(/\*/g, ""),
      description: fm.description,
      url,
      inLanguage: "en-IN",
      author: { "@id": ids.physician },
      reviewedBy: { "@id": ids.physician },
      publisher: { "@id": ids.clinic },
      isPartOf: { "@id": ids.website },
      mainEntityOfPage: url,
    };
    if (fm.datePublished && !/CONFIRM/.test(fm.datePublished))
      post.datePublished = fm.datePublished;
    if (fm.dateModified && !/CONFIRM/.test(fm.dateModified))
      post.dateModified = fm.dateModified;
    if (typeof extra.image === "string" && extra.image)
      post.image = `${SITE_BASE}/images/blog/${extra.image}.webp`;
    if (typeof extra.wordCount === "number") post.wordCount = extra.wordCount;
    if (fm.category) post.articleSection = fm.category;
    if (typeof extra.keywords === "string" && extra.keywords)
      post.keywords = extra.keywords;
    if (Array.isArray(extra.citation) && extra.citation.length) {
      post.citation = extra.citation
        .filter((c): c is string => typeof c === "string")
        .map((c) => {
          const [name, link] = c.split("|").map((s) => s.trim());
          return { "@type": "CreativeWork", name, url: link };
        });
    }
    graph.push(post);
    if (fm.about) {
      const mw: Record<string, unknown> = {
        "@type": "MedicalWebPage",
        "@id": `${url}#medicalwebpage`,
        url,
        name: (fm.h1 || fm.title).replace(/\*/g, ""),
        description: fm.description,
        inLanguage: "en-IN",
        isPartOf: { "@id": ids.website },
        about: aboutNode(fm.about),
        reviewedBy: { "@id": ids.physician },
        medicalAudience: { "@type": "MedicalAudience", audienceType: "Patient" },
      };
      if (fm.lastReviewed && !/CONFIRM|\[date\]/.test(fm.lastReviewed))
        mw.lastReviewed = fm.lastReviewed;
      graph.push(mw);
    }
  } else {
    const node: Record<string, unknown> = {
      "@type": pageType === "ProfilePage" ? "ProfilePage" : pageType,
      "@id": `${url}#webpage`,
      url,
      name: (fm.h1 || fm.title).replace(/\*/g, ""),
      description: fm.description,
      inLanguage: "en-IN",
      isPartOf: { "@id": ids.website },
      about: fm.about
        ? aboutNode(fm.about)
        : pageType === "ProfilePage"
          ? { "@id": ids.physician }
          : { "@id": ids.clinic },
    };
    if (pageType === "MedicalWebPage") {
      node.reviewedBy = { "@id": ids.physician };
      if (fm.lastReviewed && !/CONFIRM|\[date\]/.test(fm.lastReviewed)) {
        node.lastReviewed = fm.lastReviewed;
      }
      node.medicalAudience = { "@type": "MedicalAudience", audienceType: "Patient" };
      // Service/condition pages: the care provided at the clinic as a Service node.
      if (fm.about) {
        const about = aboutNode(fm.about);
        graph.push({
          "@type": "Service",
          "@id": `${url}#service`,
          name: (fm.h1 || fm.title).replace(/\*/g, ""),
          serviceType: about.name,
          provider: { "@id": ids.clinic },
          areaServed: { "@type": "City", name: "Bongaigaon" },
        });
      }
    }
    graph.push(node);
  }

  if (faqs?.length) graph.push(faqNode(faqs, stripHtml));

  return { "@context": "https://schema.org", "@graph": graph };
}

export const schemaIds = ids;
