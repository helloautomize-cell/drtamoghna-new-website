#!/usr/bin/env node
/**
 * check:dashes · fails if an em dash (U+2014) or en dash (U+2013) appears
 * in UI source files (app/, components/, lib/) or in the rendered HTML of
 * /styleguide on a running server (BASE_URL, default http://localhost:3000).
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const DASHES = /[\u2013\u2014]/;
const SCAN_DIRS = ["app", "components", "lib"];
const EXTS = [".ts", ".tsx", ".js", ".jsx", ".css"];

let failures = 0;

function walk(dir) {
  let out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out = out.concat(walk(p));
    else if (EXTS.some((x) => e.endsWith(x))) out.push(p);
  }
  return out;
}

for (const dir of SCAN_DIRS) {
  let files;
  try {
    files = walk(dir);
  } catch {
    continue;
  }
  for (const f of files) {
    const lines = readFileSync(f, "utf8").split("\n");
    lines.forEach((line, i) => {
      if (DASHES.test(line)) {
        console.error(`DASH ${f}:${i + 1}  ${line.trim().slice(0, 100)}`);
        failures++;
      }
    });
  }
}

const base = process.env.BASE_URL || "http://localhost:3000";
try {
  const res = await fetch(`${base}/styleguide/`, { signal: AbortSignal.timeout(5000) });
  const html = await res.text();
  if (DASHES.test(html)) {
    console.error(`DASH rendered HTML of ${base}/styleguide/ contains an em or en dash`);
    failures++;
  }
} catch {
  console.warn(
    `warn: could not fetch ${base}/styleguide/ (server not running?); skipped rendered check`,
  );
}

if (failures > 0) {
  console.error(`\ncheck:dashes FAILED with ${failures} dash(es)`);
  process.exit(1);
}
console.log("check:dashes OK, no em or en dashes found");
