import { test, expect } from "@playwright/test";

const ROUTES = ["/", "/styleguide/", "/no-such-page/"];

test.describe("layout", () => {
  for (const route of ROUTES) {
    for (const width of [390, 768, 1024, 1440]) {
      test(`no horizontal overflow on ${route} at ${width}`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(route);
        await page.waitForTimeout(600);
        const overflow = await page.evaluate(
          () =>
            Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) -
            document.documentElement.clientWidth,
        );
        expect(overflow).toBeLessThanOrEqual(1);
      });
    }
    test(`no nested interactive elements on ${route}`, async ({ page }) => {
      await page.goto(route);
      const count = await page.evaluate(
        () => document.querySelectorAll("a a, a button, button a").length,
      );
      expect(count).toBe(0);
    });
  }
});

test.describe("mega menus", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  const triggers = ["Diabetes and weight", "Heart health", "More care"];

  for (const label of triggers) {
    test(`${label} opens on hover and closes on Esc`, async ({ page }) => {
      await page.goto("/");
      const trigger = page.getByRole("button", { name: label, exact: true });
      await trigger.hover();
      const panel = page.locator('[data-state="open"].mmpanel, .mmpanel:visible').first();
      await expect(panel).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(panel).toBeHidden();
    });
  }

  test("menu opens via keyboard and links do not overlap", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Diabetes and weight", exact: true });
    await trigger.focus();
    await page.keyboard.press("Enter");
    const panel = page.locator(".mmpanel:visible");
    await expect(panel).toBeVisible();
    const overlaps = await panel.evaluate((el) => {
      const links = Array.from(el.querySelectorAll("a"));
      const rects = links.map((a) => a.getBoundingClientRect());
      for (let i = 0; i < rects.length; i++) {
        for (let j = i + 1; j < rects.length; j++) {
          const a = rects[i];
          const b = rects[j];
          const x = Math.min(a.right, b.right) - Math.max(a.left, b.left);
          const y = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
          if (x > 1 && y > 1) return `${links[i].textContent} x ${links[j].textContent}`;
        }
      }
      return null;
    });
    expect(overlaps).toBeNull();
    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
  });

  for (const width of [1024, 1440]) {
    test(`panels stay inside the viewport at ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      for (const label of triggers) {
        const trigger = page.getByRole("button", { name: label, exact: true });
        await trigger.hover();
        const panel = page.locator(".mmpanel:visible");
        await expect(panel).toBeVisible();
        const box = await panel.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
        await page.keyboard.press("Escape");
        await expect(panel).toBeHidden();
      }
    });
  }
});

test.describe("mobile menu", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("opens, traps focus, closes on Esc", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const sheet = page.getByRole("dialog");
    await expect(sheet).toBeVisible();

    // Focus stays inside the sheet when tabbing.
    await page.keyboard.press("Tab");
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press("Tab");
      const inside = await page.evaluate(() => {
        const dialog = document.querySelector('[role="dialog"]');
        return !!dialog && dialog.contains(document.activeElement);
      });
      expect(inside).toBe(true);
    }

    await page.keyboard.press("Escape");
    await expect(sheet).toBeHidden();
  });

  test("shows today's hours in the footer", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.locator(".mmenu-hours")).toContainText("Open today:");
  });
});

test.describe("mobile action bar", () => {
  test("visible below 1024; WhatsApp opens the two-number chooser", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/styleguide/");
    const bar = page.locator("nav.mbar");
    await expect(bar).toBeVisible();
    await bar.getByRole("button", { name: "WhatsApp" }).click();
    const chooser = page.getByRole("dialog");
    await expect(chooser).toContainText("Chat on WhatsApp");
    const links = chooser.locator('a[href^="https://wa.me/"]');
    await expect(links).toHaveCount(2);
    for (const num of ["916003121297", "919365175235"]) {
      const href = await chooser
        .locator(`a[href^="https://wa.me/${num}"]`)
        .getAttribute("href");
      expect(href).toContain(
        encodeURIComponent(
          "Hello Medcare\nI'd like to book an appointment with Dr. Tamoghna Das.",
        ),
      );
    }
    await page.keyboard.press("Escape");
    // Call Now opens the sheet with the one call number.
    await bar.getByRole("button", { name: "Call Now" }).click();
    await expect(page.getByRole("dialog").getByRole("link", { name: /60031 21297/ })).toBeVisible();
  });

  test("hidden at 1440", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await expect(page.locator("nav.mbar")).toBeHidden();
  });
});

test.describe("cookie banner", () => {
  test("Decline hides it and persists across reload", async ({ page }) => {
    await page.goto("/");
    const banner = page.locator(".cookie");
    await expect(banner).toBeVisible();
    await banner.getByRole("button", { name: "Decline" }).click();
    await expect(banner).toBeHidden();
    await page.reload();
    await expect(page.locator(".cookie")).toHaveCount(0);
  });

  test("footer Cookie settings re-opens the dialog", async ({ page }) => {
    await page.goto("/");
    await page.locator(".cookie").getByRole("button", { name: "Accept" }).click();
    await page.locator(".foot-cookies").first().click();
    await expect(page.getByRole("dialog", { name: "Cookie settings" })).toBeVisible();
  });

  test("zero requests to google-analytics or googletagmanager", async ({ page }) => {
    const hits: string[] = [];
    page.on("request", (r) => {
      const u = r.url();
      if (u.includes("google-analytics") || u.includes("googletagmanager")) hits.push(u);
    });
    await page.goto("/");
    await page.goto("/styleguide/");
    expect(hits).toEqual([]);
  });
});
