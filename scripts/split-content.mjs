#!/usr/bin/env node
/**
 * split-content.mjs · Split resources/content/new-website-content.md into one
 * file per page under content/. Idempotent: regenerates every file, so never
 * hand-edit content/ — edit the source in resources/ instead.
 *
 * Grouping (per the phase prompt):
 *   21 service pages   -> content/services/<url path>.md
 *   7 legal pages      -> content/legal/<slug>.md
 *   3 library posts    -> content/health-library/<slug>.md
 *   everything else    -> content/pages/<slug>.md
 *
 * Part 8 (review guide) is not rendered and is skipped entirely.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "resources/content/new-website-content.md");
const OUT = join(ROOT, "content");

const SERVICE_ROOTS = [
  "/diabetes-care/",
  "/weight-management/",
  "/heart-health/",
  "/internal-medicine/",
  "/thyroid-disorders/",
  "/sleep-apnea/",
  "/asthma-copd/",
  "/health-check-ups/",
];
const LEGAL_SLUGS = new Set([
  "privacy-policy",
  "terms-of-use",
  "medical-disclaimer",
  "editorial-policy",
  "patient-rights",
  "appointments-cancellation-refund",
  "accessibility",
]);

const text = readFileSync(SRC, "utf8");

// Stop before Part 8 (review guide) — build-only, never rendered.
const part8 = text.indexOf("# Part 8");
const usable = part8 === -1 ? text : text.slice(0, part8);

// Split at "## Page N ·" and "## Post N ·" boundaries.
const blocks = [];
const re = /^## (Page|Post) \d+ · (.+)$/gm;
let m;
const marks = [];
while ((m = re.exec(usable)))
  marks.push({ title: m[2].trim(), start: m.index, isPost: m[1] === "Post" });
marks.forEach((mark, i) => {
  const end = i + 1 < marks.length ? marks[i + 1].start : usable.length;
  blocks.push({ title: mark.title, body: usable.slice(mark.start, end), isPost: mark.isPost });
});

function outPath(url, isPost) {
  const path = url.replace(/^\/+|\/+$/g, "") || "home";
  const slug = path.split("/").pop();
  if (isPost) return join(OUT, "health-library", `${slug}.md`);
  if (LEGAL_SLUGS.has(slug)) return join(OUT, "legal", `${slug}.md`);
  if (SERVICE_ROOTS.some((r) => `/${path}/` === r || `/${path}/`.startsWith(r))) {
    return join(OUT, "services", `${path}.md`);
  }
  return join(OUT, "pages", `${slug}.md`);
}

// Reset the generated tree.
mkdirSync(OUT, { recursive: true });
if (readdirSync(OUT, { withFileTypes: true }).length) rmSync(OUT, { recursive: true, force: true });

const rows = [];
let skipped = 0;
for (const { title, body, isPost } of blocks) {
  const yamlMatch = body.match(/```yaml\n([\s\S]*?)```/);
  const urlMatch = (yamlMatch ? yamlMatch[1] : "").match(/^url:\s*(\S+)/m);
  if (!urlMatch) {
    skipped++;
    console.log(`skip (no url): ${title}`);
    continue;
  }
  const url = urlMatch[1].trim();
  // Cut at the next "# Part" heading and strip the trailing "---" separator.
  const fileBody = body
    .replace(/^## (?:Page|Post) \d+ · .+\n/, "")
    .split(/^# Part /m)[0]
    .replace(/\n---\s*$/, "")
    .trim();
  const dest = outPath(url, isPost);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, `# ${title}\n\n${fileBody}\n`);
  rows.push(`${url.padEnd(58)} ${dest.replace(OUT + "/", "")}`);
}

console.log(`split ${rows.length} pages${skipped ? ` (${skipped} blocks skipped)` : ""}:`);
rows.forEach((r) => console.log("  " + r));
