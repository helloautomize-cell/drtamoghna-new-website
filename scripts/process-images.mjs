#!/usr/bin/env node
/**
 * process-images.mjs - builds every public image from
 * resources/images/image-manifest.json.
 * Idempotent: deterministic output, running twice gives identical files.
 */
import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC = join(ROOT, "resources/images/_source");
const OUT = join(ROOT, "public/images");
const manifest = JSON.parse(
  (await import("node:fs")).readFileSync(join(ROOT, "resources/images/image-manifest.json"), "utf8"),
);

const rows = [];
const altMap = {};
const todoNotes = new Set();

function applyTreatments(img, treatment) {
  if (!treatment) return img;
  if (treatment.includes("contrast +3%")) img = img.linear(1.03, -(128 * 0.03));
  if (treatment.includes("exposure +8%")) img = img.modulate({ brightness: 1.08 });
  if (treatment.includes("slightly cooler white balance"))
    img = img.recomb([
      [0.98, 0, 0],
      [0, 1, 0],
      [0, 0, 1.02],
    ]);
  if (treatment.includes("blur any legible brand on the echo monitor bezel")) {
    // Inspected at 100% on 2026-10-03: the two bezel marks are soft blobs,
    // no brand is legible, so no blur box is applied.
    todoNotes.add(
      "- echo monitor bezel in dr-das-consultation.* inspected at 100%: marks present but not legible, no blur applied",
    );
  }
  return img;
}

for (const entry of manifest.images) {
  const srcPath = join(SRC, entry.src);

  if (entry.src.endsWith(".mp4")) {
    // video outputs: copy unchanged (mp4 + sibling poster jpg)
    for (const o of entry.outputs) {
      const dst = join(OUT, o.out);
      mkdirSync(dirname(dst), { recursive: true });
      if (o.out.endsWith(".mp4")) copyFileSync(srcPath, dst);
      else copyFileSync(join(SRC, "video", o.out.split("/").pop()), dst);
      rows.push([o.out, "copy", "unchanged"]);
    }
    if (entry.alt) altMap[entry.outputs[0].out] = entry.alt;
    continue;
  }

  for (const o of entry.outputs) {
    const dst = join(OUT, o.out);
    mkdirSync(dirname(dst), { recursive: true });

    if (entry.src === "brand/medcare-logo.png") {
      // trim transparent padding, keep alpha
      const trimmed = await sharp(srcPath).trim().png().toBuffer({ resolveWithObject: true });
      await sharp(trimmed.data).toFile(dst);
      rows.push([o.out, `${trimmed.info.width}x${trimmed.info.height}`, `${(trimmed.data.length / 1024).toFixed(1)} KB`]);
      continue;
    }

    let img = sharp(srcPath);
    const meta = await img.metadata();
    let cropW = meta.width;

    if (Array.isArray(o.crop)) {
      const [l, t, r, b] = o.crop;
      img = img.extract({ left: l, top: t, width: r - l, height: b - t });
      cropW = r - l;
    }

    img = applyTreatments(img, entry.treatment);
    const baseBuf = await img.toColourspace("srgb").toBuffer();

    const ws = [...new Set((o.widths || [cropW]).filter((w) => w <= cropW))].sort((a, b) => b - a);
    for (const w of ws) {
      const out = w === ws[0] ? o.out : o.out.replace(/\.jpg$/, `-${w}w.jpg`);
      const { data, info } = await sharp(baseBuf)
        .resize({ width: w, withoutEnlargement: true })
        .jpeg({ quality: 85, mozjpeg: true })
        .toColourspace("srgb")
        .toBuffer({ resolveWithObject: true });
      writeFileSync(join(OUT, out), data);
      rows.push([out, `${info.width}x${info.height}`, `${(data.length / 1024).toFixed(1)} KB`]);
    }
  }
  if (entry.alt !== undefined) {
    for (const o of entry.outputs) altMap[o.out] = entry.alt;
  }
}

// alt-text.json
writeFileSync(join(OUT, "alt-text.json"), JSON.stringify(altMap, null, 2) + "\n");

// _todo.md
const todo = ["# Image TODO", "", ...[...todoNotes], "", "- Replace clinic-exterior if the signboard is redone (new domain)", ""];
writeFileSync(join(OUT, "_todo.md"), todo.join("\n"));

// table
const w = [Math.max(...rows.map((r) => r[0].length)), 12, 10];
console.log("out".padEnd(w[0]) + "  " + "px".padEnd(w[1]) + "  size");
for (const [f, px, kb] of rows) console.log(f.padEnd(w[0]) + "  " + String(px).padEnd(w[1]) + "  " + kb);
console.log(`\n${rows.length} files written to public/images/`);
