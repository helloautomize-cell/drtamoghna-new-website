import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const OUT = new URL("../_review/phase-4/", import.meta.url).pathname;

const SHOTS = [
  ["home", "/"],
  ["diabetes-care", "/diabetes-care/"],
  ["echocardiography", "/heart-health/echocardiography/"],
  ["fatty-liver", "/internal-medicine/fatty-liver/"],
  ["glp-1-medicines", "/weight-management/glp-1-medicines/"],
  ["dr-tamoghna-das", "/dr-tamoghna-das/"],
  ["about", "/about/"],
  ["plan-your-visit", "/plan-your-visit/"],
  ["contact", "/contact/"],
  ["hba1c-explained", "/health-library/hba1c-explained/"],
  ["privacy-policy", "/privacy-policy/"],
];

// home sections captured at 390: [name, index into .section-mc]
const HOME_SECTIONS = [
  ["s-hero", -1],
  ["s-pills", -2],
  ["s-why", 0],
  ["s-about", 1],
  ["s-services", 2],
  ["s-steps", 3],
  ["s-visitband", -3],
  ["s-doctor", 4],
  ["s-conditions", 5],
  ["s-library", 6],
  ["s-faqs", 7],
  ["s-contact", 8],
];

async function settle(page) {
  const acc = page.getByRole("button", { name: "Accept" }).first();
  if (await acc.count()) await acc.click().catch(() => {});
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= h; y += 700) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(90);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(700);
}

const browser = await chromium.launch();
for (const width of [1440, 390]) {
  const ctx = await browser.newContext({
    viewport: { width, height: width === 390 ? 844 : 900 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  for (const [name, path] of SHOTS) {
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    await settle(page);
    await page.screenshot({ path: `${OUT}${name}-${width}.png`, fullPage: true });
    console.log(`${name}-${width}.png`);
    if (name === "echocardiography") {
      const v = page.locator(".echovideo").first();
      if (await v.count()) {
        await v.evaluate((el) => el.scrollIntoView({ block: "center" }));
        await page.waitForTimeout(900);
        await page.screenshot({ path: `${OUT}echo-video-${width}.png` });
        console.log(`echo-video-${width}.png`);
      }
    }
  }
  if (width === 390) {
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await settle(page);
    for (const [name, idx] of HOME_SECTIONS) {
      const el =
        idx === -1
          ? page.locator(".home-hero")
          : idx === -2
            ? page.locator(".concern")
            : idx === -3
              ? page.locator(".vband")
              : page.locator(".section-mc").nth(idx);
      if (!(await el.count())) {
        console.log(`MISSING ${name}`);
        continue;
      }
      await el.evaluate((e) => e.scrollIntoView({ block: "start" }));
      await page.waitForTimeout(500);
      await el.screenshot({ path: `${OUT}home-${name}-390.png` });
      console.log(`home-${name}-390.png`);
    }
  }
  await ctx.close();
}
await browser.close();
