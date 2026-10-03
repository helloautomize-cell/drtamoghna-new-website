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

function breadcrumbNode(crumbs: { name: string; href: string }[]) {
  const all = [{ name: "Home", href: "/" }, ...crumbs];
  return {
    "@type": "BreadcrumbList",
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
  const graph: Record<string, unknown>[] = [breadcrumbNode(crumbs)];

  if (pageType === "BlogPosting") {
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
    graph.push(post);
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
    }
    graph.push(node);
  }

  if (faqs?.length) graph.push(faqNode(faqs, stripHtml));

  return { "@context": "https://schema.org", "@graph": graph };
}

export const schemaIds = ids;
