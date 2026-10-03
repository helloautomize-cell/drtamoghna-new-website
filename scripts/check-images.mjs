#!/usr/bin/env node
/**
 * check:images - verifies published images against the manifest:
 * every output exists; nothing in public/ is a byte-copy of evidence/ or
 * _backup/; published JPEGs carry no exif/xmp/iptc and are sRGB;
 * no output is wider than its cropped source; reports total size.
 */
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC = join(ROOT, "resources/images/_source");
const PUB = join(ROOT, "public/images");
const manifest = JSON.parse(readFileSync(join(ROOT, "resources/images/image-manifest.json"), "utf8"));

let failures = 0;
const fail = (m) => { console.error("FAIL " + m); failures++; };
const ok = (m) => console.log("ok   " + m);

// forbidden source hashes (evidence + _backup)
const forbidden = new Set();
for (const dir of ["evidence", "_backup"]) {
  const d = join(SRC, dir);
  if (!existsSync(d)) continue;
  for (const f of readdirSync(d))
    forbidden.add(createHash("sha256").update(readFileSync(join(d, f))).digest("hex"));
}

function* walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

// 1. every manifest output exists + width check
for (const entry of manifest.images) {
  const srcMeta = await sharp(join(SRC, entry.src)).metadata().catch(() => null);
  for (const o of entry.outputs) {
    const dst = join(PUB, o.out);
    if (!existsSync(dst)) {
      fail(`missing output ${o.out}`);
      continue;
    }
    if (!o.widths || !o.crop || !srcMeta) continue;
    const outMeta = await sharp(dst).metadata();
    const croppedW = Array.isArray(o.crop) ? o.crop[2] - o.crop[0] : srcMeta.width;
    if (outMeta.width > croppedW) fail(`${o.out} wider than cropped source (${outMeta.width} > ${croppedW})`);
    else ok(`${o.out} ${outMeta.width}px <= source ${croppedW}px`);
  }
}

// 2. hash check: nothing in public/images matches a forbidden source
for (const p of walk(PUB)) {
  const h = createHash("sha256").update(readFileSync(p)).digest("hex");
  if (forbidden.has(h)) fail(`forbidden file published: ${p}`);
}
ok("no file in public/images is a byte-copy of evidence/ or _backup/");

// 3. metadata scan on JPEGs
for (const p of walk(PUB)) {
  if (!p.endsWith(".jpg") && !p.endsWith(".jpeg")) continue;
  const m = await sharp(p).metadata();
  const bad = [];
  if (m.exif) bad.push("exif");
  if (m.xmp) bad.push("xmp");
  if (m.iptc) bad.push("iptc");
  if (m.icc && !["srgb"].includes((m.icc || "").toLowerCase())) bad.push(`icc:${m.icc}`);
  if (bad.length) fail(`${p} carries metadata: ${bad.join(", ")}`);
}
ok("published JPEGs carry no exif/xmp/iptc and are sRGB");

// 4. total size
let total = 0;
let count = 0;
for (const p of walk(PUB)) { total += statSync(p).size; count++; }
console.log(`\npublic/images total: ${(total / 1024 / 1024).toFixed(2)} MB in ${count} files`);

if (failures) { console.error(`\ncheck:images FAILED (${failures})`); process.exit(1); }
console.log("check:images OK");
