#!/usr/bin/env node
/**
 * check-css-vars.mjs · Fail if any var(--x) used in app/, components/ or lib/
 * has no --x: definition anywhere in those directories. next/font variables
 * (--font-*) are provided at runtime and are allowed.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["app", "components", "lib"];
const EXTS = new Set([".css", ".ts", ".tsx", ".mts"]);
const allowed = (name) => name.startsWith("--font-");

const files = [];
const walk = (dir) => {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const s = statSync(p);
    if (s.isDirectory()) {
      if (!["node_modules", ".next"].includes(e)) walk(p);
    } else if (EXTS.has(p.slice(p.lastIndexOf(".")))) {
      files.push(p);
    }
  }
};
ROOTS.forEach(walk);

const defined = new Set();
const used = []; // {file, line, name}
const defRe = /(--[\w-]+)\s*:/g;
const useRe = /var\(\s*(--[\w-]+)/g;

for (const f of files) {
  const src = readFileSync(f, "utf8");
  let m;
  defRe.lastIndex = 0;
  while ((m = defRe.exec(src))) defined.add(m[1]);
  useRe.lastIndex = 0;
  while ((m = useRe.exec(src))) {
    if (allowed(m[1])) continue;
    const line = src.slice(0, m.index).split("\n").length;
    used.push({ file: f, line, name: m[1] });
  }
}

const missing = used.filter((u) => !defined.has(u.name));
if (missing.length) {
  const seen = new Set();
  for (const u of missing) {
    const k = `${u.file}:${u.line}:${u.name}`;
    if (seen.has(k)) continue;
    seen.add(k);
    console.error(`undefined CSS var ${u.name}  ${u.file}:${u.line}`);
  }
  console.error(`\ncheck-css-vars: ${seen.size} undefined var reference(s)`);
  process.exit(1);
}
console.log(`check-css-vars: OK (${used.length} var() references, ${defined.size} definitions)`);
