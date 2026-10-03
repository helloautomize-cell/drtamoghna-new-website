#!/usr/bin/env node
/**
 * indexnow.mjs · Submit every sitemap URL to IndexNow (Bing, Yandex and other
 * participating engines). Runs automatically after production Vercel builds
 * (see package.json postbuild) and can be run manually: node scripts/indexnow.mjs
 *
 * The key file public/<INDEXNOW_KEY>.txt must exist at the site root.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL || "https://drtamoghna-new-website.vercel.app";
const HOST = new URL(SITE).host;

// Key: INDEXNOW_KEY env, else the single *.txt key file committed in public/.
function findKey() {
  if (process.env.INDEXNOW_KEY) return process.env.INDEXNOW_KEY;
  const files = readdirSync(join(process.cwd(), "public")).filter((f) =>
    /^[0-9a-f]{32}\.txt$/.test(f),
  );
  if (files.length !== 1) {
    throw new Error(
      `indexnow: expected exactly one hex key file in public/, found ${files.length}`,
    );
  }
  const key = files[0].replace(/\.txt$/, "");
  const contents = readFileSync(join(process.cwd(), "public", files[0]), "utf8").trim();
  if (contents !== key) {
    throw new Error("indexnow: key file contents do not match the file name");
  }
  return key;
}

async function main() {
  const key = findKey();
  const sitemap = await fetch(`${SITE}/sitemap.xml`);
  if (!sitemap.ok) throw new Error(`sitemap fetch failed: ${sitemap.status}`);
  const xml = await sitemap.text();
  const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (!urlList.length) throw new Error("no URLs found in sitemap");

  const body = {
    host: HOST,
    key,
    keyLocation: `${SITE}/${key}.txt`,
    urlList,
  };
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  const text = await res.text().catch(() => "");
  console.log(`indexnow: submitted ${urlList.length} URLs for ${HOST} -> HTTP ${res.status} ${text}`);
  if (!res.ok) process.exit(1);
}

// During local builds the site is not yet deployed; only submit on Vercel
// production unless INDEXNOW_FORCE is set.
const onVercelProd = process.env.VERCEL_ENV === "production";
const forced = process.env.INDEXNOW_FORCE === "1" || process.argv.includes("--force");
if (process.argv.includes("--check")) {
  console.log(`indexnow: key file OK -> ${findKey()}`);
} else if (onVercelProd || forced) {
  main().catch((e) => {
    console.error(`indexnow: ${e.message}`);
    process.exit(1);
  });
} else {
  console.log("indexnow: skipped (not a Vercel production build; use --force to submit)");
}
