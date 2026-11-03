import { NextResponse } from "next/server";

// IndexNow auto-submission (Bing, Yandex, Seznam, Naver; Bing feeds ChatGPT/Copilot search).
// Daily Vercel cron hits this route. It submits sitemap URLs whose <lastmod> changed in
// the last 48h. If lastmod isn't meaningful (most URLs "changed"), it submits everything
// once a week (Monday) instead of daily. Manual full push: GET ?all=1 with the cron secret.
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const INDEXNOW_KEY = "0375a876aada986dd57722fdd9613a11";
const ORIGIN = process.env.INDEXNOW_ORIGIN ?? "https://www.medcare.org.in";

type Entry = { loc: string; lastmod?: string };

async function readSitemap(url: string, depth = 0): Promise<Entry[]> {
  const res = await fetch(url, { cache: "no-store", headers: { "user-agent": "indexnow-cron" } });
  if (!res.ok) return [];
  const xml = await res.text();
  const tag = (block: string, name: string) =>
    block.match(new RegExp(`<${name}>\\s*(?:<!\\[CDATA\\[)?([^<\\]]+)`))?.[1]?.trim();
  if (/<sitemapindex/i.test(xml) && depth < 2) {
    const children = [...xml.matchAll(/<sitemap>([\s\S]*?)<\/sitemap>/g)]
      .map((m) => tag(m[1], "loc"))
      .filter((u): u is string => !!u);
    const nested = await Promise.all(children.map((c) => readSitemap(c, depth + 1)));
    return nested.flat();
  }
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)]
    .map((m) => ({ loc: tag(m[1], "loc") ?? "", lastmod: tag(m[1], "lastmod") }))
    .filter((e) => e.loc);
}

export async function GET(req: Request) {
  // Vercel Cron sends "Bearer $CRON_SECRET"; INDEXNOW_SECRET allows manual runs.
  const auth = req.headers.get("authorization");
  const allowed = [process.env.CRON_SECRET, process.env.INDEXNOW_SECRET].filter(Boolean);
  if (!allowed.some((s) => auth === `Bearer ${s}`)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const host = new URL(ORIGIN).host;
  const all = new URL(req.url).searchParams.get("all") === "1";

  const entries = (await readSitemap(`${ORIGIN}/sitemap.xml`)).filter((e) => {
    try {
      return new URL(e.loc).host === host;
    } catch {
      return false;
    }
  });
  const cutoff = Date.now() - 48 * 3600 * 1000;
  const recent = entries.filter((e) => e.lastmod && Date.parse(e.lastmod) >= cutoff);
  const lastmodUseless = entries.length > 0 && recent.length > entries.length * 0.5;
  const isMonday = new Date().getUTCDay() === 1;

  let urlList: string[];
  let mode: string;
  if (all) {
    urlList = entries.map((e) => e.loc);
    mode = "all";
  } else if (lastmodUseless) {
    urlList = isMonday ? entries.map((e) => e.loc) : [];
    mode = isMonday ? "weekly-all" : "skipped (lastmod not reliable; weekly run on Monday)";
  } else {
    urlList = recent.map((e) => e.loc);
    mode = "changed-48h";
  }
  urlList = [...new Set(urlList)];

  const results: { count: number; status: number }[] = [];
  for (let i = 0; i < urlList.length; i += 10000) {
    const chunk = urlList.slice(i, i + 10000);
    const r = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${ORIGIN}/${INDEXNOW_KEY}.txt`,
        urlList: chunk,
      }),
    });
    results.push({ count: chunk.length, status: r.status });
  }

  return NextResponse.json(
    { mode, sitemapUrls: entries.length, submitted: urlList.length, results },
    { headers: { "X-Robots-Tag": "noindex" } },
  );
}
