import { test, expect } from "@playwright/test";

const PAGE = "/styleguide/";

test.describe("layout", () => {
  for (const width of [390, 768, 1024, 1440]) {
    test(`no horizontal overflow at ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(PAGE);
      await page.waitForTimeout(800);
      const overflow = await page.evaluate(
        () =>
          Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }

  test("no nested interactive elements", async ({ page }) => {
    await page.goto(PAGE);
    const count = await page.evaluate(
      () => document.querySelectorAll("a a, a button, button a").length,
    );
    expect(count).toBe(0);
  });
});

test.describe("motion", () => {
  test("no running CSS animations under prefers-reduced-motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(PAGE);
    await page.waitForTimeout(600);
    const running = await page.evaluate(() => {
      const bad: string[] = [];
      document.querySelectorAll("*").forEach((el) => {
        const s = getComputedStyle(el);
        if (s.animationName !== "none" && s.animationPlayState === "running") {
          bad.push(el.tagName + "." + el.className);
        }
      });
      return bad;
    });
    expect(running).toEqual([]);
  });
});

test.describe("carousels", () => {
  test("centred carousel pauses on hover and via the pause button", async ({ page }) => {
    await page.goto(PAGE);
    const carousel = page.locator(".car").first();
    await carousel.scrollIntoViewIfNeeded();
    const dotIndex = () =>
      page
        .locator(".carnav .dots button.on")
        .evaluateAll((dots) =>
          dots.length ? Array.from(dots[0].parentElement!.children).indexOf(dots[0]) : -1,
        );

    // pause via button
    await page.locator('.carnav button[aria-label="Pause slideshow"]').click();
    const before = await dotIndex();
    await page.waitForTimeout(5000);
    expect(await dotIndex()).toBe(before);

    // resume, then hover pause
    await page.locator('.carnav button[aria-label="Play slideshow"]').click();
    await carousel.hover();
    await page.waitForTimeout(100);
    const before2 = await dotIndex();
    await page.waitForTimeout(5000);
    expect(await dotIndex()).toBe(before2);
  });

  test("service carousel pauses on hover and via the pause button", async ({ page }) => {
    await page.goto(PAGE);
    const viewport = page.locator(".sg-embla").first();
    await viewport.scrollIntoViewIfNeeded();
    const transform = () =>
      page
        .locator(".sg-embla > div")
        .first()
        .evaluate((el) => getComputedStyle(el).transform);

    await page.locator('.washsvc button[aria-label="Pause slideshow"]').click();
    const t0 = await transform();
    await page.waitForTimeout(5000);
    expect(await transform()).toBe(t0);

    await page.locator('.washsvc button[aria-label="Play slideshow"]').click();
    await viewport.hover();
    await page.waitForTimeout(100);
    const t1 = await transform();
    await page.waitForTimeout(5000);
    expect(await transform()).toBe(t1);
  });
});

test.describe("indexing", () => {
  for (const path of ["/styleguide/", "/thank-you/"]) {
    test(`X-Robots-Tag noindex on ${path}`, async ({ request }) => {
      const res = await request.get(path);
      expect(res.headers()["x-robots-tag"]).toContain("noindex");
    });
  }

  test("robots meta present in HTML", async ({ page }) => {
    await page.goto(PAGE);
    const content = await page.locator('meta[name="robots"]').first().getAttribute("content");
    expect(content).toContain("noindex");
  });
});
