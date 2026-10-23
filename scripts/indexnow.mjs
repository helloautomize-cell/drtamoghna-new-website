#!/usr/bin/env node
/**
 * indexnow.mjs · Submit every sitemap URL to IndexNow (Bing, Yandex and other
 * participating engines). Runs automatically after production Vercel builds
 * (see package.json postbuild) and can be run manually: node scripts/indexnow.mjs
 *
 * The key file public/<INDEXNOW_KEY>.txt must exist at the site root.
 *
 * IndexNow is a best-effort search-engine ping: any failure prints a warning
 * and exits 0 so it can never fail a deployment.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL || "https://drtamoghna-new-website.vercel.app";

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

const hostOf = (u) => {
  try {
    return new URL(u).host;
  } catch {
    return null;
  }
};

async function main() {
  const key = findKey();
  // The live sitemap is always the previous deployment's, and NEXT_PUBLIC_SITE_URL
  // may redirect (apex -> www). IndexNow rejects URLs outside `host`, so derive
  // the submission host from the sitemap URLs themselves rather than the env var.
  const sitemap = await fetch(`${SITE}/sitemap.xml`);
  if (!sitemap.ok) throw new Error(`sitemap fetch failed: ${sitemap.status}`);
  const xml = await sitemap.text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (!locs.length) throw new Error("no URLs found in sitemap");

  const counts = new Map();
  for (const u of locs) {
    const h = hostOf(u);
    if (h) counts.set(h, (counts.get(h) || 0) + 1);
  }
  const host = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  const urlList = locs.filter((u) => hostOf(u) === host);
  if (!host || !urlList.length) {
    console.warn("indexnow: warning: no sitemap URLs to submit, skipping");
    return;
  }
  if (urlList.length !== locs.length) {
    console.warn(
      `indexnow: warning: dropped ${locs.length - urlList.length} URLs not on host ${host}`,
    );
  }

  const body = {
    host,
    key,
    keyLocation: `https://${host}/${key}.txt`,
    urlList,
  };
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  const text = await res.text().catch(() => "");
  if (!res.ok) {
    console.warn(
      `indexnow: warning: submission of ${urlList.length} URLs for ${host} failed -> HTTP ${res.status} ${text}`,
    );
    return;
  }
  console.log(`indexnow: submitted ${urlList.length} URLs for ${host} -> HTTP ${res.status} ${text}`);
}

// During local builds the site is not yet deployed; only submit on Vercel
// production unless INDEXNOW_FORCE is set.
const onVercelProd = process.env.VERCEL_ENV === "production";
const forced = process.env.INDEXNOW_FORCE === "1" || process.argv.includes("--force");
if (process.argv.includes("--check")) {
  console.log(`indexnow: key file OK -> ${findKey()}`);
} else if (onVercelProd || forced) {
  main()
    .then(() => process.exit(0))
    .catch((e) => {
      console.warn(`indexnow: warning: ${e.message} (skipping; deployment unaffected)`);
      process.exit(0);
    });
} else {
  console.log("indexnow: skipped (not a Vercel production build; use --force to submit)");
}
