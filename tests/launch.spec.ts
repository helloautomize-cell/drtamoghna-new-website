import { test, expect } from "@playwright/test";

/**
 * Launch-mode contract: every public page is indexable, review-mode
 * leftovers are gone, AI/search bots are explicitly allowed, and the
 * llms endpoints serve the same content the site renders.
 */

const PUBLIC = ["/", "/contact/", "/diabetes-care/", "/dr-tamoghna-das/", "/privacy-policy/"];
const PRIVATE = ["/styleguide/", "/thank-you/"];
const BOTS = [
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

test.describe("indexable public pages", () => {
  for (const path of PUBLIC) {
    test(`${path}: 200, no noindex header or meta`, async ({ request, page }) => {
      const res = await request.get(path);
      expect(res.status()).toBe(200);
      expect(res.headers()["x-robots-tag"] ?? "").not.toContain("noindex");
      await page.goto(path);
      const meta = await page
        .locator('meta[name="robots"]')
        .first()
        .getAttribute("content")
        .catch(() => null);
      expect(meta ?? "").not.toContain("noindex");
    });
  }

  for (const path of PRIVATE) {
    test(`${path}: noindex`, async ({ request, page }) => {
      const res = await request.get(path);
      expect(res.headers()["x-robots-tag"]).toContain("noindex");
      await page.goto(path);
      const meta = await page
        .locator('meta[name="robots"]')
        .first()
        .getAttribute("content");
      expect(meta).toContain("noindex");
    });
  }
});

test.describe("review-mode leftovers", () => {
  for (const path of [
    "/",
    "/contact/",
    "/diabetes-care/",
    "/dr-tamoghna-das/",
    "/faqs/",
    "/health-library/hba1c-explained/",
    "/privacy-policy/",
    "/coming-from-outside-bongaigaon/",
  ]) {
    test(`no CONFIRM or Preview text on ${path}`, async ({ page }) => {
      const res = await page.goto(path);
      const html = await res!.text();
      expect(html).not.toContain("[CONFIRM");
      expect(html).not.toContain("%%TOK");
      const text = await page.evaluate(() => document.body.innerText);
      expect(text).not.toContain("Preview");
      expect(text).not.toContain("CONFIRM");
    });
  }
});

test.describe("robots and sitemap", () => {
  test("robots.txt allows all and lists every bot", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("Allow: /");
    for (const bot of BOTS) {
      expect(body, `robots.txt missing ${bot}`).toContain(bot);
    }
    expect(body).toContain("Disallow: /styleguide/");
    expect(body).toContain("Disallow: /thank-you/");
    expect(body).toMatch(/Sitemap: https?:\/\/\S+\/sitemap\.xml/);
  });

  test("sitemap includes public pages and llms files", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    const xml = await res.text();
    for (const path of PUBLIC) {
      expect(xml, `sitemap missing ${path}`).toContain(`${path}</loc>`);
    }
    expect(xml).toContain("/llms.txt</loc>");
    expect(xml).toContain("/llms-full.txt</loc>");
  });
});

test.describe("llms endpoints", () => {
  for (const path of ["/llms.txt", "/llms-full.txt"]) {
    test(`${path} returns plain text without build notes`, async ({ request }) => {
      const res = await request.get(path);
      expect(res.status()).toBe(200);
      expect(res.headers()["content-type"]).toContain("text/plain");
      const body = await res.text();
      expect(body).toContain(
        "Medcare Diabetes, Obesity and Echocardiography Clinic",
      );
      expect(body).not.toContain("[CONFIRM");
      expect(body).not.toContain("%%TOK");
      expect(body).not.toContain("Note for build");
    });
  }
});

test.describe("metadata", () => {
  test("canonical is absolute on the site host with trailing slash", async ({
    page,
  }) => {
    await page.goto("/diabetes-care/");
    const href = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    expect(href).toMatch(/^https:\/\/[^/]+\/diabetes-care\/$/);
  });

  test("og and twitter tags on every checked page", async ({ request }) => {
    for (const path of ["/", "/contact/", "/dr-tamoghna-das/"]) {
      const html = await (await request.get(path)).text();
      expect(html).toContain('property="og:title"');
      expect(html).toContain('property="og:image"');
      expect(html).toContain('property="og:locale"');
      expect(html).toContain('name="twitter:card"');
    }
  });

  test("JSON-LD blocks parse and use the site host", async ({ page }) => {
    await page.goto("/diabetes-care/");
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    expect(blocks.length).toBeGreaterThan(0);
    for (const raw of blocks) {
      const data = JSON.parse(raw);
      const s = JSON.stringify(data);
      expect(s).toMatch(/https:\/\/[^/]+\//);
      expect(s).not.toContain("[CONFIRM");
    }
  });
});

test.describe("booking fallback without RESEND_API_KEY", () => {
  test.skip(Boolean(process.env.RESEND_API_KEY), "RESEND_API_KEY is set");
  test("phone/WhatsApp card renders at #book", async ({ page }) => {
    await page.goto("/contact/#book");
    const card = page.locator(".bdirect");
    await expect(card).toBeVisible();
    await expect(card.locator('a[href^="tel:"]')).toBeVisible();
    const wa = card.getByRole("button", { name: /WhatsApp/ });
    await expect(wa).toBeVisible();
    await wa.click();
    const chooser = page.getByRole("dialog");
    await expect(chooser).toContainText("Chat on WhatsApp");
    await expect(chooser.locator('a[href*="wa.me"]')).toHaveCount(2);
    await page.keyboard.press("Escape");
    await expect(card).toContainText("30 to 60 minutes");
    await expect(page.locator("form.bform")).toHaveCount(0);
  });
});

test.describe("request gating", () => {
  for (const path of ["/", "/contact/", "/plan-your-visit/"]) {
    test(`no analytics/maps/video requests on load ${path}`, async ({ page }) => {
      const hits: string[] = [];
      page.on("request", (r) => {
        if (
          /google-analytics|googletagmanager|google\.com\/maps|maps\.google|youtube/.test(
            r.url(),
          )
        )
          hits.push(r.url());
      });
      await page.goto(path);
      await page.waitForTimeout(1500);
      expect(hits).toEqual([]);
    });
  }

  test("no CSP violations on load", async ({ page }) => {
    const violations: string[] = [];
    page.on("console", (msg) => {
      if (/content security policy|violates/i.test(msg.text()))
        violations.push(msg.text());
    });
    await page.goto("/");
    await page.waitForTimeout(1500);
    expect(violations).toEqual([]);
  });
});
