#!/usr/bin/env node
/**
 * launch-check · everything that still needs Dr. Das's sign-off before launch.
 * Lists every [CONFIRM] in content/, every TODO_CONFIRM in site-config, and
 * any googleRating older than 30 days. Exits non-zero while anything remains.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
let open = 0;

const CONFIRM = /\[CONFIRM[^\]]*\]/;
const walk = (d) =>
  readdirSync(d).flatMap((e) => {
    const p = join(d, e);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".md") ? [p] : [];
  });

console.log("== [CONFIRM] marks in content/ ==");
for (const f of walk(join(ROOT, "content"))) {
  readFileSync(f, "utf8")
    .split("\n")
    .forEach((line, i) => {
      if (CONFIRM.test(line)) {
        console.log(`  ${f.replace(ROOT + "/", "")}:${i + 1}  ${line.trim().slice(0, 110)}`);
        open++;
      }
    });
}

console.log("\n== TODO_CONFIRM in lib/site-config.ts ==");
const cfg = readFileSync(join(ROOT, "lib/site-config.ts"), "utf8");
const todo = cfg.match(/TODO_CONFIRM = \[([\s\S]*?)\]/);
if (todo) {
  const items = [...todo[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  items.forEach((it) => {
    console.log(`  - ${it}`);
    open++;
  });
  if (!items.length) console.log("  (none)");
}

console.log("\n== googleRating freshness ==");
const ratingMatch = cfg.match(/googleRating:\s*{[\s\S]*?checkedOn:\s*([^,\n]+)/);
const checkedOn = ratingMatch ? ratingMatch[1].trim() : null;
const date = checkedOn ? new Date(checkedOn.replace(/"/g, "")) : null;
if (!date || Number.isNaN(date.getTime())) {
  console.log(`  googleRating.checkedOn is not set`);
  open++;
} else {
  const ageDays = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (ageDays > 30) {
    console.log(`  googleRating last checked ${checkedOn} (${ageDays} days ago, limit 30)`);
    open++;
  } else {
    console.log(`  OK: checked ${checkedOn} (${ageDays} days ago)`);
  }
}

console.log(`\nlaunch-check: ${open} open item${open === 1 ? "" : "s"}`);
process.exit(open ? 1 : 0);
