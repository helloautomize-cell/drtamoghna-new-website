import { test, expect, type Page } from "@playwright/test";

/**
 * Mobile integrity: no section can render blank, stuck hidden, low
 * contrast, clipped or unreachable under the sticky header/action bar.
 * Covers every public page at 390px (touch), plus the home page at
 * 360px and 414px, including client-side navigation and Back.
 */

const PAGES = [
  "/", "/about/", "/accessibility/", "/appointments-cancellation-refund/",
  "/asthma-copd/", "/coming-from-outside-bongaigaon/", "/contact/",
  "/diabetes-care/", "/diabetes-care/continuous-glucose-monitoring/",
  "/diabetes-care/diabetes-in-pregnancy/", "/diabetes-care/diabetic-foot-care/",
  "/dr-tamoghna-das/", "/editorial-policy/", "/faqs/", "/health-check-ups/",
  "/health-library/", "/health-library/echo-for-people-with-diabetes/",
  "/health-library/hba1c-explained/", "/health-library/snoring-and-sleep-apnea/",
  "/heart-health/", "/heart-health/echocardiography/", "/heart-health/heart-failure/",
  "/heart-health/high-blood-pressure/", "/heart-health/holter-monitoring/",
  "/internal-medicine/", "/internal-medicine/anaemia/",
  "/internal-medicine/fatty-liver/", "/internal-medicine/fever-and-infections/",
  "/internal-medicine/joint-pain-arthritis/", "/internal-medicine/migraine-headache/",
  "/medical-disclaimer/", "/patient-rights/", "/plan-your-visit/",
  "/privacy-policy/", "/services/", "/sleep-apnea/", "/terms-of-use/",
  "/thyroid-disorders/", "/weight-management/", "/weight-management/glp-1-medicines/",
];

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

/** Section-by-section: every section must show visible text or an image. */
async function sectionCheck(page: Page) {
  const bad = await page.evaluate(() => {
    const out: string[] = [];
    document.querySelectorAll("section").forEach((sec, i) => {
      const r = sec.getBoundingClientRect();
      if (r.height < 8) return;
      // has visible text?
      const txt = (sec.textContent || "").trim();
      const hasImg = sec.querySelector("img, svg, video, [role='img'], picture");
      const cs = getComputedStyle(sec);
      const hidden = parseFloat(cs.opacity) < 0.9 || cs.visibility === "hidden";
      if (hidden && txt.length > 20) out.push(`section[${i}] hidden op=${cs.opacity}`);
      else if (!txt && !hasImg) out.push(`section[${i}] empty`);
      // heading must not land under the sticky header
      const h = sec.querySelector("h2, h3");
      if (h) {
        const hr = h.getBoundingClientRect();
        if (hr.top < 60 && hr.bottom > 60) {
          // heading straddles the header zone; check it isn't covered
          const topEl = document.elementFromPoint(innerWidth / 2, Math.max(1, hr.top + 2));
          if (topEl && !sec.contains(topEl)) out.push(`section[${i}] heading covered`);
        }
      }
    });
    return out;
  });
  expect(bad, `blank/hidden sections`).toEqual([]);
}

/** Empty vertical run > 200px along the centre line. */
async function gapCheck(page: Page) {
  const gaps = await page.evaluate(() => {
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    const docH = Math.max(document.body.scrollHeight, html.scrollHeight);
    const vw = innerWidth, vh = innerHeight;
    const EMPTY = /^(BODY|HTML|MAIN|DIV|SECTION)$/;
    let run = 0, start = 0;
    const out: string[] = [];
    for (let y = 0; y < docH; y += 40) {
      scrollTo(0, y);
      const el = document.elementFromPoint(vw / 2, Math.min(vh / 2, docH - y - 1));
      const empty =
        !el ||
        (EMPTY.test(el.tagName) && !(el.textContent || "").trim()) ||
        (el.tagName === "DIV" && !el.querySelector("img,svg,video") && !(el.textContent || "").trim());
      if (empty) {
        if (!run) start = y;
        run += 40;
      } else {
        if (run > 200) out.push(`${run}px gap at y~${start}`);
        run = 0;
      }
    }
    if (run > 200) out.push(`${run}px gap at end y~${start}`);
    scrollTo(0, 0);
    html.style.scrollBehavior = prev;
    return out;
  });
  expect(gaps, `>200px empty gaps`).toEqual([]);
}

/** All visible text must reach 4.5:1 on its painted background. */
async function contrastCheck(page: Page) {
  const bad = await page.evaluate(() => {
    const out: string[] = [];
    const lumRgb = (r: number, g: number, b: number) => {
      const f = (v: number) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const parse = (c: string) => {
      const m = c.match(/rgba?\(([^)]+)\)/);
      return m ? m[1].split(",").map(Number) : null;
    };
    const bgOf = (el: Element): { r: number; g: number; b: number } => {
      let e: Element | null = el;
      while (e) {
        const st = getComputedStyle(e);
        const c = parse(st.backgroundColor);
        if (c && (c[3] ?? 1) > 0) {
          const a = c[3] ?? 1;
          return { r: c[0] * a + 255 * (1 - a), g: c[1] * a + 255 * (1 - a), b: c[2] * a + 255 * (1 - a) };
        }
        const img = st.backgroundImage || "";
        if (img.includes("gradient")) {
          const stops: { r: number; g: number; b: number }[] = [];
          for (const m of img.matchAll(/#([0-9a-f]{3,8})\b/gi)) {
            let h = m[1];
            if (h.length === 3) h = h.split("").map((x) => x + x).join("");
            if (h.length >= 6)
              stops.push({ r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) });
          }
          for (const m of img.matchAll(/rgba?\(([^)]+)\)/g)) {
            const [r, g, b, a = 1] = m[1].split(",").map(Number);
            stops.push({ r: r * a + 255 * (1 - a), g: g * a + 255 * (1 - a), b: b * a + 255 * (1 - a) });
          }
          if (stops.length) return stops.reduce((x, y) => (lumRgb(x.r, x.g, x.b) > lumRgb(y.r, y.g, y.b) ? x : y));
        }
        e = e.parentElement;
      }
      return { r: 255, g: 255, b: 255 };
    };
    const vh = innerHeight;
    document
      .querySelectorAll("p, h1, h2, h3, h4, li, a, span, td, th, label, small, summary, button")
      .forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh || r.width === 0 || r.height === 0) return;
        const txt = (el.textContent || "").trim();
        if (txt.length < 3) return;
        const cs = getComputedStyle(el);
        if (parseFloat(cs.opacity) < 0.9 || cs.visibility === "hidden") return;
        if (parseFloat(cs.fontSize) < 8) return;
        const fg = parse(cs.color);
        if (!fg) return;
        const bg = bgOf(el);
        const fgl = lumRgb(fg[0], fg[1], fg[2]);
        const bgl = lumRgb(bg.r, bg.g, bg.b);
        const c = (Math.max(fgl, bgl) + 0.05) / (Math.min(fgl, bgl) + 0.05);
        if (c < 4.5) out.push(`${el.tagName} "${txt.slice(0, 30)}" ${c.toFixed(2)}:1`);
      });
    return out;
  });
  expect(bad, `low-contrast text`).toEqual([]);
}

/** No horizontal overflow. */
async function overflowCheck(page: Page) {
  const w = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(w).toBeLessThanOrEqual(391);
}

test.describe("mobile integrity at 390px (every public page)", () => {
  for (const p of PAGES) {
    test(`${p}: sections visible, no gaps, contrast ok, no overflow`, async ({ page }) => {
      await page.goto(p, { waitUntil: "load" });
      await page.waitForTimeout(1500); // reveal failsafe window
      // scroll through once so lazy content mounts
      await page.evaluate(async () => {
        await new Promise<void>((r) => {
          let y = 0;
          const t = setInterval(() => {
            y += 700;
            scrollTo(0, y);
            if (y >= document.body.scrollHeight) {
              clearInterval(t);
              r();
            }
          }, 50);
        });
      });
      await page.waitForTimeout(400);
      await page.evaluate(() => scrollTo(0, 0));
      await sectionCheck(page);
      await gapCheck(page);
      await contrastCheck(page);
      await overflowCheck(page);
    });
  }
});

test.describe("home page at 360 and 414px", () => {
  for (const w of [360, 414]) {
    test(`/ at ${w}px: same checks`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: 844 });
      await page.goto("/", { waitUntil: "load" });
      await page.waitForTimeout(1500);
      await sectionCheck(page);
      await gapCheck(page);
      await contrastCheck(page);
      const ow = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(ow).toBeLessThanOrEqual(w + 1);
    });
  }
});

test.describe("home service carousel", () => {
  test("cards visible on first load, after auto-advance, after tab switch, after nav+Back", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await page.waitForTimeout(1500);
    const row = page.locator(".sg-mrow");
    await expect(row).toBeVisible();

    const visibleSlides = () =>
      page.evaluate(() => {
        const row = document.querySelector(".sg-mrow")!;
        const r = row.getBoundingClientRect();
        let n = 0;
        row.querySelectorAll(".sg-slide").forEach((s) => {
          const sr = s.getBoundingClientRect();
          if (sr.right > r.left + 20 && sr.left < r.right - 20 && sr.width > 0) n++;
        });
        return n;
      });

    // first load: at least one full card in view
    await row.scrollIntoViewIfNeeded();
    expect(await visibleSlides()).toBeGreaterThanOrEqual(1);
    const t0 = await page.evaluate(() => (document.querySelector(".sg-mrow") as HTMLElement).scrollLeft);

    // three auto-advance steps (~3s each)
    for (let i = 0; i < 3; i++) {
      await page.waitForTimeout(3300);
      const sl = await page.evaluate(() => (document.querySelector(".sg-mrow") as HTMLElement).scrollLeft);
      expect(sl).not.toBe(t0);
      expect(await visibleSlides()).toBeGreaterThanOrEqual(1);
    }

    // every tab shows cards immediately
    const tabs = page.locator(".tabs .tab");
    const n = await tabs.count();
    for (let i = 0; i < n; i++) {
      await tabs.nth(i).click();
      await page.waitForTimeout(400);
      expect(await visibleSlides()).toBeGreaterThanOrEqual(1);
    }

    // client nav away and Back
    await page.evaluate(() => {
      const a = document.querySelector('a[href="/about/"]') as HTMLAnchorElement;
      a?.click();
    });
    await page.waitForURL("**/about/**", { timeout: 10000 });
    await page.goBack({ waitUntil: "load" });
    await page.waitForTimeout(1500);
    await row.scrollIntoViewIfNeeded();
    expect(await visibleSlides()).toBeGreaterThanOrEqual(1);
  });
});

test.describe("CTA band", () => {
  test("heading visible with >=4.5:1 contrast on / and /diabetes-care/", async ({ page }) => {
    for (const p of ["/", "/diabetes-care/"]) {
      await page.goto(p, { waitUntil: "load" });
      await page.waitForTimeout(1200);
      const cta = page.locator(".cta-band h2, .cta-band .cta-in h2").first();
      await expect(cta).toBeVisible();
      const c = await page.evaluate(() => {
        const h2 = document.querySelector(".cta-band h2")!;
        const parse = (s: string) => s.match(/rgba?\(([^)]+)\)/)![1].split(",").map(Number);
        const lum = (r: number, g: number, b: number) => {
          const f = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
          return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
        };
        const fg = lum(...(parse(getComputedStyle(h2).color) as [number, number, number]));
        // darkest stop of the cta gradient is the bg worst case -> use lightest stop
        const band = h2.closest(".cta-band")!;
        const stops = [...getComputedStyle(band).backgroundImage.matchAll(/rgba?\(([^)]+)\)/g)].map((m) =>
          m[1].split(",").map(Number),
        );
        const worst = stops.reduce((a, b) => (lum(a[0], a[1], a[2]) > lum(b[0], b[1], b[2]) ? a : b));
        const bg = lum(worst[0], worst[1], worst[2]);
        return (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
      });
      expect(c, `${p} CTA heading contrast`).toBeGreaterThanOrEqual(4.5);
    }
  });
});

test.describe("no-js safety", () => {
  test("all content visible with JavaScript disabled", async ({ browser }) => {
    const ctx = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    const pg = await ctx.newPage();
    await pg.goto("/", { waitUntil: "load" });
    const hidden = await pg.evaluate(() => {
      const out: number[] = [];
      document.querySelectorAll("[data-reveal]").forEach((el, i) => {
        if (parseFloat(getComputedStyle(el).opacity) < 0.9) out.push(i);
      });
      return out;
    });
    expect(hidden).toEqual([]);
    await ctx.close();
  });
});
