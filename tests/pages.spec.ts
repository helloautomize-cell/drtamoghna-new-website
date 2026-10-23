import { test, expect } from "@playwright/test";
import { readdirSync, statSync, readFileSync } from "node:fs";
import { join } from "node:path";

/** All content routes discovered from content/*.md frontmatter urls. */
const CONTENT_DIR = join(__dirname, "..", "content");
function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((e) => {
    const p = join(dir, e);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".md") ? [p] : [];
  });
}
const ROUTES: string[] = walk(CONTENT_DIR)
  .map(
    (f) =>
      readFileSync(f, "utf8")
        .replace(/\r\n/g, "\n")
        .match(/^url:\s*(\S+)$/m)?.[1],
  )
  .filter((u): u is string => Boolean(u))
  .filter((u) => u !== "/");
const PAGES = [...ROUTES, "/"];

const SERVICE_PAGES = ROUTES.filter(
  (u) =>
    [
      "/diabetes-care/",
      "/weight-management/",
      "/heart-health/",
      "/internal-medicine/",
      "/thyroid-disorders/",
      "/sleep-apnea/",
      "/asthma-copd/",
      "/health-check-ups/",
    ].some((r) => u === r || u.startsWith(r)),
);

/* ---------- crawl: every route loads, no internal 404s ---------- */

test.describe("crawl", () => {
  for (const route of PAGES) {
    test(`${route} loads`, async ({ page }) => {
      const res = await page.goto(route);
      expect(res?.status(), route).toBe(200);
    });
  }

  test("sitemap lists every page", async ({ page }) => {
    const res = await page.goto("/sitemap.xml");
    expect(res?.status()).toBe(200);
    const xml = await res!.text();
    for (const route of ROUTES) {
      if (route === "/thank-you/") continue; // noindex, excluded
      expect(xml, `sitemap missing ${route}`).toContain(`${route}</loc>`);
    }
    for (const route of ["/thank-you/", "/styleguide/"]) {
      expect(xml, `sitemap should not list ${route}`).not.toContain(
        `${route}</loc>`,
      );
    }
  });

  test("every internal link resolves", async ({ page, request }) => {
    const seen = new Set<string>();
    for (const route of PAGES) {
      await page.goto(route);
      const hrefs: string[] = await page.evaluate(() =>
        Array.from(document.querySelectorAll("a[href]"))
          .map((a) => (a as HTMLAnchorElement).getAttribute("href") || "")
          .filter((h) => h.startsWith("/") && !h.startsWith("//")),
      );
      for (const h of hrefs) {
        const path = h.split("#")[0].split("?")[0];
        if (!seen.has(path)) seen.add(path);
      }
    }
    const bad: string[] = [];
    for (const path of seen) {
      const res = await request.get(path);
      if (res.status() !== 200) bad.push(`${path} -> ${res.status()}`);
    }
    expect(bad, "internal links that 404").toEqual([]);
  });
});

/* ---------- layout integrity ---------- */

test.describe("layout", () => {
  for (const route of PAGES) {
    for (const width of [390, 1440]) {
      test(`no horizontal overflow ${route} @${width}`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(route);
        await page.waitForTimeout(300);
        const overflow = await page.evaluate(
          () =>
            Math.max(
              document.documentElement.scrollWidth,
              document.body.scrollWidth,
            ) - document.documentElement.clientWidth,
        );
        expect(overflow).toBeLessThanOrEqual(1);
      });
    }
    test(`no nested interactive elements ${route}`, async ({ page }) => {
      await page.goto(route);
      const count = await page.evaluate(
        () => document.querySelectorAll("a a, a button, button a").length,
      );
      expect(count).toBe(0);
    });
  }
});

/* ---------- service page contract ---------- */

test.describe("service pages", () => {
  for (const route of SERVICE_PAGES) {
    test(`${route} contract`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator(".ph-badge img, .badge img").first()).toBeVisible();
      await expect(page.locator(".glance")).toBeVisible();
      const faqs = page.locator(".faq-t");
      expect(await faqs.count()).toBeGreaterThanOrEqual(4);
      const html = await page.content();
      expect(html).toContain('"FAQPage"');
      await expect(page.locator(".callout.reviewer, .reviewer")).toBeVisible();
      await expect(page.getByRole("link", { name: /book/i }).first()).toBeVisible();
      await expect(page.locator('a[href^="tel:"]').first()).toBeVisible();
    });
  }
});

/* ---------- content hygiene ---------- */

const BUILD_ONLY = ["Note for build", "Reviewer note", "compliance:", "{IDENTITY}"];
const BANNED: [RegExp, string][] = [
  [/\bbest\b/i, "best"],
  [/No\.?\s*1\b/i, "No. 1"],
  [/\bleading\b/i, "leading"],
  [/guaranteed?/i, "guaranteed"],
  [/100\s?%/i, "100%"],
  [/world-class/i, "world-class"],
  [/state-of-the-art/i, "state-of-the-art"],
];
const BRANDS = [
  "Ozempic",
  "Mounjaro",
  "Wegovy",
  "Trulicity",
  "Rybelsus",
  "Victoza",
  "Dexcom",
  "FreeStyle Libre",
  "Libre",
  "Accu-Chek",
  "Siemens",
  "Philips",
  "GE Healthcare",
];

test.describe("content hygiene", () => {
  for (const route of PAGES) {
    test(`no build-only text or banned words ${route}`, async ({ page }) => {
      await page.goto(route);
      const text = await page.evaluate(() => document.body.innerText);
      const html = await page.content();
      for (const s of BUILD_ONLY) {
        expect(text.includes(s) || html.includes(s), `${route}: ${s}`).toBe(false);
      }
      const hits: string[] = [];
      // A banned word is only a violation when used promotionally. Approved
      // copy also uses these words innocuously ("leading to corns",
      // "what footwear is best?", "cannot be cured"), so allow matches whose
      // surrounding sentence is a question or clearly negated guidance.
      const allow =
        /\?|leading to|cannot|can't|can not|no |not |never|promising|careful|avoid|beware|should not|do not/i;
      const all: [RegExp, string][] = [
        ...BANNED,
        [/\b(?:cured?|permanent)\b/i, "cure/permanent"],
      ];
      for (const [re, name] of all) {
        for (const m of text.matchAll(new RegExp(re.source, "gi"))) {
          const i = m.index ?? 0;
          const ctx = text.slice(Math.max(0, i - 80), i + 80);
          if (!allow.test(ctx)) hits.push(`${name}: ${ctx.trim().slice(0, 50)}`);
        }
      }
      for (const b of BRANDS) {
        if (new RegExp(`\\b${b}\\b`, "i").test(text)) hits.push(b);
      }
      // "cardiologist" only allowed on the profile page.
      if (route !== "/dr-tamoghna-das/" && /cardiologist/i.test(text)) {
        hits.push("cardiologist");
      }
      expect(hits, route).toEqual([]);
    });
  }

  test("cardiologist only inside the approved FAQ on the profile", async ({
    page,
  }) => {
    await page.goto("/dr-tamoghna-das/");
    const count = await page.evaluate(() => {
      const t = document.body.innerText;
      return (t.match(/cardiologist/gi) || []).length;
    });
    // Question + answer only.
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThanOrEqual(3);
  });
});

/* ---------- booking form ---------- */

test.describe("booking form", () => {
  // The shared slot form posts to the Google Sheet through a server
  // action. With SHEETS_* unset the UI still renders the clinic's
  // standard slots (offline fallback), so structure tests need no env.
  const fill = async (
    page: import("@playwright/test").Page,
    over: Record<string, string> = {},
  ) => {
    const f = { name: "Test Patient", mobile: "9864012345", ...over };
    await page.locator(".vt-card", { hasText: "New consultation" }).click();
    await page
      .locator("select[name=reason]")
      .selectOption("Diabetes or high sugar");
    // First bookable day chip in the strip (skips a hidden spent Today).
    await page
      .locator(".day-strip .day:has(input[name=date]:not(:disabled))")
      .first()
      .click();
    await expect(
      page.locator(".slot:has(input[name=slotStart]:not(:disabled))").first(),
    ).toBeVisible({ timeout: 15000 });
    await page
      .locator(".slot:has(input[name=slotStart]:not(:disabled))")
      .first()
      .click();
    await page.locator("input[name=name]").fill(f.name);
    await page.locator("input[name=mobile]").fill(f.mobile);
    await page.locator("input[name=consent]").check({ force: true });
    return f;
  };

  test("visit types render; picking one enables the reason select", async ({
    page,
  }) => {
    await page.goto("/book/");
    for (const t of [
      "New consultation",
      "Follow-up",
      "Show reports",
      "Test only",
    ]) {
      await expect(page.getByRole("radio", { name: t })).toBeVisible();
    }
    const reason = page.locator("select[name=reason]");
    await expect(reason).toBeDisabled();
    await page.locator(".vt-card", { hasText: "Follow-up" }).click();
    await expect(reason).toBeEnabled();
    await reason.selectOption("Diabetes or high sugar");
    await expect(reason).toHaveValue("Diabetes or high sugar");
  });

  test("Test only switches the select to tests with a prep note", async ({
    page,
  }) => {
    await page.goto("/book/");
    await page.locator(".vt-card", { hasText: "Test only" }).click();
    const sel = page.locator("select[name=reason]");
    await sel.selectOption("ECG");
    await expect(sel).toHaveValue("ECG");
    await expect(page.locator(".bk-prep")).toContainText(
      "No special preparation",
    );
  });

  test("day strip and slot grid let a slot be picked", async ({ page }) => {
    await page.goto("/book/");
    const day = page
      .locator(".day-strip .day:has(input[name=date]:not(:disabled))")
      .first();
    await expect(day).toBeVisible({ timeout: 15000 });
    await day.click();
    const slot = page
      .locator(".slot:has(input[name=slotStart]:not(:disabled))")
      .first();
    await expect(slot).toBeVisible();
    await slot.click();
    await expect(page.locator("input[name=slotStart]:checked")).toHaveCount(1);
  });

  test("empty submit shows inline errors and moves focus", async ({
    page,
  }) => {
    await page.goto("/book/");
    await page.locator("button.bform-submit").click();
    await expect(page.locator(".fld-err").first()).toBeVisible();
    const focused = await page.evaluate(() =>
      document.activeElement?.getAttribute("name"),
    );
    expect(focused).toBe("visitType");
    expect(page.url()).toContain("/book/");
  });

  test("honeypot submissions are silently accepted", async ({ page }) => {
    await page.goto("/book/");
    await fill(page);
    await page.locator("input[name=website]").evaluate((el: HTMLInputElement) => {
      el.value = "http://spam.example";
    });
    await page.locator("button.bform-submit").click();
    await expect(page.locator(".bk-success")).toContainText(
      "Request received",
      { timeout: 15000 },
    );
  });

  test("without SHEETS_* env a valid submit shows the fallback panel", async ({
    page,
  }) => {
    test.skip(Boolean(process.env.SHEETS_WEBHOOK_URL), "Sheet is configured");
    await page.goto("/book/");
    await fill(page);
    // startedAt guard: real submissions must be at least 3 s after render.
    await page.waitForTimeout(3200);
    await page.locator("button.bform-submit").click();
    const panel = page.locator(".bk-success");
    await expect(panel).toContainText("Something went wrong", {
      timeout: 15000,
    });
    await expect(panel.locator('a[href^="tel:"]')).toBeVisible();
    await expect(
      panel.getByRole("button", { name: /WhatsApp/ }),
    ).toBeVisible();
  });

  test("reason prefills from ?reason=", async ({ page }) => {
    await page.goto("/book/?reason=echocardiography");
    await expect(
      page.getByRole("radio", { name: "Test only" }),
    ).toBeChecked();
    await expect(page.locator("select[name=reason]")).toHaveValue(
      "Echocardiography (echo)",
    );
  });

  test("no WhatsApp button inside the booking form", async ({ page }) => {
    await page.goto("/book/");
    const form = page.locator("form.bform.booking");
    await expect(
      form.locator('a[href*="wa.me"], button:has-text("WhatsApp")'),
    ).toHaveCount(0);
  });
});

/* ---------- embedded map ---------- */

test("Google Maps embed loads directly without a click", async ({ page }) => {
  const hits: string[] = [];
  page.on("request", (r) => {
    if (/google\.com\/maps|maps\.google|maps\.app\.goo/.test(r.url()))
      hits.push(r.url());
  });
  await page.goto("/plan-your-visit/");
  const iframe = page.locator(".mapcard iframe");
  await expect(iframe).toHaveCount(1);
  await expect(iframe).toHaveAttribute("src", /google\.com\/maps/);
  await iframe.scrollIntoViewIfNeeded();
  await page.waitForTimeout(4000);
  expect(hits.length).toBeGreaterThan(0);
});
