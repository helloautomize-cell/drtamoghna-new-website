import { test, expect } from "@playwright/test";

const MOBILE = { width: 390, height: 844 };

async function dismissConsent(page: import("@playwright/test").Page) {
  const accept = page.getByRole("button", { name: "Accept" }).first();
  if (await accept.count()) await accept.click();
}

test.describe("home hero mobile fold", () => {
  test.use({ viewport: MOBILE });

  test("H1, portrait and Book button are fully above the fold at 390x844", async ({
    page,
  }) => {
    await page.goto("/");
    const fold = MOBILE.height;
    for (const sel of ["h1", ".portrait", ".hero .btns"]) {
      const box = await page.locator(sel).first().boundingBox();
      expect(box, `${sel} should have a box`).toBeTruthy();
      expect(box!.y + box!.height, `${sel} must be above the fold`).toBeLessThanOrEqual(fold);
      expect(box!.y).toBeGreaterThanOrEqual(0);
    }
    // Mobile hero shows the short line and hides chips + doctor chip
    await expect(page.locator(".hero .mline")).toBeVisible();
    await expect(page.locator(".hero .hchips")).toBeHidden();
    await expect(page.locator(".hero .chip-doc")).toBeHidden();
    // Book + call icon in one row
    const btns = await page.locator(".hero .btns").boundingBox();
    const book = await page.locator(".hero .btns .book").boundingBox();
    const call = await page.locator(".hero .btns .hcall-ic").boundingBox();
    expect(call).toBeTruthy();
    expect(Math.abs(book!.y - call!.y)).toBeLessThan(4);
    expect(call!.x + call!.width).toBeLessThanOrEqual(btns!.x + btns!.width + 1);
  });

  test("no section except the hero and booking form is taller than 1.3x viewport", async ({ page }) => {
    await page.goto("/");
    await dismissConsent(page);
    const max = MOBILE.height * 1.3;
    const tall = await page.evaluate((m) => {
      const out: string[] = [];
      document
        .querySelectorAll("main section, main .section-mc, main .vband")
        .forEach((el) => {
          // #book is the four-step slot booking form, tall by design.
          if (el.closest(".home-hero") || el.closest("#book")) return;
          const h = el.getBoundingClientRect().height;
          if (h > m)
            out.push(
              `${el.className.toString().slice(0, 40)} ${Math.round(h)}px`,
            );
        });
      return out;
    }, max);
    expect(tall).toEqual([]);
  });

  test("total home height is reported (target ~11000-13000px)", async ({ page }) => {
    await page.goto("/");
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    console.log(`HOME_HEIGHT_390=${h}`);
    expect(h).toBeGreaterThan(5000);
    expect(h).toBeLessThan(13000);
  });
});

test.describe("home motion", () => {
  test("marquee rows animate and pause on hover", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await dismissConsent(page);
    const row = page.locator(".mq-row").first();
    await page
      .locator(".mqwrap")
      .evaluate((el) => el.scrollIntoView({ block: "center" }));
    await page.waitForTimeout(300);
    const running = await row.evaluate(
      (el) => getComputedStyle(el).animationPlayState,
    );
    expect(running).toBe("running");
    await page.locator(".mqwrap").hover();
    const paused = await row.evaluate(
      (el) => getComputedStyle(el).animationPlayState,
    );
    expect(paused).toBe("paused");
  });

  test("mobile carousels self-advance and pause via the pause button", async ({
    page,
  }) => {
    await page.setViewportSize(MOBILE);
    await page.goto("/");
    await dismissConsent(page);
    const row = page.locator(".cards.swipe").first();
    await row.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const first = await row.evaluate((el) => el.scrollLeft);
    await page.waitForTimeout(5200);
    const second = await row.evaluate((el) => el.scrollLeft);
    expect(second).toBeGreaterThan(first);
    const pause = page
      .locator(".ctrl .pp")
      .filter({ visible: true })
      .first();
    await pause.click();
    const at = await row.evaluate((el) => el.scrollLeft);
    await page.waitForTimeout(5000);
    const after = await row.evaluate((el) => el.scrollLeft);
    expect(Math.abs(after - at)).toBeLessThanOrEqual(5);
  });

  test("nothing animates under prefers-reduced-motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await dismissConsent(page);
    const anim = await page
      .locator(".mq-row")
      .first()
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(anim).toBe("none");
    const reveal = await page
      .locator("[data-reveal]")
      .first()
      .evaluate((el) => getComputedStyle(el).opacity);
    expect(reveal).toBe("1");
  });
});

test.describe("media request gating", () => {
  test("homepage map card renders the Google Maps embed", async ({ page }) => {
    await page.goto("/");
    await dismissConsent(page);
    const iframe = page.locator(".mapcard iframe");
    await expect(iframe).toHaveCount(1);
    await expect(iframe).toHaveAttribute("src", /google\.com\/maps/);
  });

  test("echo video makes no network request until it is in view", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    const video: string[] = [];
    page.on("request", (r) => {
      if (/\.mp4/.test(r.url())) video.push(r.url());
    });
    await page.goto("/heart-health/echocardiography/");
    await dismissConsent(page);
    await page.waitForTimeout(2500);
    expect(video).toEqual([]);
    const v = page.locator(".echovideo video");
    await v.scrollIntoViewIfNeeded();
    await expect
      .poll(() => video.length, { timeout: 8000 })
      .toBeGreaterThan(0);
  });

  test("echo video shows poster + play button under reduced motion", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/heart-health/echocardiography/");
    await dismissConsent(page);
    const poster = page.locator(".ev-poster");
    await poster.scrollIntoViewIfNeeded();
    await expect(poster).toBeVisible();
    await poster.click();
    await expect(page.locator(".echovideo video")).toBeVisible();
  });
});
