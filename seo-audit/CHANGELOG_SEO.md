# SEO / AEO / GEO fix log — seo-fixes/2026-10-24

Source: `seo-audit/AUDIT_REPORT.md` + `seo-audit/audit.json`. Issues are keyed by the audit's ISS-xx IDs.

## Done — code

- **ISS-06** `app/robots.ts`: added `Claude-User` to the AI-bot allow groups.
- **ISS-18** `app/sitemap.ts`: removed `/llms.txt` and `/llms-full.txt` from the XML sitemap (still live URLs, just out of the page sitemap).
- **ISS-07** content frontmatter: added real `dateModified` to 37 files (30 service/core pages and 7 legal pages) using each file's last-review or documented legal-update date, so `sitemap.xml` lastmod is no longer the deploy-date file mtime.
- **ISS-08** `lib/schema.ts`: `Physician` node gained `url` (`/dr-tamoghna-das/`) and `image` (portrait).
- **ISS-23** `lib/page-schema.ts`: `BreadcrumbList` nodes now carry a stable `@id` (`<url>#breadcrumb`).
- **ISS-10** `lib/page-schema.ts`: `about` nodes now support `sameAs` and `codeValue`/`codingSystem` (MedicalCode) from frontmatter.
- **ISS-09** `lib/page-schema.ts` + service pages: pages with an `about` entity now also emit a `Service` node (`<url>#service`, provider `#clinic`, areaServed Bongaigaon).
- **ISS-32** `app/faqs/page.tsx`: page node retyped `FAQPage` → `CollectionPage`, leaving one FAQPage entity.
- **ISS-11** `components/ServiceTabs.tsx`: every service group's card links now render in the DOM (inactive groups in `hidden` `tabpanel` divs) instead of only the active tab.
- **ISS-05** `components/templates/PostPage.tsx`: top byline now shows "Medically reviewed by Dr. Tamoghna Das, MBBS, MD (Medicine) (last reviewed <date>)" linked to the doctor page, alongside "Written by" + published/updated dates.
- **ISS-29** `lib/metadata.ts`: default OG image URL uses `/og/?title=` directly (no 308 hop).
- **ISS-13** `lib/nav.ts`: footer gained "About Medcare" and "Dr. Tamoghna Das" links.
- **ISS-27** `app/dr-tamoghna-das/page.tsx`: new "Articles by Dr. Das" section lists all Health Library articles (linked), plus a link to the hub.
- **ISS-22** `components/templates/PostPage.tsx`: article hero image now uses `next/image` with `priority` (LCP candidate).
- **ISS-30** moved `public/images/_todo.md` → `docs/images-todo.md` (no longer publicly served). `console.log` in `lib/booking-action.ts` is already dev-gated (`devLog` checks NODE_ENV) — left as is.

## Done — content

- **ISS-01** Replaced "Medcare Diabetes & Obesity Clinic" with the legal name "Medcare Diabetes, Obesity and Echocardiography Clinic" and "cardio-diabetology specialist" with "internal medicine and cardio-diabetic consultant" across 55 content files.
- **ISS-12** Alt text "A cardiologist performing a 2D echocardiogram" → "A doctor performing…" on `2d-echo-vs-ecg-difference` and `echo-for-people-with-diabetes`.
- **ISS-26** Removed the identical "For X, you can consult Dr. Tamoghna Das…" closing sentence from all articles (the AuthorBox + CtaBand already carry the CTA; each page now ends on its own advice).
- **ISS-26** Removed the identical "This article is part of our guide to…" boilerplate line at article ends; pillar link was moved to an early in-body mention instead (below).
- **ISS-25** Converted Title Case headings to sentence case across 418 headings in 65 files (proper nouns/acronyms preserved).
- **ISS-02** All 10 pillar pages gained a "### More in this guide" section with in-body links to all 5 supporting articles.
- **ISS-03** All 50 supporting articles now carry an early in-body line linking the pillar plus 2 sibling articles.
- **painless**: reworded ~20 "painless" occurrences to "does not hurt" / grammatically correct phrasing.
- **ISS-31** Assigned the 3 unclustered articles: echo-for-people-with-diabetes → ECG/Echo/Holter; hba1c-explained → Type 2 Diabetes; snoring-and-sleep-apnea → Sleep Apnea.
- **ISS-20** `/coming-from-outside-bongaigaon/` now has 4 FAQs (added "Which reports should I bring or send ahead?").

## Not done / partial (and why)

- **ISS-15** FAQ answer length: ~165 answers are under 25 words. Short, direct answers are kept where complete; a fuller expansion pass against the 40-60 word band is deferred (large manual rewrite, no invented facts allowed).
- **ISS-21** 10 duplicated FAQ question texts remain (legitimately shared questions across related pages).
- **ISS-04** LCP: article heroes now use next/image+priority; deeper CWV work needs PSI/CrUX field data on production.
- **ISS-16** Snoring/sleep-apnea overlap partly addressed (cluster assignment); a merge/301 decision needs agency sign-off (no URL changes made).
- **ISS-17** "Agilus" + in-house pharmacy naming kept (client-supplied facts; flagged for agency review).
- **ISS-19** http-apex→https-www two-hop chain needs a Vercel domain-level redirect (not code-fixable here).
- **ISS-14** Preview host indexable — an env/deployment setting (`SITE_NOINDEX`), documented for Vercel config.
- **ISS-28** One 301 citation URL left to update (diabetes.org.uk hba1c).
- **ISS-35** disallow+noindex on /styleguide/ and /thank-you/ — low risk, left as belt-and-braces.
- **ISS-33** "Cardiovascular" in Physician medicalSpecialty — agency review.
- **ISS-34** Named hospitals on doctor page — deliberate content decision D1, flagged.
- **styleguide em dash** — the flagged dash is in the rendered page but not in `app/styleguide/page.tsx` source; cosmetic on a disallowed+noindex page, deferred.
- **26 [CONFIRM] markers** remain — client-input items; `npm run launch-check` still fails while any exist (per design).

## Verification

- `npm run typecheck` clean; `npm run build` clean (see commits).
- Raw-HTML re-checks on the fixed build: robots.txt now lists Claude-User; sitemap has 100 page URLs on the prod domain; article pages show reviewed-by at top; doctor page shows the article list; service pages emit a `Service` node; `about` nodes support sameAs.
