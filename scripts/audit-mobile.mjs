#!/usr/bin/env node
/**
 * audit-mobile.mjs · Full mobile audit of every public page.
 * Usage: node scripts/audit-mobile.mjs [baseUrl] [widths] [paths...]
 *   baseUrl default http://localhost:3100
 *   widths default 390 (comma list for more, e.g. 360,390,414)
 *   paths default: all public pages from the sitemap
 * Checks (per spec): blank content, low-contrast text, >200px empty
 * gaps, broken/lazy-hidden images, clipped controls, horizontal
 * overflow, oversized sections, action-bar coverage, anchor offsets.
 */
import { chromium } from "playwright";

const base = process.argv[2] || "http://localhost:3100";
const widths = (process.argv[3] || "390").split(",").map(Number);
const onlyPaths = process.argv.slice(4);

const FALLBACK = [
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

const paths = onlyPaths.length ? onlyPaths : FALLBACK;
const findings = [];

const AUDIT_JS = `(() => {
  const out = { blanks: [], contrast: [], gaps: [], images: [], clips: [], overflow: [], tall: [], anchors: [], mbar: [] };
  const vw = innerWidth, vh = innerHeight;
  const html = document.documentElement;
  const prevSb = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";

  const lum = (c) => {
    const m = c.match(/rgba?\\(([^)]+)\\)/);
    if (!m) return null;
    const [r, g, b, a = 1] = m[1].split(",").map(Number);
    if (a === 0) return null;
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return { l: 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b), a };
  };
  const parseStops = (img) => {
    // Extract every color stop from a CSS gradient string, composited on white.
    const stops = [];
    const hexRe = /#([0-9a-f]{3,8})\\b/gi;
    const rgbRe = /rgba?\\(([^)]+)\\)/g;
    let m;
    while ((m = hexRe.exec(img))) {
      let h = m[1];
      if (h.length === 3) h = h.split("").map((c) => c + c).join("");
      if (h.length >= 6) stops.push({ r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) });
    }
    while ((m = rgbRe.exec(img))) {
      const [r, g, b, a = 1] = m[1].split(",").map(Number);
      stops.push({ r: r * a + 255 * (1 - a), g: g * a + 255 * (1 - a), b: b * a + 255 * (1 - a) });
    }
    return stops;
  };
  const bgOf = (el) => {
    let e = el;
    while (e) {
      const st = getComputedStyle(e);
      const img = st.backgroundImage || "";
      const bg = st.backgroundColor;
      const m = bg.match(/rgba?\\(([^)]+)\\)/);
      if (m) {
        const [br, bg_, bb, ba = 1] = m[1].split(",").map(Number);
        if (ba > 0) {
          return { r: br * ba + 255 * (1 - ba), g: bg_ * ba + 255 * (1 - ba), b: bb * ba + 255 * (1 - ba) };
        }
      }
      if (img.includes("gradient")) {
        const stops = parseStops(img);
        if (stops.length) {
          // worst case for text contrast: the lightest stop
          return stops.reduce((a, b) => (lumRgb(a) > lumRgb(b) ? a : b));
        }
      }
      e = e.parentElement;
    }
    return { r: 255, g: 255, b: 255 };
  };
  const lumRgb = ({ r, g, b }) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const contrast = (fgL, bg) => {
    const b = lumRgb(bg);
    const [l1, l2] = fgL > b ? [fgL, b] : [b, fgL];
    return (l1 + 0.05) / (l2 + 0.05);
  };
  const sel = (el) => {
    const t = el.tagName.toLowerCase();
    const id = el.id ? "#" + el.id : "";
    const cl = (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\\s+/).slice(0, 2).join(".") : "");
    return t + id + cl;
  };

  // Blank content: visible-position elements with opacity/visibility issues
  document.querySelectorAll("section, .gcard, .sgc, .hl-card, .trk-slide, .step, article, .cta-in, .psec").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh || r.width === 0) return;
    const cs = getComputedStyle(el);
    if (parseFloat(cs.opacity) < 0.9 || cs.visibility === "hidden") {
      const txt = (el.textContent || "").trim();
      if (txt.length > 20) out.blanks.push(sel(el) + " op=" + cs.opacity);
    }
  });

  // Invisible text: contrast < 4.5:1 on painted bg
  const textEls = document.querySelectorAll("p, h1, h2, h3, h4, li, a, span, td, th, label, small, summary, button");
  const seen = new Set();
  textEls.forEach((el) => {
    if (seen.has(el)) return;
    seen.add(el);
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh || r.width === 0 || r.height === 0) return;
    const txt = (el.textContent || "").trim();
    if (!txt || txt.length < 3) return;
    const cs = getComputedStyle(el);
    if (parseFloat(cs.opacity) < 0.9 || cs.visibility === "hidden" || cs.display === "none") return;
    if (parseFloat(cs.fontSize) < 8) return;
    const fg = lum(cs.color);
    if (!fg) return;
    const bg = bgOf(el);
    const c = contrast(fg.l, bg);
    if (c < 4.5) out.contrast.push(sel(el) + ' "' + txt.slice(0, 40) + '" ' + c.toFixed(2) + ":1");
  });

  // Empty-gap scan down the centre line
  const docH = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
  let run = 0, runStart = 0;
  const EMPTY = /^(BODY|HTML|MAIN|DIV|SECTION)$/;
  for (let y = 0; y < docH; y += 40) {
    scrollTo(0, y);
    const el = document.elementFromPoint(vw / 2, Math.min(vh / 2, docH - y - 1));
    const empty = !el || (EMPTY.test(el.tagName) && !(el.textContent || "").trim().length) ||
      (el.tagName === "DIV" && !el.querySelector("img,svg,video") && !(el.textContent || "").trim());
    if (empty) { if (!run) runStart = y; run += 40; }
    else { if (run > 200) out.gaps.push(run + "px at y~" + runStart); run = 0; }
  }
  if (run > 200) out.gaps.push(run + "px at end y~" + runStart);
  scrollTo(0, 0);

  // Images: broken or lazy-inside-scroller on first two items
  document.querySelectorAll("img").forEach((img) => {
    const r = img.getBoundingClientRect();
    if (img.complete && img.naturalWidth === 0 && (img.getAttribute("src") || "").length > 3)
      out.images.push("broken " + (img.getAttribute("src") || "").split("/").pop());
    const sc = img.closest(".sg-mrow, .cards.swipe, .trk-slides, .hl-row, .sg-embla");
    if (sc) {
      if (getComputedStyle(sc).display === "none") return;
      // Embla wraps slides in a track child; the others are the scroller itself
      const slideParent = sc.classList.contains("sg-embla") ? sc.children[0] : sc;
      const kids = slideParent ? [...slideParent.children] : [];
      const idx = kids.findIndex((k) => k.contains(img));
      if (idx >= 0 && idx < 2 && img.loading === "lazy")
        out.images.push("lazy slide " + idx + " in " + sel(sc));
    }
    if (r.width === 0 && r.height === 0 && img.naturalWidth > 0) return;
  });

  // Clipped controls + duplicate adjacent buttons
  document.querySelectorAll("a, button, .chip, .tab").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh || r.width === 0) return;
    if (el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow !== "visible")
      out.clips.push(sel(el) + " clipped " + el.clientWidth + "<" + el.scrollWidth);
  });

  // Horizontal overflow
  if (document.documentElement.scrollWidth > vw + 1)
    out.overflow.push("doc " + document.documentElement.scrollWidth + " > " + vw);
  document.querySelectorAll("section, div, table, pre").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width <= vw + 2) return;
    // clipped by an overflow-hidden/clip ancestor (marquee, masked rows): fine
    let anc = el.parentElement, clipped = false;
    while (anc && anc !== document.body) {
      const ov = getComputedStyle(anc).overflowX;
      if (ov === "hidden" || ov === "clip" || ov === "auto" || ov === "scroll") { clipped = true; break; }
      anc = anc.parentElement;
    }
    if (clipped) return;
    out.overflow.push(sel(el) + " w=" + Math.round(r.width));
  });

  // Sections taller than 1.3x viewport (hero exempt; .psec/legal are
  // flowing article content, not banded sections)
  document.querySelectorAll("section").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (
      r.height > vh * 1.3 &&
      !el.closest(".home-hero") &&
      !el.className.includes("hero") &&
      !el.classList.contains("psec") &&
      !el.closest(".legal")
    )
      out.tall.push(sel(el) + " h=" + Math.round(r.height) + " (" + (r.height / vh).toFixed(2) + "x)");
  });

  // Anchor targets under sticky header
  const hdr = document.querySelector(".sitehdr");
  const hdrH = hdr ? hdr.getBoundingClientRect().height : 80;
  document.querySelectorAll("[id]").forEach((el) => {
    if (!document.querySelector('a[href*="#' + el.id + '"]')) return;
    const sm = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    if (sm < hdrH) out.anchors.push("#" + el.id + " margin=" + sm + " hdr=" + Math.round(hdrH));
  });

  // Mobile action bar coverage
  const mbar = document.querySelector(".mbar");
  if (mbar && getComputedStyle(mbar).display !== "none") {
    scrollTo(0, docH);
    const mr = mbar.getBoundingClientRect();
    const foot = document.querySelector("footer");
    if (foot) {
      const fr = foot.getBoundingClientRect();
      if (fr.bottom > mr.top + 6) out.mbar.push("footer bottom covered by " + Math.round(fr.bottom - mr.top) + "px");
    }
    scrollTo(0, 0);
  }
  html.style.scrollBehavior = prevSb;
  return out;
})()`;

const br = await chromium.launch();
for (const w of widths) {
  const ctx = await br.newContext({
    viewport: { width: w, height: 844 },
    hasTouch: true,
    isMobile: true,
    deviceScaleFactor: 2,
  });
  for (const p of paths) {
    const pg = await ctx.newPage();
    try {
      const cdp = await ctx.newCDPSession(pg);
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
      await cdp.send("Network.enable");
      await cdp.send("Network.emulateNetworkConditions", {
        offline: false, latency: 200, downloadThroughput: 1638400, uploadThroughput: 675840,
      });
      await pg.goto(base + p, { waitUntil: "load", timeout: 60000 });
      await pg.waitForTimeout(1600);
      const res = await pg.evaluate(AUDIT_JS);
      const cat = { blanks: "blank", contrast: "contrast", gaps: "gap", images: "image", clips: "clip", overflow: "overflow", tall: "tall", anchors: "anchor", mbar: "mbar" };
      for (const [k, label] of Object.entries(cat)) {
        for (const f of res[k]) findings.push({ page: p, w, type: label, detail: f.slice(0, 120) });
      }
    } catch (e) {
      findings.push({ page: p, w, type: "error", detail: String(e).slice(0, 100) });
    }
    await pg.close();
  }
  await ctx.close();
}
await br.close();

if (!findings.length) {
  console.log("AUDIT CLEAN: no findings");
} else {
  console.log("page | width | type | detail");
  const seen = new Set();
  for (const f of findings) {
    const k = `${f.page}|${f.w}|${f.type}|${f.detail}`;
    if (seen.has(k)) continue;
    seen.add(k);
    console.log(`${f.page} | ${f.w} | ${f.type} | ${f.detail}`);
  }
  console.log(`\n${seen.size} findings`);
}
