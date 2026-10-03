import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL || "https://drtamoghna-new-website.vercel.app";
const OUT = new URL("../_review/phase-3/", import.meta.url).pathname;

const SHOTS = [
  ["diabetes-care", "/diabetes-care/"],
  ["diabetes-in-pregnancy", "/diabetes-care/diabetes-in-pregnancy/"],
  ["echocardiography", "/heart-health/echocardiography/"],
  ["glp-1-medicines", "/weight-management/glp-1-medicines/"],
  ["dr-tamoghna-das", "/dr-tamoghna-das/"],
  ["about", "/about/"],
  ["plan-your-visit", "/plan-your-visit/"],
  ["faqs", "/faqs/"],
  ["health-library", "/health-library/"],
  ["hba1c-explained", "/health-library/hba1c-explained/"],
  ["privacy-policy", "/privacy-policy/"],
];

const browser = await chromium.launch();
for (const width of [1440, 390]) {
  const ctx = await browser.newContext({
    viewport: { width, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  for (const [name, path] of SHOTS) {
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${OUT}${name}-${width}.png`, fullPage: true });
    console.log(`${name}-${width}.png`);
  }
  // contact with server validation errors shown
  await page.goto(BASE + "/contact/", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const decline = page.locator('button:has-text("Decline")').first();
  if (await decline.isVisible()) await decline.click();
  await page.locator("#f-name").fill("T"); // too short: server error
  await page.locator("#f-mobile").fill("123"); // invalid mobile
  await page.locator("#f-age").fill("45");
  await page.locator("#f-reason").selectOption("diabetes");
  const d = new Date(Date.now() + 10 * 86400000);
  const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  await page.locator("#f-date").fill(iso);
  await page.locator("input[name=consent]").check({ force: true });
  await page.waitForTimeout(3200); // pass the too-fast check
  await page.locator("button.bform-submit").click();
  await page.waitForTimeout(1500);
  await page.locator("#book").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${OUT}contact-validation-${width}.png` });
  console.log(`contact-validation-${width}.png`);
  await ctx.close();
}
await browser.close();
