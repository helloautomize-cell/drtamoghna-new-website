import { test, expect } from "@playwright/test";

const AGENCY_URL = "https://www.automizemedialabs.com/";
const VISIBLE_CREDIT = "Built & Marketed by Automize Media Labs";
const LLMS_CREDIT = `Website built and marketed by Automize Media Labs (${AGENCY_URL})`;

for (const path of [
  "/",
  "/health-library/",
  "/health-library/hba1c-explained/",
  "/diabetes-care/",
  "/contact/",
  "/dr-tamoghna-das/",
  "/styleguide/",
  "/agency-credit-missing-page/",
]) {
  test(`agency credit appears once with valid metadata and schema on ${path}`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(path.includes("missing-page") ? 404 : 200);
    await expect(page.locator("footer")).toHaveCount(1);
    const credit = page.getByText(VISIBLE_CREDIT, { exact: true });
    await expect(credit).toHaveCount(1);
    await expect(credit).toBeVisible();
    const link = page.locator("footer").getByRole("link", { name: "Automize Media Labs", exact: true });
    await expect(link).toHaveAttribute("href", AGENCY_URL);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener nofollow");

    // Next.js intentionally adds noindex to missing pages, but inherits authorship.
    await expect(page.locator('meta[name="author"]')).toHaveAttribute("content", "Automize Media Labs");
    await expect(page.locator('meta[name="creator"]')).toHaveAttribute("content", "Automize Media Labs");
    await expect(page.locator('link[rel="author"]')).toHaveAttribute("href", AGENCY_URL);
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(new Set(blocks).size).toBe(blocks.length);
    const nodes = blocks.flatMap((raw) => {
      const json = JSON.parse(raw);
      return json["@graph"] ?? [json];
    });
    const websites = nodes.filter((node) => node["@type"] === "WebSite");
    expect(websites).toHaveLength(1);
    expect(websites[0].creator).toEqual({
      "@type": "Organization",
      name: "Automize Media Labs",
      url: AGENCY_URL,
    });
  });
}

test("agency credit wraps within a 360px footer", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto("/");
  const credit = page.locator(".foot-credit");
  await credit.scrollIntoViewIfNeeded();
  const bounds = await credit.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(360);
  const overflow = await page.evaluate(() =>
    Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test("text endpoints include agency credits without changing crawler rules or sitemap", async ({ request }) => {
  for (const path of ["/llms.txt", "/llms-full.txt"]) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text.trimEnd().endsWith(LLMS_CREDIT)).toBe(true);
    expect(text.split(LLMS_CREDIT)).toHaveLength(2);
  }
  const humans = await request.get("/humans.txt");
  expect(humans.status()).toBe(200);
  expect(await humans.text()).toBe(
    `/* TEAM */\nBuilt & marketed by: Automize Media Labs\nSite: ${AGENCY_URL}\n\n/* SITE */\nFramework: Next.js\n`,
  );
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  const rules = await robots.text();
  expect(rules).toContain("Allow: /");
  const disallowed = [...rules.matchAll(/^Disallow:\s*(.+)$/gm)].map((match) => match[1].trim());
  expect([...new Set(disallowed)].sort()).toEqual(["/styleguide/", "/thank-you/"]);
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain("/llms.txt</loc>");
  expect(await sitemap.text()).not.toContain("/humans.txt</loc>");
});
