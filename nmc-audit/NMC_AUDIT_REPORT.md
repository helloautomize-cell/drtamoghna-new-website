# NMC Compliance Audit — Medcare Diabetes, Obesity and Echocardiography Clinic

Audit basis: NMC "Guidelines on Ethical Advertising and Public Communication by Hospitals/Medical Institutions and Registered Medical Practitioners" (EMRB, No. R-13014/01/2024-Ethics), IMC Regulations 2002, DMR Act 1954, Clinical Establishments Act 2010, IT Act 2000, DPDP Act 2023 / Rules 2025.
Scope: this repository plus the live deploy at https://drtamoghna-new-website.vercel.app/ (checked 26 October 2026). Investigation only — no code or content was changed.

## Step 1 — Practice profile

| Item | Answer | Evidence |
|---|---|---|
| Practice type | **P1 — Solo doctor, OPD-only clinic** (consultations + in-clinic diagnostic tests; in-house pharmacy counter and lab sample collection mentioned) | `content/pages/about.md`, `content/pages/faqs.md` |
| State / State Medical Council | Assam — Assam Council of Medical Registration | `lib/site-config.ts:75-77` |
| Doctors named | **Dr. Tamoghna Das**, MBBS, MD (Medicine). Registration number shown: "Assam Council of Medical Registration No. 20276" — in the footer of every page, in the profile-page key-facts card, and in JSON-LD `hasCredential` | `components/Footer.tsx:134`, `content/pages/dr-tamoghna-das.md:23`, `lib/schema.ts:99-108` |
| Procedures/surgeries described | No surgery. Diagnostic tests and treatment approaches described (echo, ECG, Holter, ABPM, CGM, spirometry, sleep study, GLP-1 assessment) | `content/services/**` |

## Step 2 — Feature inventory

| # | Feature | Present? | Evidence / notes |
|---|---|---|---|
| F1 | Testimonials / reviews / star ratings | **No rendered; dormant code** | `components/GoogleRatingChip.tsx` renders `★ {value} on Google · {count} reviews` in the footer the moment `GOOGLE_PLACES_KEY`+`GOOGLE_PLACE_ID` or manual values exist (`lib/site-config.ts:143-148`, `components/Footer.tsx:95`). Confirmed NOT in live HTML. Activation planned: `docs/client-inputs-needed.md` item 31 |
| F2 | Rating/review schema | No | Explicitly excluded; `lib/schema.ts:9`, `lib/page-schema.ts:4` |
| F3 | Case studies / patient stories | No | Linked journal-published case report on the profile page is an allowed academic citation (8.2 i): `app/dr-tamoghna-das/page.tsx:113-118` |
| F4 | Patient photos / before-after | **Yes (incidental), no before/after** | `dr-das-consultation*.jpg` show a patient from behind (unidentifiable); `public/images/video/echo-room-loop.mp4` shows a real echo in progress with a patient's arm at the frame edge. `lib/images.ts:29-40,115-126` |
| F5 | Patient/surgery videos | **Yes** | `echo-room-loop.mp4` on `/heart-health/echocardiography/` via `components/EchoVideo.tsx`, `components/templates/ServicePage.tsx:211-213,244` |
| F6 | Doctor photographs | **Yes, many placements** | Hero portrait card (`components/Hero.tsx:75-104`), avatar chip (`components/DoctorChip.tsx`), `components/DoctorCard.tsx`, profile page hero + 4 more photos (`app/dr-tamoghna-das/page.tsx:213-338`), OG share image on every non-article page (`app/og/route.tsx:18-82`) |
| F7 | Numbers / counters / stat tiles | **Yes** | "more than 10,000 echocardiography examinations" (`content/pages/home.md:66`, `content/pages/about.md:15`, `components/AboutSection.tsx:46`, `lib/llms.ts:29`, `docs/entity-facts.md:25`). "15+ years" chip is factual and allowed |
| F8 | Awards / rankings / media | **Yes** | "Heart Function Clinic recognised by the Heart Failure Association of India (HFAI)" (same 4 locations as F7); COVID-19 award with body + date (factual, compliant); plaques photo on profile page (`app/dr-tamoghna-das/page.tsx:306-315`). No logo walls |
| F9 | Equipment / facility descriptions | **Yes** | In-house test list, "advanced echocardiography lab", `echo-screen.jpg` (a rendered/mock UI presented as the real system), echo-room video |
| F10 | Fees / packages / prices | **No** | Explicit "Are fees shown on the website? No." (`content/pages/faqs.md:48-49`); "no fixed packages" (`content/services/health-check-ups.md:18`) |
| F11 | Offers / discounts / camps | **No** | None found |
| F12 | Educational content | **Yes** | 50+ Health Library articles, service pages, FAQs; every article carries a disclaimer block (`components/content/PageParts.tsx:133-152`) |
| F13 | Forms / WhatsApp / chat | **Yes** | Booking form on `/book/`, `/contact/`, home (`components/forms/booking-fields.tsx`); WhatsApp chooser (`components/WhatsAppMenu.tsx`); floating WhatsApp FAB (desktop) + mobile action bar. No pop-ups, countdowns or auto-open |
| F14 | AI content | **Yes (disclosed)** | `content/legal/editorial-policy.md:31` discloses AI-assisted first drafts and AI-assisted illustrations (service badges); blog hero images appear AI-generated |
| F15 | Analytics / pixels / cookies | **Yes** | Consent-gated GA4 + Consent Mode v2 (all denied by default, ad signals always denied), `components/Analytics.tsx`; `generate_lead` event (`components/LeadTracker.tsx`); Vercel Analytics + Speed Insights (cookieless); cookie banner (`components/CookieBanner.tsx`); Google Maps iframe embed loads without consent (`components/MapCard.tsx:11-19`) |
| F16 | Third-party credits / links | **Yes** | "Built & Marketed by Automize Media Labs" footer credit on every page (`components/Footer.tsx:135-140`), also in `public/humans.txt:2` and `/llms.txt` (`lib/llms.ts:17-18`); lab partner "Agilus" named; in-house pharmacy promoted; GBP link |
| F17 | Announcements / greetings | No | None |
| F18 | Doctor directory | No | Single doctor |
| F19 | Social profile links | **Yes** | Clinic: Facebook + Instagram (footer, `/book/`). Doctor: LinkedIn, X, Facebook (profile page). `lib/site-config.ts:116-140`, `components/SocialLinks.tsx` |

## Step 3 — Applicability

| Check | Applies? | Reason |
|---|---|---|
| M1 Registration disclosure | Applies — **SATISFIED** | Name, qualifications, council + registration number in footer (every page), profile page, JSON-LD |
| M2 Privacy notice + consent | Applies — **SATISFIED** | Unticked consent checkbox + linked privacy policy (`booking-fields.tsx:362-378`); policy covers what/why/retention/12-month deletion/grievance contact; cookie banner gates GA4. Residual gap: Maps iframe → finding NMC-09 |
| M3 Risks & limitations | Applies — **SATISFIED** | Only diagnostic tests and management approaches are described; risk/side-effect sections exist (e.g. GLP-1 page); site-wide disclaimer states outcomes vary |
| M4 AI disclosure | Applies — **PARTIAL** | Policy-level disclosure present; no per-asset AI label; one equipment image appears rendered (NMC-08, NMC-12) |
| M5 Medical disclaimer | Applies — **SATISFIED** | `PostNotice` on every article + dedicated `/medical-disclaimer/` page |
| C1 Claims & wording | Applies | Always on; findings NMC-02, NMC-06, NMC-10 |
| C2 Testimonials & reviews | Applies | Dormant rating/review plumbing exists and is staged for activation (NMC-04) |
| C3 Cases & patient stories | N/A | No case studies; journal citation is allowed |
| C4 Patient images & video | Applies | Patient partially visible in consultation photos and echo-room video (NMC-07) |
| C5 Doctor photos | Applies | Promotional placements (NMC-03) |
| C6 Numbers, awards, media | Applies | Procedure count + "recognised" claim (NMC-02, NMC-06) |
| C7 Equipment & facilities | Applies | "Advanced lab" wording; possibly-rendered equipment image (NMC-08, NMC-10) |
| C8 Fees & offers | N/A | No fees, packages or offers exist on the site |
| C9 Educational content | Applies — **PASS** | Articles stay educational; CTAs are neutral and outside the article body |
| C10 Solicitation & CTAs | Applies — **PASS (watch)** | All CTAs factual; no pop-ups/countdowns/auto-open. CTA density on service pages is acceptable (Book + Call + WhatsApp + sticky TOC card + CTA band) |
| C11 AI | Applies | NMC-08, NMC-12 |
| C12 Data protection | Applies | NMC-09; `generate_lead` event noted for internal review |
| C13 Third parties & agency | Applies | NMC-01, NMC-05 |
| C14 Announcements & greetings | N/A | None exist |
| C15 Institution rules | N/A | P1 solo OPD clinic, no directory |
| C16 Off-site checklist | Applies | F19 — see checklist below |

## Executive summary

- **Overall risk: HIGH** — no CRITICAL items (no cure claims, fake reviews, identifiable patient data or mass solicitation), but **5 HIGH** findings, two of which render on every page today.
- **Counts: 5 HIGH · 4 MEDIUM · 3 LOW (12 findings).**
- Top 5 fixes: (1) remove the "Built & Marketed by" agency credit; (2) delete the "10,000 echocardiography examinations" count; (3) remove the doctor photo from the home hero and OG share images; (4) delete the dormant Google-rating chip and GBP review link before they can go live; (5) strip the in-house-pharmacy sales language and the "Agilus" brand mention.
- The site is structurally well-built for compliance: registration disclosed, no testimonial/rating schema, consent-gated analytics, disclaimers everywhere, no fees or offers. The breaches are a small set of copy lines and placements, not architecture.
- Out-of-scope observation (project rule, not NMC): the live site is currently **indexable** — `robots.txt` allows all crawlers, so `SITE_NOINDEX` is not `true` on Vercel, though the project brief says noindex until launch.

## Findings

### HIGH

**NMC-01 · Agency marketing credit, site-wide**
- Clause: 8.1(ii) — an RMP shall not engage any third party for marketing medical services; 8.1(xi), 4.4 (no indirect promotion).
- Location: every page footer — `components/Footer.tsx:135-140`; also `public/humans.txt:2` and `/llms.txt`, `/llms-full.txt` via `lib/llms.ts:17-18`. Live: confirmed on https://drtamoghna-new-website.vercel.app/ footer. Enforced by `tests/agency-credit.spec.ts`.
- Evidence: `Built & Marketed by Automize Media Labs` (linked, `rel="noopener nofollow"`); `Website built and marketed by Automize Media Labs (https://www.automizemedialabs.com/)`.
- Why it breaches: a public "built & marketed by" credit openly states a third party is engaged for marketing — exactly what 8.1(ii) prohibits; no disclaimer or consent fixes it.
- Compliant alternative: remove the credit and the link entirely; if a credit is contractually required, the neutral form is `Website: Automize Media Labs` (no "marketed", still a judgement call — removal is the safe option). Remove the same line from `humans.txt` and the `AGENCY_CREDIT` in `lib/llms.ts`; update `tests/agency-credit.spec.ts` which asserts its presence.
- SEO/AEO note: none lost; the nofollow link passed no equity anyway.
- Client input needed: agency sign-off (it is the agency's own credit).
- Effort: S.

**NMC-02 · Procedure count "10,000 echocardiography examinations"**
- Clause: 8.1(iii),(ix) — patient/procedure numbers and success-scale claims are prohibited even when true.
- Location: live on `/` and `/about/`. Sources: `content/pages/home.md:66`, `content/pages/about.md:15`, `components/AboutSection.tsx:41-51`, `lib/llms.ts:29` (ENTITY_STATEMENT, feeds llms.txt + llms-full.txt), `docs/entity-facts.md:25`.
- Evidence: "…and has performed more than 10,000 echocardiography examinations."
- Why it breaches: volume-of-work numbers are a listed prohibition; they imply superiority through scale.
- Compliant alternative: delete the clause. The sentence reads clean without it: "He is a member of the Indian Academy of Echocardiography (IAE) and the European Society of Cardiology (ESC). He performs and reports every echocardiogram himself." Authority is carried instead by the fellowship, memberships and the named 2025 Indian Heart Journal publication — all verifiable.
- SEO/AEO note: keeps E-E-A-T via credentials and publications; "10,000 echoes" is not a ranking factor.
- Client input needed: none (deletion).
- Effort: S.

**NMC-03 · Doctor photo used in promotional placements (hero + OG + cards)**
- Clause: 9.2 — a doctor's photograph is not permitted where the use is self-advertisement/solicitation.
- Location: home hero portrait card beside the "Book Appointment" CTA (`components/Hero.tsx:75-104`, avatar chip `components/DoctorChip.tsx`); "Meet your doctor" card on `/` (`components/DoctorCard.tsx:14-25`); the OG share image on every page that lacks its own image — every service and legal page (`app/og/route.tsx:18-82`, default wired in `lib/metadata.ts:63-70`); Physician schema `image` (`lib/schema.ts:80`). The plain portrait on `/dr-tamoghna-das/` itself (`app/dr-tamoghna-das/page.tsx:213-223`) is the allowed identification use.
- Why it breaches: a doctor cut-out sitting next to booking CTAs, and on every WhatsApp/social share preview, functions as promotional publicity rather than identification.
- Compliant alternative: keep one plain portrait on the profile page (and small avatars in reviewer/author boxes — low-risk identification). In the hero, use clinic imagery (storefront or consultation-room photo already in `lib/images.ts`) instead of the portrait card. Change the `/og` route to brand graphics + name only (no photo). JUDGEMENT: the guideline is new and Indian practice is mixed; the low-risk option is hero/OG without his photo.
- SEO/AEO note: OG images still brand the clinic (name + teal gradient); hero CTA performance is unaffected by swapping the image.
- Client input needed: none.
- Effort: M (hero art direction + OG template change).

**NMC-04 · Google rating chip + review link plumbing (dormant but staged)**
- Clause: 8.1(ii),(xi),(xii), Explanation V — displaying the clinic's Google star rating/review count is using reviews for promotion; consent or accuracy does not make it allowed.
- Location: `components/GoogleRatingChip.tsx` (renders `★ {value} on Google · {count} reviews` in the footer via `components/Footer.tsx:95` when `GOOGLE_PLACES_KEY`+`GOOGLE_PLACE_ID` are set — both are already present in `.env.local` — or when `siteConfig.googleRating` values are entered, `lib/site-config.ts:143-148`); `reviewUrl` "write-a-review" link `https://g.page/r/.../review` sits configured at `lib/site-config.ts:29`; activation is an open task (`docs/client-inputs-needed.md` item 31). NOT rendered in the current deploy (verified live HTML).
- Why it breaches: the feature is built and documented for go-live; the moment values are supplied it displays a star rating and review count site-wide — a prohibited use of reviews.
- Compliant alternative: delete `GoogleRatingChip`, the `googleRating` config block, `reviewUrl`, the Places-API env vars, and item 31 of the client-inputs doc. The plain "See us on Google Maps" link already in the footer is fine (location, not rating).
- SEO/AEO note: no aggregateRating exists; a visible rating chip was never going to produce stars in search results for a business's own site anyway.
- Client input needed: tell the client the chip was removed so it is not re-requested.
- Effort: S.

**NMC-05 · In-house pharmacy promotion + named lab partner**
- Clause: 8.1(iv) (product/commercial-entity endorsement), 8.1(ii) (solicitation); also contradicts the site's own Patient Rights item 7 ("You are never required to use a particular pharmacy") and the project rule "never name or suggest a pharmacy, lab or hospital".
- Location: `content/services/weight-management/glp-1-medicines.md:18` "Medcare has its own pharmacy that sells genuine medicines" and `:80` "you can buy it at the clinic with a proper bill"; `content/pages/faqs.md:52-53`; `content/pages/about.md:48` ("in-house pharmacy and a lab tie-up with Agilus"); `content/services/health-check-ups.md:24` and `content/pages/coming-from-outside-bongaigaon.md:42` ("lab partner Agilus"); `app/page.tsx:50` / `content/pages/home.md:180` ("the pharmacy is open on Sunday"); `lib/llms.ts:29`.
- Why it breaches: on a page about prescription weight-loss medicines, "buy it at the clinic" solicits medicine sales from the clinic's own shop; "sells genuine medicines" is a quality claim implying others do not; naming "Agilus" promotes a third-party commercial lab.
- Compliant alternative: keep only the factual service statement plus free choice: "A pharmacy counter operates inside the clinic during clinic hours. You are free to buy medicines from any licensed pharmacy. Blood samples are collected at Medcare and tested by an accredited partner laboratory; reports are given at the clinic." Drop "sells genuine medicines", "buy it at the clinic", and the brand name "Agilus" everywhere including `ENTITY_STATEMENT`.
- SEO/AEO note: no keyword value is lost; "genuine medicines" is not a query term.
- Client input needed: confirm preferred phrasing for the pharmacy's existence (it is real and may legitimately be stated factually — e.g. Sunday hours — without sales framing).
- Effort: S.

### MEDIUM

**NMC-06 · "Recognised by the Heart Failure Association of India (HFAI)"**
- Clause: 8.1(iii),(ix) — recognition/ranking claims must be independently verifiable with the body, date and basis disclosed.
- Location: `content/pages/home.md:66`, `content/pages/about.md:15`, `components/AboutSection.tsx:48-50`, `lib/llms.ts:29`, `docs/entity-facts.md:25`. Live on `/` and `/about/`.
- Evidence: "a weekly Heart Function Clinic recognised by the Heart Failure Association of India (HFAI)".
- Why it breaches: "recognised by" is an unverifiable endorsement claim unless HFAI recognition is documented.
- Compliant alternative: if documentary proof exists, keep it and add the basis inline or on the profile ("listed by HFAI as a Heart Function Clinic, [year]"). Otherwise: "a weekly heart failure clinic run by Dr. Das" — factual.
- SEO/AEO note: "heart failure clinic Bongaigaon" keeps the local-intent signal either way.
- Client input needed: the HFAI recognition letter/listing.
- Effort: S.

**NMC-07 · Patients visible in site media — verify consent and identifiers**
- Clause: 6.1-6.4, 7.4-7.5 — people shown in clinic media need documented written consent; no identifiable patient data.
- Location: `public/images/doctors/dr-das-consultation.jpg` and `-3x2.jpg` (patient seen from behind — unidentifiable; used on home step 3, `/about/`, `/dr-tamoghna-das/`); `public/images/video/echo-room-loop.mp4` + `echo-room-poster.jpg` (real echo in progress, patient's arm visible at frame edge; machine monitor content unresolved at this resolution; used on `/heart-health/echocardiography/`). Editorial policy asserts consent: `content/legal/editorial-policy.md:34`.
- Why it may breach: consent is asserted but must exist on file; the video must be checked frame-by-frame for a patient name/ID burned into the machine header, and EXIF scrubbed.
- Compliant alternative: keep media only with the signed consent forms on file; if consent cannot be produced, replace with the patient-free clinic photos already in `lib/images.ts`. Re-export the video with any burned-in identifiers cropped/blurred.
- SEO/AEO note: none.
- Client input needed: signed consent forms for each person shown; source of the echo-room video.
- Effort: S (verify) / M (re-shoot or re-edit if missing).

**NMC-08 · Echo-screen image appears to be a render/mock presented as the real system**
- Clause: Explanation II (misleading representation), 7.2(c) (misleading AI content / AI labels).
- Location: `public/images/clinic/echo-screen.jpg`, alt "Echocardiography images with Doppler measurements on the screen of the echo system at Medcare" (`lib/images.ts:71-76`); used on the home "Tests if needed" step (`lib/services.ts:209`) and `/health-library/echo-for-people-with-diabetes/` (`app/health-library/echo-for-people-with-diabetes/page.tsx:9`).
- Evidence: the on-screen control text is gibberish/non-functional UI, indicating a generated or stock render, yet the caption presents it as Medcare's actual echo system.
- Why it may breach: depicting a generic render as the clinic's real equipment is a misleading facility claim; if AI-generated it also needs disclosure under 7.2.
- Compliant alternative: (a) confirm provenance — if it is a genuine photo of Medcare's machine, keep it; (b) if rendered/AI, replace with a real de-identified photo of the clinic's screen, or keep it with an "Illustrative image" caption and an AI-generated label per the editorial policy.
- SEO/AEO note: none.
- Client input needed: is this a real photo of the clinic's machine or a supplied/rendered visual?
- Effort: S.

**NMC-09 · Google Maps iframe loads without consent**
- Clause: 7.6 + DPDP Act 2023 — third-party requests that expose visitor data should sit inside the consent model.
- Location: `components/MapCard.tsx:11-19` — a `google.com` maps iframe embedded on `/` and `/contact/`, loaded on page render outside the cookie-consent store (consent only gates GA4).
- Why it breaches: the embed makes a request to Google (IP, page, possibly cookies) before any consent; the privacy policy names Google only for the Sheet and analytics.
- Compliant alternative: (low-risk) click-to-load map — static address card that swaps in the iframe on tap; or (b) add a "Maps" line to cookie settings + privacy policy §7/§9 and keep the embed.
- SEO/AEO note: none; the address text is already crawlable.
- Client input needed: none.
- Effort: S–M.

### LOW

**NMC-10 · Wording polish: "advanced", "experienced", "does not hurt"**
- Clause: 8.1(iii), Explanation II — unverifiable qualitative descriptors; DMR-adjacent phrasing.
- Location: "advanced echocardiography lab" / "Advanced Echocardiography Lab" — `content/pages/home.md:66,36`, `content/pages/about.md:15`, `components/AboutSection.tsx:48`, `components/ConcernPills.tsx` (home pill label), `lib/llms.ts:29`; "One experienced physician" — `components/Hero.tsx:51` / `content/pages/home.md:19`; typos that also soften: "an ultrasound that does not hurt of the heart" and "It does not hurt and safe for all ages" — `content/services/heart-health/echocardiography.md:23,83`.
- Alternative: "an echocardiography lab with strain imaging"; "One physician, most tests under one roof…"; fix the two sentences to "an ultrasound scan of the heart; no radiation, no needles" and "It does not hurt and is safe for all ages".
- SEO/AEO note: none.
- Client input needed: none.
- Effort: S.

**NMC-11 · Physician schema lists "Cardiovascular" specialty**
- Clause: Explanation II — schema should not overstate scope (agency's own rule: never call Dr. Das a cardiologist; also flagged in `seo-audit` ISS-33).
- Location: `lib/schema.ts:81` — `medicalSpecialty: ["Internal medicine", "Endocrine", "Cardiovascular"]` on the Physician node (the clinic node's `:218` is a separate, lower-risk mention).
- Alternative: narrow the physician node to `["Internal medicine", "Endocrine"]` — his board registration is MD Medicine; echo/heart work is already described as services.
- SEO/AEO note: keeps the entity accurate; reduces a misclassification risk in knowledge panels.
- Client input needed: none.
- Effort: S.

**NMC-12 · Per-asset AI labels on generated illustrations**
- Clause: 7.2(c) — AI-generated images should be labelled where material.
- Location: `content/legal/editorial-policy.md:31` discloses AI assistance at policy level only; service-badge icons (`public/images/icons/services/*`) and blog hero images (`public/images/blog/*`) carry no per-asset label.
- Alternative: JUDGEMENT — policy-level disclosure is probably sufficient for decorative art; the low-risk option is a small "AI-assisted illustration" caption/credit or a policy line stating that illustrations site-wide may be AI-assisted. Only matters materially for NMC-08 (an image presented as real equipment).
- SEO/AEO note: none.
- Client input needed: none.
- Effort: S.

## Off-site checklist (C16) — manual review, same rules

| Profile | URL / handle | What to check |
|---|---|---|
| Google Business Profile | `maps.app.goo.gl/pywFP4CULqxi2RBGA` (linked sitewide); review link `g.page/r/CZGbIjaCH779EBM/review` exists in config | Do not solicit or incentivise reviews (no "leave us a review" posts, WhatsApp blasts or QR cards); check GBP photos for before/after or patient images; ensure no superlatives in the business description; do NOT display the rating on-site (NMC-04) |
| Facebook — clinic | `facebook.com/people/Medcare-Clinic/61551113781226/` (footer) | No boosted posts/ads, offers, testimonials, before/after; reposts of patient praise count as testimonials — delete; registration number in the bio is good practice |
| Instagram — clinic | `instagram.com/medcarebongaigaon/` (footer, /book/) | Same checks; patient stories/reels and "camp" promo posts are the usual violations |
| Facebook — Dr. Das | `facebook.com/people/Dr-Tamoghna-Das-MD-Medicine/61550611900549/` (profile page) | Same checks under his own name |
| LinkedIn — Dr. Das | `in.linkedin.com/in/tamoghna-das-a96660264` | Professional posts are fine; no patient praise reposts or clinic ads |
| X — Dr. Das | `x.com/dr_tamoghna` | Same |
| WhatsApp Business | 60031 21297 / 93651 75235 | No broadcast offers or review requests; catalogue must not list medicine prices/promotions |
| Vercel review URL | `drtamoghna-new-website.vercel.app` | Internal only — no issue |

## Self-check
- No finding is about an absent feature; every finding quotes a file:line or live evidence.
- No recommendations to add features (M1–M5 verified present rather than recommended).
- All alternatives change promotion → factual, or remove; none work around 8.1/6.2.
- No code or content was modified.
