#!/usr/bin/env node
/**
 * export-seo-meta.mjs · Runs as `prebuild`.
 *
 * Collects the effective <title> and meta description for every public page,
 * fails the build on duplicates or length violations, and exports
 * docs/seo-meta.csv.
 *
 * Page-level title/description overrides in the app router page files take
 * precedence over content frontmatter; keep OVERRIDES in sync with them.
 */

import { readdirSync, readFileSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import YAML from "yaml";

const CONTENT = "content";
const DEFAULT_DESC =
  "Medcare Diabetes & Obesity Clinic, North Bongaigaon, Assam. Dr. Tamoghna Das, MBBS, MD (Medicine).";

// Keep in sync with pageMeta() calls in app/*/page.tsx.
const OVERRIDES = {
  "/contact/": {
    title: "Book an Appointment | Medcare Bongaigaon",
    description:
      "Book with Dr. Tamoghna Das at Medcare, North Bongaigaon. Call 60031 21297 or WhatsApp 98642 66191. We confirm within 30 to 60 minutes.",
  },
  "/services/": {
    title: "Services and Tests at Medcare Bongaigaon",
    description:
      "Every condition we look after and every test done at Medcare: diabetes, weight, BP, heart, echo, Holter, thyroid, lungs, sleep and general medicine.",
  },
  "/health-library/": {
    title: "Health Library | Medcare Bongaigaon",
    description:
      "Plain-language articles on diabetes, weight, heart health, thyroid, sleep and more, written and reviewed by Dr. Tamoghna Das, MD Medicine.",
  },
  "/dr-tamoghna-das/": {
    title: "Dr. Tamoghna Das, MD Medicine | Medcare Bongaigaon",
    description:
      "Internal medicine and cardio-diabetic consultant in Bongaigaon. MBBS, MD (GMCH), fellowship in echocardiography. Reg. No. 20276, Assam.",
  },
};

const NOINDEX = new Set(["/thank-you/", "/styleguide/"]);

function walk(dir) {
  return readdirSync(dir).flatMap((e) => {
    const p = join(dir, e);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".md") ? [p] : [];
  });
}

const rows = [];
for (const file of walk(CONTENT)) {
  const text = readFileSync(file, "utf8");
  const m = text.match(/```yaml\n([\s\S]*?)```/);
  if (!m) continue;
  const fm = YAML.parse(m[1]);
  const url = fm.url;
  if (!url || NOINDEX.has(url)) continue;
  const o = OVERRIDES[url] || {};
  rows.push({
    url,
    title: o.title ?? fm.title ?? "",
    description: o.description ?? fm.description ?? DEFAULT_DESC,
  });
}
rows.sort((a, b) => a.url.localeCompare(b.url));

const problems = [];
const seenT = new Map();
const seenD = new Map();
for (const r of rows) {
  if (!r.title) problems.push(`${r.url}: missing title`);
  if (r.title.length > 60) problems.push(`${r.url}: title ${r.title.length} chars > 60`);
  if (r.description.length > 155)
    problems.push(`${r.url}: description ${r.description.length} chars > 155`);
  if (seenT.has(r.title)) problems.push(`duplicate title: ${r.url} and ${seenT.get(r.title)}`);
  else seenT.set(r.title, r.url);
  if (r.description && seenD.has(r.description))
    problems.push(`duplicate description: ${r.url} and ${seenD.get(r.description)}`);
  else if (r.description) seenD.set(r.description, r.url);
}

if (problems.length) {
  console.error("seo-meta check failed:");
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

mkdirSync("docs", { recursive: true });
const csv = ["url,title,description"]
  .concat(
    rows.map(
      (r) =>
        `"${r.url}","${r.title.replace(/"/g, '""')}","${r.description.replace(/"/g, '""')}"`,
    ),
  )
  .join("\n");
writeFileSync("docs/seo-meta.csv", csv + "\n");
console.log(`seo-meta: ${rows.length} pages OK, wrote docs/seo-meta.csv`);
