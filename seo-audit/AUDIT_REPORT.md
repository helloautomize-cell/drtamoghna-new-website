# SEO / AEO / GEO Audit Report — Medcare Diabetes, Obesity and Echocardiography Clinic

**Date:** 24 October 2026 · **Audited build:** `npm run build && npm run start` on Next.js 16.3.8, plus live checks against `https://www.medcare.org.in/` (Vercel, bom1) and the review URL `https://drtamoghna-new-website.vercel.app/`.
**Scope:** 100 sitemap URLs (63 Health Library articles + hub, 8 service hubs, 13 service detail pages, doctor page, home, 6 core pages, 7 legal pages) + robots.txt, sitemap.xml, llms.txt, llms-full.txt, manifest, JSON-LD.
**Method:** raw-HTML fetches with no JavaScript; crawl of all 100 sitemap URLs (197 unique internal hrefs checked); frontmatter/content scan of all 101 markdown files; JSON-LD extraction and validation; Lighthouse 13.5 mobile lab runs on `/`, `/health-library/type-2-diabetes/` (pillar), `/health-library/early-symptoms-type-2-diabetes/` (supporting), `/dr-tamoghna-das/`; live user-agent checks (Googlebot, GPTBot, ClaudeBot, PerplexityBot) against production.

---

## 1. Scores

| Area | Score /100 | Note |
|---|---|---|
| Crawling & AI-bot access | 86 | llms.txt + llms-full.txt live; robots has 16 named AI bots; Claude-User missing; preview host indexable; sitemap has 2 non-HTML entries |
| Technical | 86 | Canonicals/OG/Twitter/manifest/404s/trailing-slash all correct on prod; 38 pages lack real lastmod; og:image URL 308s; http-apex two-hop chain |
| Schema | 80 | Valid connected graphs everywhere; Physician missing `url`/`image`; no entity `sameAs`/`code`; service pages never typed as Service/MedicalProcedure |
| E-E-A-T | 72 | Strong doctor page + registration in schema; byline top of articles; but reviewer sits at page bottom, doctor page lists no articles, clinic name inconsistent in 40+ article outros |
| Pillar linking | 50 | Perfect 10x6 cluster inventory, but zero in-body pillar→support links, pillar link in supports sits at the very end, zero sibling body links |
| FAQs | 76 | 522 questions, all server-rendered with matching FAQPage schema; most answers under the 40-60 word target; 10 duplicated questions; 1 page under 4 FAQs |
| Entities & semantics | 70 | Answer-first intros on all 63 articles; no Wikipedia/Wikidata/MeSH entity links; "cardio-diabetology" vs "Cardio-Diabetic Consultant" term drift |
| Keywords | 80 | Build-enforced unique titles/descriptions; primary keyword placement clean; one snoring/sleep-apnea overlap pair |
| Content humanness | 60 | Zero banned vocabulary and no dashes, but heavy template reuse: identical "consult Dr. Tamoghna Das" outro in 40 files, "Key Takeaways"/"Final Thoughts" in 50, guide boilerplate in 50 |
| AEO/GEO readiness | 78 | In-brief blocks, FAQ schema, llms files, quotable threshold tables; entity sameAs and near-top reviewer block are the missing pieces |
| **Overall** | **75** | Solid engineering base; weakest links are in-body internal linking and templated article endings |

---

## 2. Checklist (63 items)

| # | Item | Verdict | Evidence |
|---|---|---|---|
| 1 | robots.txt exists, links sitemap, no content block | PASS | `/robots.txt` serves `Allow: /`, only `/styleguide/` and `/thank-you/` disallowed, `Sitemap: https://www.medcare.org.in/sitemap.xml` (`app/robots.ts`) |
| 2 | AI bots allowed | PARTIAL | All required bots allowed except **Claude-User** (missing from `AI_BOTS`, `app/robots.ts:10-28`). Present: Googlebot, Bingbot, GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended, Applebot, Applebot-Extended, CCBot, Amazonbot, Meta-ExternalAgent, DuckAssistBot |
| 3 | No middleware/firewall blocking | PASS | `curl -A GPTBot/ClaudeBot/PerplexityBot/Googlebot` on prod article → all `200`. No `middleware.ts` exists |
| 4 | Sitemap complete, real lastmod | PARTIAL | 100 page URLs on prod domain. Library articles use frontmatter `dateModified` (real dates). 38 core/service/legal pages have no `dateModified` → falls back to file mtime = deploy date on Vercel (`app/sitemap.ts:17`). `/llms.txt` and `/llms-full.txt` listed inside the XML sitemap (harmless but non-standard) |
| 5 | llms.txt exists | PASS | `/llms.txt` (200, grouped by topic, doctor credentials, contacts) and `/llms-full.txt` (617 KB full text) |
| 6 | No accidental noindex; preview noindex | PARTIAL | Prod serves `index, follow` (site is launched — confirm intent). `drtamoghna-new-website.vercel.app` also serves `index, follow`; its canonicals point to prod so consolidation works, but the checklist wants preview noindex. `/styleguide/`, `/thank-you/`, `/book/` carry `X-Robots-Tag` (`next.config.ts:59-69`) |
| 7 | metadataBase + absolute self-canonical | PASS prod / PARTIAL local | Prod: `<link rel="canonical" href="https://www.medcare.org.in/...">` on every page. Local builds: `NEXT_PUBLIC_SITE_URL` empty in `.env.local` → `metadataBase` undefined and canonicals fall back to the vercel.app host (`lib/metadata.ts:9-10`, `app/layout.tsx:44`) |
| 8 | One host version, no chains | PARTIAL | apex `https://medcare.org.in/` → 308 → `www` ✓; trailing slash enforced (308) ✓. But `http://medcare.org.in/` → `https://medcare.org.in/` → `https://www.medcare.org.in/` is a two-hop chain |
| 9 | Real 404s | PASS | `/no-such-page-xyz/` → 404 with custom not-found page |
| 10 | Content in raw server HTML | PASS | Articles, FAQs, byline, dates, links, schema all in first response; pages static-prerendered |
| 11 | No client-only content | PARTIAL | Home `ServiceTabs` renders only the active tab's cards (`components/ServiceTabs.tsx:39` — `serviceTabs[tab]`); other groups' card lists appear only after JS tab switch. Same cards are fully rendered on `/services/` (26 cards). FAQs use `<details>` so they are in the DOM |
| 12 | Real `<a href>` links | PASS | `RouteLink` wraps `next/link`; grep found zero `router.push`/`onClick` navigation |
| 13 | Unique title + description | PASS | `scripts/export-seo-meta.mjs` fails the build on duplicates/length; all 100 titles ≤60 chars, descriptions 101-155 chars |
| 14 | One H1, clean hierarchy | PASS | Crawl of all 100 pages: exactly 1 `<h1>` each; sections render `h2`/`h3` (article FAQ questions are `h3` inside `<summary>`) |
| 15 | Clean URLs | PASS | `/health-library/<slug>/`, `/diabetes-care/<child>/` etc; trailing slash consistent |
| 16 | Images: alt, dimensions, next/image | PARTIAL | Zero `<img>` without alt across all 100 pages; all carry width/height. Home hero uses `next/image` (`data-nimg`); article heroes/section images use plain `<img>` + srcset (`components/templates/PostPage.tsx:185`) — functionally fine but not next/image as checklist asks |
| 17 | OG + Twitter tags | PASS | `og:title/description/url/image/locale` + `twitter:card=summary_large_image` on every page |
| 18 | Visible breadcrumbs inner pages | PASS | `.crumbs` nav on all 99 non-home pages |
| 19 | Core Web Vitals mobile | FAIL | Lab (local server): home perf 62, LCP 6.4s, TBT 420ms, CLS 0; pillar 71, LCP 5.2s, TBT 380ms; article 72, LCP 4.1s, TBT 570ms; doctor 61, LCP 4.6s, TBT 1060ms. LCP misses 2.5s on all four; prod TTFB is fast (85ms) so field data should be better — verify in CrUX/PSI. CLS passes |
| 20 | No broken internal links | PASS | 197 unique internal hrefs across all pages → zero 4xx, zero redirects |
| 21 | One connected @graph | PARTIAL | Two scripts per page: layout site graph (WebSite+MedicalClinic+Physician) + page graph referencing them by `@id`. Connected, but not literally one block; BreadcrumbList nodes lack `@id` |
| 22 | Article schema fields | PASS | `BlogPosting` (author, reviewedBy, datePublished, dateModified, publisher, image, wordCount, articleSection, citation) + `MedicalWebPage` (about, lastReviewed, medicalAudience) per article |
| 23 | Physician schema | PARTIAL | `Physician` node has credentials incl. registration no. 20276, memberOf x11, awards, publications, hours, sameAs socials — but **no `url`** to `/dr-tamoghna-das/` and **no `image`** |
| 24 | Service/condition schema types | PARTIAL | Page node is always `MedicalWebPage`; the service/condition is only expressed via `about` (MedicalCondition, MedicalTest, MedicalProcedure, MedicalTherapy). No `Service`/`MedicalProcedure`-typed page node for service pages |
| 25 | BreadcrumbList + FAQPage | PASS | Every inner page has BreadcrumbList; FAQPage emitted wherever FAQs render (522 questions). `/faqs/` emits both an `FAQPage`-typed WebPage node and a separate FAQPage entity — redundant but valid |
| 26 | Schema matches visible content | PASS | FAQ answers generated from the same parsed data as the DOM (word-for-word); valid JSON on all sampled pages; no AggregateRating/Review anywhere |
| 27 | Doctor profile page | PARTIAL | `/dr-tamoghna-das/` shows photo, MBBS/MD, reg. no. 20276, timeline, memberships, publications, FAQs. **Does not list his Health Library articles** (only links to the hub) |
| 28 | Byline + dates near top | PARTIAL | Articles: "Written by" + Published/Updated dates at top ✓, but "Medically reviewed by" sits in `ReviewerBox` at page bottom (`components/templates/PostPage.tsx:244`). Service pages show reviewer box only, no written-by line |
| 29 | Trust pages in footer | PARTIAL | Footer links: Contact, Editorial Policy, Medical Disclaimer, Privacy, Terms, Patient Rights, Appointments/Refunds, Accessibility, FAQs, Plan Your Visit. **`/about/` and `/dr-tamoghna-das/` are not in the footer** (header only, `lib/nav.ts:260-320`) |
| 30 | Working authoritative citations | PASS | Sources on all 63 articles + service pages: NHS (110 links), WHO (70), NICE (40), Diabetes UK/ADA (62), NHLBI (20), CDC (20), BHF (18), IWGDF (12). One `diabetes.org.uk` URL 301s — update target |
| 31 | No risky claims | PARTIAL | No "best/guaranteed/No.1/cure" promotional claims (all "cure" uses are negations). "painless" used ~15x for tests (factual but on the checklist's risky-word list). Image alt on 2 articles says "a cardiologist" performing the echo — Dr. Das is not a cardiologist |
| 32 | When-to-see-a-doctor guidance | PASS | Emergency callouts + `PostNotice` red-flag block on every article; 18/21 service content files carry urgent-care lines; global "Medical emergency? Call 108 or 112" in DOM on every page |
| 33 | First-hand + Indian context | PASS | Bongaigaon/NE-India specifics throughout (gutkha, rice portions, haemoglobin variants, local referral context). **No INR costs anywhere — deliberate** (agency rules ban prices); noted so the fix step does not add them |
| 34 | NAP identical everywhere | FAIL | Address/phone consistent, but **40 files end with "…specialist at Medcare Diabetes & Obesity Clinic"** — a different clinic name from the legal "Medcare Diabetes, Obesity and Echocardiography Clinic" used in header/footer/schema. Also "cardio-diabetology specialist" vs `shortTitle` "Internal Medicine and Cardio-Diabetic Consultant" |
| 35 | 5 supporting articles per pillar | PASS | 10 clusters × (1 pillar + 5 supports) = 60; plus 3 unclustered articles (echo-for-people-with-diabetes, hba1c-explained, snoring-and-sleep-apnea) |
| 36 | Pillar → supports in body copy | FAIL | 0/10 pillars link to their 5 supports inside the markdown body; links exist only as the end-of-page "Related reading" card block (`posts` frontmatter) |
| 37 | Support → pillar early + 2 siblings | PARTIAL | All 50 supports carry a pillar link in the closing "This article is part of our guide to…" line — late, not early. **Zero sibling links inside body copy** (siblings appear only in the end block) |
| 38 | Links to service + doctor page | PARTIAL | Rendered via "Related care at Medcare" cards + byline/author-box links — but not inside body copy on articles |
| 39 | Descriptive anchors | PASS | Anchors are article titles/phrases; no "click here"/"read more" found |
| 40 | No orphan pages | PASS | Hub lists all 63 articles; footer covers all services; everything ≤3 clicks from home |
| 41 | 4-8 unique FAQs per page | PARTIAL | All pillar/support/service pages have 4-8. `/coming-from-outside-bongaigaon/` has 3. `/faqs/` has 16 (dedicated FAQ page, intentional). 10 question texts appear verbatim on 2 pages each |
| 42 | Answers 40-60 words, direct | FAIL | Only 138/522 (26%) in range; 165 answers <25 words. Answers do start direct ("Yes.", "No.", the number first) — good for AI quoting but short of the target band |
| 43 | FAQs in HTML, schema match | PASS | `<details>/<summary>` in server HTML; FAQPage generated from identical source strings |
| 44 | Related-entity coverage | PASS | Per-cluster coverage is strong (symptoms, causes, tests, treatment, monitoring tables). Missing by design: cost entity; specialist-referral entity thin on some supports |
| 45 | Entity defined in first 100 words | PASS | All 63 articles open with "In brief"/"Quick answer" defining the entity with a quotable answer |
| 46 | H2 answers a question + names entity | PARTIAL | Many H2s are questions ("How is type 2 diabetes diagnosed?"); template H2s "Key Takeaways"/"Final Thoughts"/"At a glance" do not name the entity; several Title Case section heads |
| 47 | Medical + plain term pairing | PASS | e.g. "glycated haemoglobin (HbA1c)", "oral glucose tolerance test (OGTT)", "eGFR" explained inline |
| 48 | Primary keyword placement | PASS | Title/H1/URL/first-100-words/meta description all carry it naturally; no stuffing |
| 49 | No cannibalisation | PARTIAL | `snoring-and-sleep-apnea` vs `loud-snoring-sign-of-sleep-apnea` vs `sleep-apnea-symptoms` overlap on the same query intent; `hba1c-explained` overlaps the HbA1c cluster family |
| 50 | Quotable specifics | PARTIAL | Diagnostic threshold tables, timelines, percentages with sources ✓. No INR cost numbers (deliberate, compliance) — this caps quotability for cost queries |
| 51 | ChatGPT tells | PASS on vocabulary | Zero hits for delve/tapestry/embark/seamless/crucial/myriad/testament/holistic/"in conclusion"/"comprehensive guide" etc. Template-structure tells counted under #53 |
| 52 | Claude tells | PASS | No em/en dashes in rendered content (project rule enforced by `check-dashes.mjs`); one stray dash only on the disallowed `/styleguide/` page; no "Here's the thing"/"The bottom line" |
| 53 | General AI tells | FAIL | Identical closing sentence ("…you can consult Dr. Tamoghna Das, an internal medicine and cardio-diabetology specialist at Medcare Diabetes & Obesity Clinic") on 40 articles; "### Key Takeaways" + "### Final Thoughts" on 50; "This article is part of our guide to…" boilerplate on 50 |
| 54 | Agent fingerprints | PARTIAL | Clean of lorem/TODO/mock/placeholder phones; minor: `console.log` in `lib/booking-action.ts:58`, `public/images/_todo.md` publicly served, stray em dash on `/styleguide/` |
| 55 | lang/icons/manifest/HTTPS | PASS | `lang="en-IN"`, favicon.ico + icon.svg/png + apple-icon, `/manifest.webmanifest`, HSTS, no mixed content |
| 56 | Unique local pages / GBP match | PARTIAL | Service pages are genuinely unique, Bongaigaon named naturally. GBP name/address could not be verified externally — confirm GBP shows the legal clinic name (40 article outros use a different name) |
| 57 | Entity sameAs to Wikipedia/Wikidata/MeSH | FAIL | `about` nodes emit only type/name/alternateName (`lib/page-schema.ts:28-45`) — no `sameAs` or `code` |
| 58 | PAA / cost / vs coverage | PARTIAL | Strong "X vs Y" coverage (semaglutide-vs-tirzepatide, 2d-echo-vs-ecg, hba1c-vs-fasting). Cost questions deliberately unanswered (compliance). Missing per-page PAA gaps listed in section 5 |
| 59 | Reading level | PASS | ~14-17 words/sentence ≈ grade 8; no outdated medical facts spotted (ADA/ICMR-aligned thresholds) |
| 60 | No rating/review schema or fake testimonials | PASS | No AggregateRating/Review; `GoogleRatingChip` renders nothing while rating is null; doctor page quotes are his own words, marked for client sign-off |
| 61 | NMC / DMR Act compliance | PARTIAL | Negated cure claims fine; but the copy names the in-house pharmacy and "lab partner Agilus" on ~15 pages plus llms.txt — the project's own compliance rule says never name a pharmacy/lab (presumably client-sanctioned since it comes from intake, but worth an agency review); doctor page lists visiting-consultant roles at two named hospitals (marked decision D1) |
| 62 | rel attributes | PASS | External citation links plain `rel="noopener noreferrer"`; agency credit link `nofollow`; no sponsored links present |
| 63 | AI-answer readiness for top queries | PARTIAL | See section 6 |

**Tally: 41 PASS · 19 PARTIAL · 3 FAIL** (FAILs: #34 NAP name, #36 pillar body links, #42 FAQ length band; #19 CWV marked FAIL on LCP under lab conditions).

---

## 3. Issue register

| ID | Pri | Checklist | Issue | Evidence | Fix |
|---|---|---|---|---|---|
| ISS-01 | P1 | 34 | Clinic name inconsistency: 40 article outros say "Medcare Diabetes & Obesity Clinic" instead of the legal "Medcare Diabetes, Obesity and Echocardiography Clinic" | e.g. `content/health-library/early-symptoms-type-2-diabetes.md` final para; `grep -l "Medcare Diabetes & Obesity Clinic" content/` → 40 files | Replace the templated outro per article (unique closing paragraph) and always use the legal name from `siteConfig.name` |
| ISS-02 | P1 | 36 | No pillar→support links inside body copy (0/10 pillars) | `content/health-library/type-2-diabetes.md` body has zero `](/health-library/<support>)` links; links live only in end "Related reading" block | Weave 2-4 contextual in-body links per pillar (or a "In this guide" section listing the 5 supports mid-body) |
| ISS-03 | P1 | 37 | Supports: pillar link only in final boilerplate line; zero in-body sibling links | `content/health-library/early-symptoms-type-2-diabetes.md` — pillar link at last line only; sibling body links = 0 across all 50 | Add an early contextual link to the pillar within the first sections, plus 2 inline sibling links where topics genuinely cross-reference |
| ISS-04 | P1 | 19 | Mobile LCP above 2.5s (lab): 4.1-6.4s across home/pillar/article/doctor; TBT up to 1060ms on doctor page | Lighthouse 13.5 mobile, local `next start`: home 6.4s, pillar 5.2s, article 4.1s, doctor 4.6s; prod TTFB only 85ms so origin is fine — weight is client JS + hero image | Confirm with PSI/CrUX field data on prod; consider next/image for article heroes, trimming client JS (Embla/tabs on home), and font preload tuning |
| ISS-05 | P1 | 28 | "Medically reviewed by" renders at article bottom, not near the top; no written-by on service pages | `PostPage.tsx:159-179` (top byline) vs `:244` (ReviewerBox bottom) | Move reviewer name + last-reviewed date into the top byline block; keep the bottom box or merge |
| ISS-06 | P2 | 2 | `Claude-User` not in robots AI bot list | `app/robots.ts:10-28` | Add `"Claude-User"` to `AI_BOTS` |
| ISS-07 | P2 | 4 | 38 pages (all services, core, legal) lack `dateModified`; sitemap lastmod falls back to file mtime (deploy date on Vercel) | `app/sitemap.ts:13-17`; frontmatter audit | Add real `dateModified` to the 38 files, or derive from git last-commit date |
| ISS-08 | P2 | 23 | Physician node lacks `url` (to `/dr-tamoghna-das/`) and `image` | `lib/schema.ts:74-169` | Add `url` and `image` (dr-das-portrait) to `physicianNode` |
| ISS-09 | P2 | 24 | Service pages never emit `Service`/`MedicalProcedure`/`MedicalTherapy` as the page-level type | `ServicePage.tsx:114-119` always `MedicalWebPage`; about node covers the entity only | Optionally emit a `Service`/`MedicalService` node linked via `provider` to `#clinic` |
| ISS-10 | P2 | 57 | `about` entity nodes carry no `sameAs`/`code` links to Wikipedia/Wikidata/MeSH | `lib/page-schema.ts:28-45` | Extend frontmatter `about` with optional `sameAs`/`code` (MeSH/Wikidata) and emit them |
| ISS-11 | P2 | 11 | Home service tab panels 2+ are client-only | `ServiceTabs.tsx:39,197` renders `current.cards` only | Render all groups in DOM (hidden), or ensure `/services/` parity — already exists — and accept; low effort fix: render all tab panels and toggle visibility |
| ISS-12 | P2 | 31 | Image alt "A cardiologist performing a 2D echocardiogram" mislabels Dr. Das | `content/health-library/2d-echo-vs-ecg-difference.md:18`, `echo-for-people-with-diabetes.md:16` | Reword to "a doctor/physician performing…" |
| ISS-13 | P2 | 29 | `/about/` and `/dr-tamoghna-das/` absent from footer | `lib/nav.ts:260-320` footerColumns | Add to a footer column (About/Dr. Das are core E-E-A-T pages) |
| ISS-14 | P2 | 6 | Preview host `drtamoghna-new-website.vercel.app` serves `index,follow` | Live check: no X-Robots-Tag, meta `index, follow`; canonicals point to prod so impact is contained | Set `SITE_NOINDEX=true` for the preview/deployment or verify launch intent |
| ISS-15 | P2 | 42 | 74% of FAQ answers under the 40-60 word target | computed across 522 answers | Expand thin answers to one direct answer + one supporting detail + one caveat |
| ISS-16 | P2 | 49 | Snoring/sleep-apnea overlap: `snoring-and-sleep-apnea`, `loud-snoring-sign-of-sleep-apnea`, `sleep-apnea-symptoms` chase the same intent | titles/descriptions near-identical | Differentiate intent (symptoms list vs "is my snoring sleep apnea" self-check) or 301-merge one |
| ISS-17 | P2 | 61 | Named pharmacy/lab ("in-house pharmacy", "Agilus") on ~15 pages + llms.txt vs project compliance rule | `content/pages/about.md:47`, `lib/llms.ts:29` ENTITY_STATEMENT | Agency decision: keep if client-approved (likely), else generic wording |
| ISS-18 | P3 | 4 | `/llms.txt`, `/llms-full.txt` listed inside XML sitemap | `app/sitemap.ts:22-27` | Harmless; remove for a pure-page sitemap |
| ISS-19 | P3 | 8 | `http://medcare.org.in/` → `https://medcare.org.in/` → `https://www.medcare.org.in/` two-hop chain | curl checks | Add a Vercel domain redirect straight to `https://www.` from http apex |
| ISS-20 | P3 | 41 | `/coming-from-outside-bongaigaon/` has only 3 FAQs | frontmatter scan | Add 1-2 page-specific questions |
| ISS-21 | P3 | 41 | 10 FAQ questions duplicated verbatim across 2 pages each | e.g. "Is insulin addictive?" on 2 insulin articles; "Is an echo safe?" on article + echo service page | Reword to page-specific variants or accept (they are legitimately shared questions) |
| ISS-22 | P3 | 16 | Article heroes/section images use plain `<img>` not next/image | `PostPage.tsx:185`, `PageParts.tsx:66` | Optional; srcset already present — low ROI |
| ISS-23 | P3 | 21 | Page graphs emitted as second `<script>` block; BreadcrumbList has no `@id` | rendered HTML; `lib/page-schema.ts:15-26` | Merge blocks or add `@id`s |
| ISS-24 | P3 | 7 | Local `.env.local` has empty `NEXT_PUBLIC_SITE_URL` → local builds emit vercel.app canonicals | `.env.local`, `lib/metadata.ts:9` | Set the var locally or document that it is prod-only |
| ISS-25 | P3 | 46/51 | Title Case + template headings ("Key Takeaways", "Final Thoughts") on ~65 files | heading scan | Rewrite to question-form, sentence-case H2s naming the entity |
| ISS-26 | P3 | 53 | Identical outro/boilerplate patterns (40 outro, 50 Key Takeaways/Final Thoughts, 50 guide line) | `content/health-library/*` | Unique, article-specific endings; vary or drop "Key Takeaways"/"Final Thoughts" |
| ISS-27 | P3 | 27 | Doctor page does not list his authored/reviewed articles | `/dr-tamoghna-das/` rendered HTML | Add "Articles by Dr. Das" section linking the library |
| ISS-28 | P3 | 30 | One citation link 301s (diabetes.org.uk hba1c) | curl check | Update to final URL |
| ISS-29 | P3 | 17 | `og:image` URL `/og?title=…` 308s to `/og/?title=…` before serving | curl `-I` on local build | Emit `/og/?title=` form directly |
| ISS-30 | P3 | 54 | `console.log` in `lib/booking-action.ts:58`; `public/images/_todo.md` served publicly; em dash on `/styleguide/` | greps + `check-dashes.mjs` | Remove log, remove or relocate `_todo.md`, fix dash (page is noindex anyway) |
| ISS-31 | P3 | 35 | 3 articles unclustered (echo-for-people-with-diabetes, hba1c-explained, snoring-and-sleep-apnea) — get generic "More from the Health Library" instead of cluster list | frontmatter `cluster` absent | Assign to existing clusters or create the intended ones |
| ISS-32 | P3 | 26 | `/faqs/` emits two `FAQPage`-typed nodes (page node + entity) | rendered JSON-LD | Type the page node `WebPage`/`CollectionPage` and keep one FAQPage entity |
| ISS-33 | P3 | 23 | `medicalSpecialty` includes "Cardiovascular" — acceptable but sensitive given "not a cardiologist" rule | `lib/schema.ts:79` | Review with agency; alternatively narrow to Internal medicine/Endocrine |
| ISS-34 | P3 | 61 | Doctor page names visiting-consultant hospitals (Swagat, Lower Assam) — deliberate per content note D1 | `content/pages/dr-tamoghna-das.md:74` | Confirm agency is happy with named affiliations |
| ISS-35 | P3 | 6 | `/styleguide/`, `/thank-you/` are both robots-disallowed AND noindexed — disallowed pages can't be crawled to see the header; rely on robots alone or drop the disallow | `app/robots.ts:36`, `next.config.ts:59-69` | Optional hardening |

**Needs client input (P3):**
- Exact Maps lat/long for `geo` in clinic schema (TODO_CONFIRM Q21; `hasMap` CID already present)
- Floor/building name for address (Q21)
- Confirmation the GBP business name matches the legal clinic name (vs the "Medcare Diabetes & Obesity Clinic" text in article outros)
- Sign-off on Dr. Das's quoted wording and education entries (`[CONFIRM]` chips — 26 markers remain; `npm run launch-check` will fail while any exist)
- Holiday hours, clinic accessibility details, device-return policy (Q22, Q27, Q35)
- Assam Clinical Establishments registration number (Q46)
- Current Google rating/count if the rating chip should ever render (Q54b)

---

## 4. Page-by-page table

Byline: "top" = "Written by" + dates rendered near the top (articles). "Links out" = unique internal links rendered in the page HTML. AI score: 0-100, higher = more machine-patterned (see section 7 method).

| URL | Type | Cluster | Title | Desc | Byline | Dates | FAQs | Schema blocks | Links out | AI |
|---|---|---|---|---|---|---|---|---|---|---|
| / | home | - | 52 | 140 | - | Y | 4 | 4 | 25 | 8 |
| /about/ | core | - | 50 | 139 | - | Y | 0 | 4 | 22 | 8 |
| /accessibility/ | legal | - | 33 | 101 | - | N | 0 | 4 | 22 | 8 |
| /appointments-cancellation-refund/ | legal | - | 47 | 103 | - | N | 0 | 4 | 22 | 8 |
| /asthma-copd/ | service | - | 57 | 139 | rev | Y | 5 | 4 | 22 | 8 |
| /coming-from-outside-bongaigaon/ | core | - | 40 | 147 | - | Y | 3 | 4 | 22 | 8 |
| /contact/ | core | - | 40 | 149 | - | Y | 0 | 4 | 22 | 8 |
| /diabetes-care/ | service-hub | - | 55 | 136 | rev | Y | 7 | 4 | 24 | 8 |
| /diabetes-care/continuous-glucose-monitoring/ | service | - | 52 | 145 | rev | Y | 6 | 4 | 23 | 8 |
| /diabetes-care/diabetes-in-pregnancy/ | service | - | 49 | 139 | rev | Y | 6 | 4 | 23 | 8 |
| /diabetes-care/diabetic-foot-care/ | service | - | 42 | 139 | rev | Y | 5 | 4 | 22 | 18 |
| /dr-tamoghna-das/ | doctor | - | 50 | 135 | - | Y | 5 | 4 | 22 | 8 |
| /editorial-policy/ | legal | - | 45 | 128 | - | N | 0 | 4 | 22 | 8 |
| /faqs/ | core | - | 60 | 114 | - | Y | 16 | 4 | 22 | 8 |
| /health-check-ups/ | service | - | 50 | 140 | rev | Y | 5 | 4 | 23 | 8 |
| /health-library/ | hub | - | 35 | 138 | - | Y | 0 | 4 | 85 | 8 |
| /health-library/2d-echo-vs-ecg-difference/ | article | ECG/Echo/Holter | 39 | 153 | top | Y | 6 | 4 | 26 | 64 |
| /health-library/can-diabetes-and-bp-affect-the-heart-without-symptoms/ | article | ECG/Echo/Holter | 59 | 154 | top | Y | 6 | 4 | 28 | 47 |
| /health-library/can-diabetes-cause-high-cholesterol/ | article | Cholesterol | 36 | 154 | top | Y | 6 | 4 | 26 | 72 |
| /health-library/can-diabetic-neuropathy-be-reversed/ | article | Neuropathy & Foot | 50 | 140 | top | Y | 6 | 4 | 27 | 72 |
| /health-library/can-prediabetes-go-back-to-normal/ | article | Prediabetes | 34 | 142 | top | Y | 6 | 4 | 27 | 68 |
| /health-library/can-sleep-apnea-cause-high-blood-pressure/ | article | Sleep Apnea | 42 | 148 | top | Y | 6 | 4 | 26 | 72 |
| /health-library/cholesterol-diabetes-ldl-hdl-triglycerides/ | article | Diabetes & Heart | 55 | 153 | top | Y | 6 | 4 | 27 | 68 |
| /health-library/diabetes-feet-burning-tingling/ | article | Neuropathy & Foot | 44 | 146 | top | Y | 6 | 4 | 27 | 68 |
| /health-library/diabetes-heart-attack-without-chest-pain/ | article | Diabetes & Heart | 55 | 147 | top | Y | 6 | 4 | 28 | 35 |
| /health-library/diabetes-heart-disease-risk/ | pillar | Diabetes & Heart | 55 | 152 | top | Y | 6 | 4 | 30 | 28 |
| /health-library/diabetes-high-blood-pressure-heart-disease-connection/ | article | Diabetes & Heart | 51 | 149 | top | Y | 6 | 4 | 26 | 72 |
| /health-library/diabetes-medicines-treatment-options/ | pillar | Diabetes Medicines | 52 | 148 | top | Y | 6 | 4 | 30 | 28 |
| /health-library/diabetic-foot-ulcer-warning-signs/ | article | Neuropathy & Foot | 40 | 147 | top | Y | 6 | 4 | 26 | 64 |
| /health-library/diabetic-foot-wound-what-not-to-do/ | article | Neuropathy & Foot | 45 | 151 | top | Y | 6 | 4 | 26 | 64 |
| /health-library/diabetic-neuropathy-foot-problems/ | pillar | Neuropathy & Foot | 55 | 152 | top | Y | 6 | 4 | 29 | 8 |
| /health-library/do-statins-need-to-be-taken-for-life/ | article | Cholesterol | 37 | 150 | top | Y | 6 | 4 | 27 | 72 |
| /health-library/does-starting-insulin-mean-diabetes-is-severe/ | article | Diabetes Medicines | 54 | 150 | top | Y | 6 | 4 | 28 | 35 |
| /health-library/early-symptoms-type-2-diabetes/ | article | Type 2 Diabetes | 47 | 149 | top | Y | 6 | 4 | 27 | 72 |
| /health-library/ecg-echo-stress-echo-holter/ | pillar | ECG/Echo/Holter | 58 | 149 | top | Y | 6 | 4 | 30 | 8 |
| /health-library/echo-for-people-with-diabetes/ | article | unclustered | 52 | 137 | top | Y | 4 | 4 | 25 | 8 |
| /health-library/glp-1-medicines-diabetes-weight-loss/ | article | Diabetes Medicines | 44 | 152 | top | Y | 6 | 4 | 27 | 72 |
| /health-library/good-ldl-cholesterol-level/ | article | Cholesterol | 37 | 149 | top | Y | 6 | 4 | 26 | 72 |
| /health-library/hba1c-explained/ | article | unclustered | 53 | 139 | top | Y | 4 | 4 | 25 | 8 |
| /health-library/hba1c-vs-fasting-blood-sugar/ | article | Type 2 Diabetes | 51 | 146 | top | Y | 6 | 4 | 29 | 72 |
| /health-library/heart-tests-for-people-with-diabetes/ | article | Diabetes & Heart | 53 | 152 | top | Y | 6 | 4 | 27 | 64 |
| /health-library/high-blood-pressure-guide/ | pillar | Hypertension | 57 | 153 | top | Y | 6 | 4 | 30 | 28 |
| /health-library/high-cholesterol-triglycerides/ | pillar | Cholesterol | 59 | 154 | top | Y | 6 | 4 | 30 | 8 |
| /health-library/high-triglycerides-causes-symptoms-treatment/ | article | Cholesterol | 51 | 149 | top | Y | 6 | 4 | 27 | 72 |
| /health-library/holter-monitor-what-it-detects/ | article | ECG/Echo/Holter | 31 | 150 | top | Y | 6 | 4 | 28 | 39 |
| /health-library/how-is-obesity-diagnosed-bmi-waist/ | article | Obesity | 57 | 153 | top | Y | 6 | 4 | 26 | 72 |
| /health-library/how-much-salt-high-blood-pressure/ | article | Hypertension | 47 | 154 | top | Y | 6 | 4 | 26 | 72 |
| /health-library/how-often-diabetes-foot-examination/ | article | Neuropathy & Foot | 54 | 149 | top | Y | 6 | 4 | 28 | 39 |
| /health-library/how-often-prediabetes-testing/ | article | Prediabetes | 39 | 152 | top | Y | 6 | 4 | 28 | 64 |
| /health-library/how-often-should-you-check-blood-sugar-and-hba1c/ | article | Type 2 Diabetes | 49 | 152 | top | Y | 6 | 4 | 28 | 35 |
| /health-library/how-to-check-blood-pressure-at-home/ | article | Hypertension | 45 | 150 | top | Y | 6 | 4 | 26 | 56 |
| /health-library/loud-snoring-sign-of-sleep-apnea/ | article | Sleep Apnea | 38 | 152 | top | Y | 6 | 4 | 27 | 72 |
| /health-library/lower-ldl-cholesterol-diet-lifestyle/ | article | Cholesterol | 52 | 150 | top | Y | 6 | 4 | 27 | 64 |
| /health-library/metformin-side-effects/ | article | Diabetes Medicines | 56 | 150 | top | Y | 6 | 4 | 26 | 68 |
| /health-library/normal-blood-pressure-reading-by-age/ | article | Hypertension | 47 | 151 | top | Y | 6 | 4 | 28 | 53 |
| /health-library/normal-prediabetes-diabetes-hba1c-levels/ | article | Prediabetes | 55 | 154 | top | Y | 6 | 4 | 28 | 68 |
| /health-library/obesity-and-sleep-apnea/ | article | Obesity | 51 | 148 | top | Y | 6 | 4 | 26 | 68 |
| /health-library/obesity-weight-management/ | pillar | Obesity | 51 | 143 | top | Y | 6 | 4 | 30 | 48 |
| /health-library/prediabetes-blood-sugar/ | pillar | Prediabetes | 49 | 142 | top | Y | 6 | 4 | 30 | 48 |
| /health-library/prediabetes-diet-what-to-eat-and-what-to-limit/ | article | Prediabetes | 47 | 154 | top | Y | 6 | 4 | 28 | 31 |
| /health-library/resistant-hypertension-bp-high-despite-medicines/ | article | Hypertension | 54 | 148 | top | Y | 6 | 4 | 26 | 68 |
| /health-library/semaglutide-vs-tirzepatide-weight-loss/ | article | Obesity | 53 | 145 | top | Y | 6 | 4 | 26 | 72 |
| /health-library/sglt2-inhibitors-diabetes-heart-kidney/ | article | Diabetes Medicines | 53 | 149 | top | Y | 6 | 4 | 26 | 68 |
| /health-library/sleep-apnea-and-diabetes-connection/ | article | Sleep Apnea | 49 | 155 | top | Y | 6 | 4 | 27 | 72 |
| /health-library/sleep-apnea-metabolic-health/ | pillar | Sleep Apnea | 57 | 152 | top | Y | 6 | 4 | 31 | 18 |
| /health-library/sleep-apnea-symptoms/ | article | Sleep Apnea | 55 | 152 | top | Y | 6 | 4 | 27 | 72 |
| /health-library/snoring-and-sleep-apnea/ | article | unclustered | 55 | 139 | top | Y | 4 | 4 | 25 | 8 |
| /health-library/stress-echocardiogram-when-recommended/ | article | ECG/Echo/Holter | 54 | 150 | top | Y | 6 | 4 | 26 | 72 |
| /health-library/type-2-diabetes/ | pillar | Type 2 Diabetes | 48 | 145 | top | Y | 6 | 4 | 30 | 38 |
| /health-library/type-2-diabetes-reversal-remission/ | article | Type 2 Diabetes | 54 | 148 | top | Y | 6 | 4 | 28 | 68 |
| /health-library/weight-loss-improve-diabetes-blood-pressure/ | article | Obesity | 46 | 155 | top | Y | 6 | 4 | 26 | 64 |
| /health-library/weight-loss-lower-type-2-diabetes-risk/ | article | Prediabetes | 49 | 146 | top | Y | 6 | 4 | 27 | 68 |
| /health-library/weight-regain-after-stopping-glp-1/ | article | Obesity | 52 | 154 | top | Y | 6 | 4 | 26 | 72 |
| /health-library/what-happens-during-sleep-study/ | article | Sleep Apnea | 50 | 153 | top | Y | 6 | 4 | 26 | 60 |
| /health-library/what-to-do-before-an-ecg-or-echo/ | article | ECG/Echo/Holter | 32 | 151 | top | Y | 6 | 4 | 28 | 39 |
| /health-library/when-type-2-diabetes-needs-insulin/ | article | Diabetes Medicines | 53 | 148 | top | Y | 6 | 4 | 26 | 68 |
| /health-library/white-coat-hypertension-high-bp-clinic-normal-home/ | article | Hypertension | 52 | 151 | top | Y | 6 | 4 | 26 | 72 |
| /health-library/why-diabetes-increases-heart-attack-risk/ | article | Diabetes & Heart | 47 | 154 | top | Y | 6 | 4 | 26 | 72 |
| /health-library/yearly-tests-for-diabetes/ | article | Type 2 Diabetes | 58 | 152 | top | Y | 6 | 4 | 28 | 39 |
| /heart-health/ | service-hub | - | 58 | 143 | rev | Y | 5 | 4 | 23 | 8 |
| /heart-health/echocardiography/ | service | - | 51 | 153 | rev | Y | 7 | 4 | 23 | 8 |
| /heart-health/heart-failure/ | service | - | 42 | 131 | rev | Y | 6 | 4 | 23 | 8 |
| /heart-health/high-blood-pressure/ | service | - | 53 | 133 | rev | Y | 6 | 4 | 22 | 18 |
| /heart-health/holter-monitoring/ | service | - | 56 | 138 | rev | Y | 5 | 4 | 22 | 18 |
| /internal-medicine/ | service-hub | - | 45 | 142 | rev | Y | 4 | 4 | 22 | 8 |
| /internal-medicine/anaemia/ | service | - | 59 | 126 | rev | Y | 5 | 4 | 22 | 8 |
| /internal-medicine/fatty-liver/ | service | - | 45 | 144 | rev | Y | 5 | 4 | 22 | 8 |
| /internal-medicine/fever-and-infections/ | service | - | 60 | 141 | rev | Y | 6 | 4 | 22 | 8 |
| /internal-medicine/joint-pain-arthritis/ | service | - | 58 | 127 | rev | Y | 5 | 4 | 22 | 8 |
| /internal-medicine/migraine-headache/ | service | - | 55 | 137 | rev | Y | 5 | 4 | 22 | 8 |
| /medical-disclaimer/ | legal | - | 39 | 122 | - | N | 0 | 4 | 22 | 8 |
| /patient-rights/ | legal | - | 45 | 116 | - | N | 0 | 4 | 22 | 8 |
| /plan-your-visit/ | core | - | 50 | 125 | - | Y | 4 | 4 | 22 | 8 |
| /privacy-policy/ | legal | - | 35 | 130 | - | N | 0 | 4 | 22 | 8 |
| /services/ | core | - | 40 | 148 | - | Y | 0 | 4 | 22 | 8 |
| /sleep-apnea/ | service | - | 57 | 137 | rev | Y | 6 | 4 | 23 | 8 |
| /terms-of-use/ | legal | - | 33 | 102 | - | N | 0 | 4 | 22 | 8 |
| /thyroid-disorders/ | service | - | 38 | 134 | rev | Y | 5 | 4 | 22 | 8 |
| /weight-management/ | service-hub | - | 53 | 138 | rev | Y | 6 | 4 | 22 | 18 |
| /weight-management/glp-1-medicines/ | service | - | 56 | 138 | rev | Y | 8 | 4 | 22 | 8 |

---

## 5. Cluster table

Every cluster has exactly 1 pillar + 5 supports (required shape: PASS). The gaps are uniform across all 10 clusters, so they are shown once rather than 50 times.

| Cluster | Pillar | Supports | Pillar→support in body | Support→pillar | Sibling body links | Service/doctor links in body |
|---|---|---|---|---|---|---|
| Type 2 Diabetes | /health-library/type-2-diabetes/ | early-symptoms-type-2-diabetes, hba1c-vs-fasting-blood-sugar, how-often-should-you-check-blood-sugar-and-hba1c, type-2-diabetes-reversal-remission, yearly-tests-for-diabetes | 0/5 (end block only) | end boilerplate only | 0 | rendered via cards/byline, not body |
| Diabetes Medicines | /health-library/diabetes-medicines-treatment-options/ | does-starting-insulin-mean-diabetes-is-severe, glp-1-medicines-diabetes-weight-loss, metformin-side-effects, sglt2-inhibitors-diabetes-heart-kidney, when-type-2-diabetes-needs-insulin | 0/5 | end boilerplate only | 0 | cards/byline only |
| Prediabetes | /health-library/prediabetes-blood-sugar/ | can-prediabetes-go-back-to-normal, how-often-prediabetes-testing, normal-prediabetes-diabetes-hba1c-levels, prediabetes-diet-what-to-eat-and-what-to-limit, weight-loss-lower-type-2-diabetes-risk | 0/5 | end boilerplate only | 0 | cards/byline only |
| Diabetes & Heart Disease | /health-library/diabetes-heart-disease-risk/ | cholesterol-diabetes-ldl-hdl-triglycerides, diabetes-heart-attack-without-chest-pain, diabetes-high-blood-pressure-heart-disease-connection, heart-tests-for-people-with-diabetes, why-diabetes-increases-heart-attack-risk | 0/5 | end boilerplate only | 0 | cards/byline only |
| Diabetic Neuropathy & Foot | /health-library/diabetic-neuropathy-foot-problems/ | can-diabetic-neuropathy-be-reversed, diabetes-feet-burning-tingling, diabetic-foot-ulcer-warning-signs, diabetic-foot-wound-what-not-to-do, how-often-diabetes-foot-examination | 0/5 | end boilerplate only | 0 | cards/byline only |
| Cholesterol & Triglycerides | /health-library/high-cholesterol-triglycerides/ | can-diabetes-cause-high-cholesterol, do-statins-need-to-be-taken-for-life, good-ldl-cholesterol-level, high-triglycerides-causes-symptoms-treatment, lower-ldl-cholesterol-diet-lifestyle | 0/5 | end boilerplate only | 0 | cards/byline only |
| Hypertension | /health-library/high-blood-pressure-guide/ | how-much-salt-high-blood-pressure, how-to-check-blood-pressure-at-home, normal-blood-pressure-reading-by-age, resistant-hypertension-bp-high-despite-medicines, white-coat-hypertension-high-bp-clinic-normal-home | 0/5 | end boilerplate only | 0 | cards/byline only |
| ECG, 2D Echo, Stress Echo & Holter | /health-library/ecg-echo-stress-echo-holter/ | 2d-echo-vs-ecg-difference, can-diabetes-and-bp-affect-the-heart-without-symptoms, holter-monitor-what-it-detects, stress-echocardiogram-when-recommended, what-to-do-before-an-ecg-or-echo | 0/5 | end boilerplate only | 0 | cards/byline only |
| Obesity | /health-library/obesity-weight-management/ | how-is-obesity-diagnosed-bmi-waist, obesity-and-sleep-apnea, semaglutide-vs-tirzepatide-weight-loss, weight-loss-improve-diabetes-blood-pressure, weight-regain-after-stopping-glp-1 | 0/5 | end boilerplate only | 0 | cards/byline only |
| Sleep Apnea | /health-library/sleep-apnea-metabolic-health/ | can-sleep-apnea-cause-high-blood-pressure, loud-snoring-sign-of-sleep-apnea, sleep-apnea-and-diabetes-connection, sleep-apnea-symptoms, what-happens-during-sleep-study | 0/5 | end boilerplate only | 0 | cards/byline only |

Unclustered articles: `/health-library/echo-for-people-with-diabetes/`, `/health-library/hba1c-explained/`, `/health-library/snoring-and-sleep-apnea/` (each shows the generic "More from the Health Library" list).

**Missing People-Also-Ask / comparison coverage per page (item 58):** the FAQ sets are strong; recurring gaps seen across clusters — "cost of the test/treatment" questions (deliberately excluded per compliance), "X vs Y" beyond the 3 published comparisons (e.g. metformin vs insulin, home BP machine vs ABPM, CGM vs finger-prick), and doctor-selection questions ("which doctor should I see for X in Bongaigaon") which could ethically point at Dr. Das.

---

## 6. Top-5 queries — what AI engines need from this site

1. **"diabetes doctor in Bongaigaon"** — Needs: physician identity + registration + services + NAP + reviews-free trust. Present: strong `Physician`/`MedicalClinic` schema, doctor page, llms.txt. Missing: `Physician.url`/`image`, geo coordinates, consistent clinic name in article outros, GBP-name parity check.
2. **"type 2 diabetes symptoms / HbA1c meaning"** — Needs: quotable definition + thresholds. Present: answer-first intros and diagnostic tables — very quotable. Missing: entity `sameAs` to MeSH/Wikidata; reviewer visible near top.
3. **"2d echo test in Bongaigaon / echo vs ecg"** — Needs: what it is, who performs it, duration, prep. Present: echocardiography service page + comparison article + FAQs. Missing: FAQ questions duplicated across the two echo pages; price answer deliberately absent.
4. **"semaglutide vs tirzepatide"** — Needs: balanced comparison with dates. Present: dedicated comparison article. Missing: nothing structural — cite trial names inline for stronger quotation.
5. **"sleep apnea symptoms / snoring"** — Needs: single canonical answer page. Present: three overlapping pages → consolidate intent (ISS-16).

---

## 7. AI-likeness scoring method and worst patterns

Score = base 8 + 25 for the identical "…you can consult Dr. Tamoghna Das… Medcare Diabetes & Obesity Clinic" outro + 8 for the "part of our guide" boilerplate + 15 for the "Key Takeaways"+"Final Thoughts" template pair + up to 16 for Title Case headings + 10 per banned vocabulary hit (there were zero). Reading the prose itself confirms the vocabulary is genuinely human/plain — the scores are driven by repeated scaffolding, not slop words.

Worst recurring sentences/patterns (quoted verbatim):
- "For diabetes testing and a personalised plan, you can consult Dr. Tamoghna Das, an internal medicine and cardio-diabetology specialist at Medcare Diabetes & Obesity Clinic." — identical on ~40 articles; wrong clinic name and a different credential term than the rest of the site.
- "This article is part of our guide to [type 2 diabetes symptoms and treatment](/health-library/type-2-diabetes/), written for patients and families in Bongaigaon." — identical sentence template on 50 articles.
- "### Key Takeaways" / "### Final Thoughts" — same section pair closing 50 of 63 articles.
- "Both are painless and safe." (and similar "painless" lines, ~15 uses) — factual, but on the risky-word list.
- Alt text "A cardiologist performing a 2D echocardiogram…" — mislabels the doctor.

---

## 8. Environment / deployment notes

- Production (`www.medcare.org.in`) is live and indexable with correct canonicals — confirm this matches launch intent (AGENTS.md's "noindex until launch" appears satisfied by the launch having happened).
- Local `.env.local` is missing `NEXT_PUBLIC_SITE_URL`, so local/preview builds stamp vercel.app canonicals — cosmetic in dev, but the var must stay set on Vercel.
- The preview host serves `index,follow`; canonicals point at prod which limits harm, but consider `SITE_NOINDEX=true` for non-production deployments.
- 26 `[CONFIRM]` markers remain in content — hidden in production output; `npm run launch-check` fails while any exist. These are the client-input items above.
