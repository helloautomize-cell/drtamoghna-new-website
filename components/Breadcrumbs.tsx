import { breadcrumbJsonLd } from "@/lib/schema";

export type Crumb = { label: string; href: string };

/**
 * Breadcrumbs (master-rules 3.1): on every inner page from Phase 3, with
 * BreadcrumbList JSON-LD. The last item is the current page (not a link).
 */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: "Home", href: "/" }, ...items];
  const jsonLd = breadcrumbJsonLd(all.map((c) => ({ name: c.label, href: c.href })));
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol>
        {all.map((c, i) => (
          <li key={c.href + i}>
            {i === all.length - 1 ? (
              <span aria-current="page">{c.label}</span>
            ) : (
              <a href={c.href}>{c.label}</a>
            )}
          </li>
        ))}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </nav>
  );
}
