import type { MetadataRoute } from "next";
import { SITE_BASE } from "@/lib/metadata";

/**
 * Launch robots: every agent may crawl, with explicit allow-groups for
 * search engines and AI/LLM crawlers (master Part 8). Only /styleguide/
 * and /thank-you/ are disallowed. SITE_NOINDEX="true" restores the
 * emergency full disallow.
 */
const AI_BOTS = [
  "Googlebot",
  "Bingbot",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "CCBot",
  "Amazonbot",
  "Meta-ExternalAgent",
  "DuckAssistBot",
];

export default function robots(): MetadataRoute.Robots {
  if (process.env.SITE_NOINDEX === "true") {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/styleguide/", "/thank-you/"] },
      ...AI_BOTS.map((ua) => ({
        userAgent: ua,
        allow: "/",
        disallow: ["/styleguide/", "/thank-you/"],
      })),
    ],
    sitemap: `${SITE_BASE}/sitemap.xml`,
  };
}
