/**
 * lib/content.ts · Content pipeline for the split markdown files in content/.
 *
 * Loads each page's frontmatter (Zod-validated) and parses the body into
 * typed sections. Markdown renders to semantic HTML server-side via
 * remark/rehype. Interactive atoms ([CONFIRM] chips, callouts) are emitted
 * as %%TOK_n%% placeholders inside the HTML and swapped for real components
 * by <RichHtml /> at render time, so all copy is in the initial HTML.
 *
 * Build-only lines (Note for build, Reviewer note, Note under table,
 * Glass cards:/Callout: markers and similar) are stripped before render.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { cache } from "react";
import { z } from "zod";
import { parse as parseYaml } from "yaml";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { IDENTITY } from "./site-config";

const CONTENT_DIR = join(process.cwd(), "content");

/* ------------------------------ frontmatter ------------------------------ */

const frontmatterSchema = z
  .object({
    title: z.string().max(60),
    description: z.string().max(155).optional(),
    url: z.string().regex(/^\/[\w\-/]*\/$|^\/$/),
    h1: z.string().optional(),
    badge: z.string().optional(),
    reviewer: z.string().optional(),
    lastReviewed: z.string().optional(),
    about: z
      .object({
        type: z.string(),
        name: z.string(),
        alternateName: z.union([z.string(), z.array(z.string())]).optional(),
      })
      .passthrough()
      .optional(),
    related: z.array(z.string()).optional(),
    posts: z.array(z.string()).optional(),
    category: z.string().optional(),
    author: z.string().optional(),
    datePublished: z.string().optional(),
    dateModified: z.string().optional(),
    readingTime: z.number().optional(),
    schema: z.array(z.string()).optional(),
    coverBadge: z.string().optional(),
    robots: z.string().optional(),
  })
  .passthrough();

export type PageFrontmatter = z.infer<typeof frontmatterSchema>;

/* ------------------------------- token model ----------------------------- */

export type {
  RenderToken,
  Faq,
  GlanceItem,
  Step,
  GlassCard,
} from "./content-types";
export { TOKEN_RE, accent } from "./content-types";
import type { RenderToken, Faq, GlanceItem, Step, GlassCard } from "./content-types";

/* ------------------------------- section types ---------------------------- */

export type SectionKind =
  | "prose"
  | "glance"
  | "faqs"
  | "sources"
  | "emergency"
  | "steps"
  | "inbrief"
  | "skip";

export interface Section {
  heading: string;
  kind: SectionKind;
  /** Original markdown (build lines kept) for bespoke page parsing. */
  raw: string;
  tokens: RenderToken[];
  html: string;
  faqs?: Faq[];
  glance?: GlanceItem[];
  sources?: string[];
  steps?: Step[];
  cards?: GlassCard[];
  /** Markdown text after a "Glass cards:" list, rendered separately. */
  afterHtml?: string;
}

export interface ParsedPage {
  frontmatter: PageFrontmatter;
  /** Preamble key: value lines before the first ### (H1, Intro, Text, ...). */
  kv: Record<string, string>;
  /** Preamble lines that are not Key: values (e.g. a post's In-brief block). */
  preambleRest: string;
  sections: Section[];
  tokens: RenderToken[];
}

/* --------------------------------- helpers -------------------------------- */

export const INDEXABLE = process.env.SITE_NOINDEX !== "true";

export function mdToHtml(md: string): string {
  return String(
    unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeStringify)
      .processSync(md),
  );
}

/** Strip build-only lines that must never render. */
export function dropBuildLines(lines: string[]): string[] {
  return lines.filter(
    (l) =>
      !/^(Note for build|Reviewer note|Note under table|Photo labels|Tabs and cards|Groups \(|Mobile:|Table:$|Map:|Chips:|Category chips:|Line:|Variant `)/.test(
        l.trim(),
      ),
  );
}

/** Extract [CONFIRM: ...] and bare [CONFIRM] marks into tokens. */
export function extractConfirms(text: string, tokens: RenderToken[]): string {
  return text.replace(/\[CONFIRM(?::\s*([^\]]+))?\]/g, (_m, note) => {
    tokens.push({ kind: "confirm", note: (note || "").trim() });
    return `%%TOK_${tokens.length - 1}%%`;
  });
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const svg = (size: number, inner: string, fill = false) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
const ICONS = {
  alert: svg(
    24,
    '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  ),
  info: svg(
    24,
    '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  ),
  quote: svg(
    18,
    '<path d="M10 8c-3 1-5 3-5 6v3h5v-6H7c0-1.5 1.5-2.5 3-3V8Z"/><path d="M19 8c-3 1-5 3-5 6v3h5v-6h-3c0-1.5 1.5-2.5 3-3V8Z"/>',
    true,
  ),
};

/**
 * Replace every %%TOK_n%% placeholder with its final serialized markup.
 * This must happen before the HTML reaches the DOM: splitting markup at
 * placeholders inside <li>/<p> produced invalid nests (span > li) and
 * hydration mismatches. Callout bodies can hold confirm placeholders, so
 * the pass recurses; indices are stable because tokens are append-only.
 */
export function resolveTokens(html: string, tokens: RenderToken[]): string {
  return html.replace(/%%TOK_(\d+)%%/g, (m, i) => {
    const t = tokens[Number(i)];
    if (!t) return m;
    if (t.kind === "confirm") {
      if (process.env.SITE_NOINDEX !== "true") return "";
      return `<span class="confirm">[CONFIRM${t.note ? `: ${esc(t.note)}` : ""}]</span>`;
    }
    const inner = resolveTokens(t.html, tokens);
    const title = t.title ? `<b>${esc(t.title)}. </b>` : "";
    if (t.variant === "emergency") {
      return `<div class="callout em">${ICONS.alert.replace("<svg", '<svg class="co-ic"')}<div>${title}${inner}</div></div>`;
    }
    if (t.variant === "quote") {
      return `<blockquote class="pullquote">${ICONS.quote}${inner}</blockquote>`;
    }
    return `<div class="callout ${t.variant === "tip" ? "warn" : "info"}">${ICONS.info.replace("<svg", '<svg class="co-ic"')}<div>${title}${inner}</div></div>`;
  });
}

/** Extract contiguous `> ` blockquotes into callout tokens. */
function extractQuotes(text: string, tokens: RenderToken[]): string {
  const lines = text.split("\n");
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    if (/^>\s?/.test(lines[i])) {
      const buf: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      const raw = buf.join("\n").trim();
      const m = raw.match(/^\*\*(.+?):\*\*\s*([\s\S]*)$/);
      let variant: "tip" | "info" | "emergency" | "quote" = "quote";
      let title: string | undefined;
      let body = raw;
      if (m) {
        title = m[1];
        body = m[2].trim();
        variant = /tip|worth knowing|what this means|note|in brief/i.test(title)
          ? "tip"
          : "info";
      }
      if (/call 108|call 112|emergency|same day|straight away|urgently/i.test(raw)) {
        variant = "emergency";
        title = title || "When to get help straight away";
      }
      const inner = extractConfirms(body, tokens);
      tokens.push({ kind: "callout", variant, title, html: mdToHtml(inner) });
      out.push(`%%TOK_${tokens.length - 1}%%`);
    } else {
      out.push(lines[i]);
      i++;
    }
  }
  return out.join("\n");
}

/** Render markdown -> html with confirm/quote tokens. */
function renderMd(raw: string, tokens: RenderToken[]): string {
  const cleaned = dropBuildLines(raw.split("\n")).join("\n");
  const noQuotes = extractQuotes(cleaned, tokens);
  const noConfirms = extractConfirms(noQuotes, tokens);
  let html = mdToHtml(noConfirms);
  // Block-level callout tokens must not remain wrapped in <p>.
  tokens.forEach((t, i) => {
    if (t.kind === "callout") {
      html = html.replace(`<p>%%TOK_${i}%%</p>`, `%%TOK_${i}%%`);
    }
  });
  return resolveTokens(html, tokens);
}

/* ------------------------------- body parsing ----------------------------- */

/** Parse "Key: value" preamble lines (values may continue on the next line). */
function parseKv(text: string): Record<string, string> {
  const kv: Record<string, string> = {};
  const lines = text.split("\n");
  let key: string | null = null;
  for (const l of lines) {
    const t = l.trim();
    if (!t) {
      key = null;
      continue;
    }
    const m = t.match(/^([A-Z][A-Za-z' ()/`#.-]{1,48}):\s*(.*)$/);
    if (m && !/^https?:/.test(t)) {
      key = m[1].trim();
      kv[key] = m[2].trim();
    } else if (key) {
      kv[key] = `${kv[key]} ${t}`.trim();
    }
  }
  return kv;
}

/** Parse numbered FAQs: "1. **Question?**\n   answer (indented lines)". */
function parseFaqs(raw: string): Faq[] {
  const lines = raw.split("\n");
  const faqs: Faq[] = [];
  let q: string | null = null;
  let buf: string[] = [];
  const flush = () => {
    if (q !== null) {
      const tokens: RenderToken[] = [];
      const html = resolveTokens(
        mdToHtml(
          extractConfirms(dropBuildLines(buf).join("\n").trim(), tokens),
        ),
        tokens,
      );
      faqs.push({ q, html, tokens });
    }
    q = null;
    buf = [];
  };
  for (const l of lines) {
    const m = l.match(/^\d+\.\s+\*\*(.+?)\*\*\s*$/);
    if (m) {
      flush();
      q = m[1].replace(/\*\*/g, "").trim();
    } else if (q !== null && (/^\s{3,}/.test(l) || l.trim() === "")) {
      buf.push(l.trim());
    }
  }
  flush();
  return faqs;
}

/** Parse "- **Label:** text" glance items. */
function parseGlance(raw: string): GlanceItem[] {
  const items: GlanceItem[] = [];
  for (const l of raw.split("\n")) {
    const m = l.trim().match(/^-\s+\*\*(.+?):\*\*\s*(.*)$/);
    if (m) {
      const tokens: RenderToken[] = [];
      const html = resolveTokens(
        mdToHtml(extractConfirms(m[2].trim(), tokens)),
        tokens,
      ).replace(/^<p>|<\/p>$/g, "");
      items.push({ label: m[1], html, tokens });
    }
  }
  return items;
}

/** Parse "N. **Title.** text" numbered steps. */
function parseSteps(raw: string): Step[] {
  const steps: Step[] = [];
  const re = /^\s*\d+\.\s+\*\*(.+?)\.\*\*\s*(.*)$/;
  for (const l of raw.split("\n")) {
    const m = l.trim().match(re);
    if (m) {
      const tokens: RenderToken[] = [];
      const html = resolveTokens(
        mdToHtml(extractConfirms(m[2].trim(), tokens)),
        tokens,
      ).replace(/^<p>|<\/p>$/g, "");
      steps.push({ title: m[1], html, tokens });
    }
  }
  return steps;
}

/** Parse a "Glass cards:" block: inline list or following "- Name · line" bullets. */
function parseCards(raw: string): { cards: GlassCard[]; rest: string } {
  const lines = raw.split("\n");
  const cards: GlassCard[] = [];
  const rest: string[] = [];
  let inCards = false;
  for (const l of lines) {
    const t = l.trim();
    const inline = t.match(/^Glass cards:\s*(.+)$/);
    if (inline) {
      inline[1].split("·").forEach((name) => cards.push({ title: name.trim(), line: "" }));
      inCards = true;
      continue;
    }
    if (t === "Glass cards:") {
      inCards = true;
      continue;
    }
    if (inCards && /^-\s+/.test(t)) {
      const [title, line] = t.replace(/^-\s+/, "").split("·").map((s) => s.trim());
      cards.push({ title, line: line || "" });
      continue;
    }
    inCards = false;
    rest.push(l);
  }
  return { cards, rest: rest.join("\n").trim() };
}

const KIND_BY_HEADING: [RegExp, SectionKind][] = [
  [/^at a glance$/i, "glance"],
  [/^faqs?$/i, "faqs"],
  [/^sources$/i, "sources"],
  [/urgently|straight away|right away|seek help/i, "emergency"],
  [/^in brief$/i, "inbrief"],
  [/^on this page$/i, "skip"],
  [/what happens at medcare|what your (visit|test|check) includes|care plan|how we (assess|work with you)/i, "steps"],
];

function classify(heading: string): SectionKind {
  for (const [re, kind] of KIND_BY_HEADING) if (re.test(heading)) return kind;
  return "prose";
}

function parseSources(raw: string): string[] {
  const out: string[] = [];
  for (const l of dropBuildLines(raw.split("\n"))) {
    const t = l.trim();
    if (/^-\s+/.test(t)) out.push(t.replace(/^-\s+/, ""));
    else if (/^Sources?:\s*/.test(t)) {
      t.replace(/^Sources?:\s*/, "")
        .split("·")
        .forEach((s) => s.trim() && out.push(s.trim()));
    } else if (t) out.push(t);
  }
  return out.map((s) => extractConfirmsKeep(s));
}

/** For sources, keep [CONFIRM] as plain text? No: mark with token-free brackets removed. */
function extractConfirmsKeep(s: string): string {
  return s;
}

/* ------------------------------- page loading ----------------------------- */

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((e) => {
    const p = join(dir, e);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".md") ? [p] : [];
  });
}

/** Read a content file; all parsing below assumes LF line endings. */
export function readContentFile(file: string): string {
  return readFileSync(file, "utf8").replace(/\r\n/g, "\n");
}

const urlIndex = cache((): Map<string, string> => {
  const map = new Map<string, string>();
  const seen = new Map<string, string>();
  for (const file of walk(CONTENT_DIR)) {
    const text = readContentFile(file);
    const yamlMatch = text.match(/```yaml\n([\s\S]*?)```/);
    if (!yamlMatch) continue;
    const url = (parseYaml(yamlMatch[1]) as { url?: string }).url;
    if (!url) continue;
    if (seen.has(url)) {
      throw new Error(`content: duplicate url ${url} in ${file} and ${seen.get(url)}`);
    }
    seen.set(url, file);
    map.set(url, file);
  }
  return map;
});

export function allContentUrls(): string[] {
  return [...urlIndex().keys()];
}

export function contentFile(url: string): string | undefined {
  return urlIndex().get(url);
}

export const getPage = cache((url: string): ParsedPage => {
  const file = urlIndex().get(url);
  if (!file) throw new Error(`content: no page for url ${url}`);
  const text = readContentFile(file);

  const yamlMatch = text.match(/```yaml\n([\s\S]*?)```/);
  if (!yamlMatch) throw new Error(`content: missing frontmatter in ${file}`);
  const rawFm = parseYaml(yamlMatch[1]);
  const fm = frontmatterSchema.safeParse(rawFm);
  if (!fm.success) {
    throw new Error(`content: invalid frontmatter in ${file}\n${fm.error.message}`);
  }
  const frontmatter = fm.data;

  let body = text.slice(yamlMatch.index! + yamlMatch[0].length).trim();
  // Identity placeholders in legal pages
  body = body.replaceAll("{IDENTITY}", IDENTITY);

  // Split preamble (before first ###) from sections.
  const headingRe = /^###\s+(.+)$/gm;
  const parts: { heading: string; raw: string }[] = [];
  let firstIdx = body.length;
  let m: RegExpExecArray | null;
  const heads: { heading: string; start: number }[] = [];
  while ((m = headingRe.exec(body))) heads.push({ heading: m[1].trim(), start: m.index });
  if (heads.length) firstIdx = heads[0].start;
  heads.forEach((h, i) => {
    const end = i + 1 < heads.length ? heads[i + 1].start : body.length;
    parts.push({ heading: h.heading, raw: body.slice(h.start, end).replace(/^### .+\n?/, "") });
  });

  const preamble = body.slice(0, firstIdx).trim();
  const kv = parseKv(preamble);
  const preambleRest = preamble
    .split("\n")
    .filter((l) => {
      const t = l.trim();
      return t && !t.match(/^([A-Z][A-Za-z' ()/`#.-]{1,48}):\s*(.*)$/);
    })
    .join("\n")
    .trim();

  const tokens: RenderToken[] = [];
  const sections: Section[] = [];
  for (const { heading, raw } of parts) {
    // Strip the "Callout:" marker that precedes an emergency blockquote.
    const cleaned = raw.replace(/^Callout:\s*$/gm, "");
    let kind = classify(heading);
    // FAQ groups can sit under arbitrary headings (e.g. "Booking and
    // timings"): detect the "N. **Q** / indented answer" shape.
    if (kind === "prose" && /^\d+\.\s+\*\*.+\*\*\s*$/m.test(cleaned)) {
      kind = "faqs";
    }
    const section: Section = { heading, kind, tokens, html: "", raw };
    if (kind === "skip") continue;
    if (kind === "faqs") {
      section.faqs = parseFaqs(cleaned);
      // FAQ answers may carry tokens: decode inline JSON placeholders later.
    } else if (kind === "glance") {
      section.glance = parseGlance(cleaned);
    } else if (kind === "sources") {
      section.sources = parseSources(cleaned);
    } else if (kind === "steps") {
      section.steps = parseSteps(cleaned);
      section.html = renderMd(cleaned, tokens);
    } else {
      // Prose: extract glass cards if present.
      const { cards, rest } = parseCards(cleaned);
      if (cards.length) section.cards = cards;
      section.html = renderMd(rest, tokens);
    }
    sections.push(section);
  }

  return { frontmatter, kv, preambleRest, sections, tokens };
});

/** h1 text for a page: frontmatter h1, else preamble "H1" key. */
export function pageH1(page: ParsedPage): string {
  return page.frontmatter.h1 || page.kv["H1"] || page.frontmatter.title;
}

export function pageIntro(page: ParsedPage): string {
  return (
    page.kv["Intro (answer-first)"] ||
    page.kv["Intro"] ||
    page.kv["Text"] ||
    page.sections.find((s) => /intro/i.test(s.heading))?.html.replace(/<[^>]+>/g, "") ||
    ""
  );
}
