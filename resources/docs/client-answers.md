# client-answers.md · Dr. Tamoghna Das / MedCare Clinic, Bongaigaon

Source of truth for every fact on the site. Status key: ✅ answered · 🟡 answered, needs confirm · ⏳ later · ⛔ skip · ◻ still needed · ★ launch blocker.
Sources: WhatsApp notes from Dr. Das (29 Sep 2026), profile infographic, 4 photos, 6 short echo-room videos, Google AI Mode screenshot. Last updated 2 Oct 2026.

---

## A. Project, access and the old website

**1. ★ Clinic name, brands, old site** 🟡
- ✅ **Clinic-branded site: "Medcare Diabetes & Obesity Clinic"**, known as **Medcare**. Owner: Dr. Tamoghna Das. He is the lead doctor on the site.
- Site name in copy: "Medcare Diabetes and Obesity Clinic" (we write "and" in running text; keep "&" only if the signboard and logo use it). Short form: "Medcare".
- ✅ Spelling settled: "Medcare" (see Brand spelling below).
- Note: the name says "Diabetes & Obesity", but heart care and echo are a big part of his work. The tagline will carry it: "Diabetes, weight, heart and thyroid care in Bongaigaon".
- Earlier note: his promo line was "MedCare Clinic: Complete Care for Heart & Diabetes".
- Old site: you said "no website", but his WhatsApp text lists **medcarebongaigaon.org** (domain does not resolve today) and **medcare.org.in** (live, but blocks our reader). Need: who owns these, and is medcare.org.in his clinic or someone else's?
- Open: is the new site **doctor-branded** (Dr. Tamoghna Das) or **clinic-branded** (MedCare)? Are there other doctors at MedCare? → Question 2.

**1b. Doctors at Medcare** ✅
- **Dr. Das is the only doctor.** Hero = ONE large portrait card (no fan, no swap). DoctorChip shows one avatar: "Specialist-led care · Dr. Tamoghna Das". Home "Meet your doctor" section becomes a single wide feature card. Booking form has no doctor dropdown.

**2 to 5. Platform, export, media, HTML** ⛔ not applicable: no old website. No WordPress export, no 301 or 410 map needed. The audit (step 1) is a light "online presence audit": GBP, Facebook, Instagram, Google AI Mode result.

**6. Google Business Profile** 🟡
- A profile exists. The map label reads **"Dr. Tamoghna Das | Best Physician in…"**. 🔴 The word "Best" in the name breaks the IMC 2002 rules and Google's naming policy (keyword stuffing). Fix at launch: rename to "Dr. Tamoghna Das, MedCare Clinic" or "MedCare Clinic Bongaigaon".
- Review link: https://g.page/r/CZGbIjaCH779EBM/review
- Maps link: https://maps.app.goo.gl/pywFP4CULqxi2RBGA
- Google AI Mode already ranks him first for "cardiodiabetic specialist in Bongaigaon". Good entity signal to protect.
- Need: manager access, and Practo / Justdial / Lybrate URLs if any.

**Brand spelling** ✅ **"Medcare"** everywhere (site, logo text, GBP, schema, footer). Full name: "Medcare Diabetes & Obesity Clinic". Never "MedCare" or "Medacre".

**7. ★ Domain and DNS access** ⏳ (still a launch blocker)
- Domain chosen by Dr. Das **after the build**; it will contain "medcare". He mentioned medcare.com.
- 🟡 medcare.com is almost certainly owned by another business already. Ask him to confirm availability before it goes on cards, signboards or the GBP.
- Build impact: the site URL lives in ONE env variable (`NEXT_PUBLIC_SITE_URL`) used by canonicals, sitemap, robots, OG and JSON-LD `@id`s. Until then: Vercel preview URL with `SITE_INDEXABLE=false` (noindex everywhere).
- Old domains: medcarebongaigaon.org (does not resolve) and medcare.org.in (owner unknown) are **not used**. At launch, remove medcarebongaigaon.org from his WhatsApp promo text and social bios.
- Domain email: none for now. Forms send to the single clinic email (Q25). Resend sender domain is set up only after the domain exists (Phase 6 runs on a test sender until then).
**8. Hosting and Vercel owner** ✅
- Hosted on the **agency's Vercel account**. Windsurf already has access (deploys previews per phase branch).
- Functions region: `bom1` (Mumbai, nearest to Assam).
- Old hosting: none (no live site).
- Note for launch: if Dr. Das later wants ownership, Vercel supports a project transfer. Not needed now.
**9. Reference sites / dislikes** ✅ default: Oliva structure + Automize refinement + `reference-styleguide-niramay.html` (internal only).

---

## B. Doctor: Dr. Tamoghna Das

**10. ★ Name and title line** ✅ (wording fixed for compliance)
- Name: **Dr. Tamoghna Das**, MBBS, MD (Internal Medicine)
- Site title line: **"Consultant physician in internal medicine, diabetes and heart health, with advanced training in echocardiography"**
- Short version (chips, cards): "Internal Medicine and Cardio-Diabetic Consultant"
- 🔴 Not used: "Cardiology", "Cardiologist", "Specialist in Cardiology" (his WhatsApp promo says "Specialized in Cardiology"). He does not hold DM Cardiology, so this is a specialty claim the rules do not allow (Part 6.3). The site says "heart health", "cardiac risk" and "echocardiography" instead.

**11. ★ Qualifications** 🟡 (WhatsApp list used as the master; infographic differs in places)

| # | Qualification | Institution | Year |
|---|---|---|---|
| 1 | MBBS | Gauhati Medical College and Hospital (GMCH), Guwahati | 2010 (internship to Feb 2011) |
| 2 | MD, General Medicine | GMCH, Guwahati | 2015 |
| 3 | Post Graduate Diploma in Echocardiography | JROP Institute, Delhi | 2022 |
| 4 | Certificate Course in Transthoracic Echocardiography | IMMAST, Mumbai | 2023 |
| 5 | Post Graduate Fellowship in Clinical Echocardiography | JROP Institute, Delhi (under Parul University) | Apr 2023 to Apr 2024 |
| 6 | Diploma in Diabetic Foot Management | IMMAST, Mumbai | 2024 |
| 7 | Diploma in Obstructive Sleep Apnea | IMMAST, Mumbai | 2026 |
| 8 | Certificate in Respiratory Critical Care + 1-day hands-on ventilation workshop | ISCCM Guwahati City Branch | Jan to Jul 2026 |
| 9 | Executive Programme: Practice Management in the New Media Era (2 days) | IIM Ahmedabad | Dec 2023 |

To confirm:
- [CONFIRM: Infographic says "PG Diploma in Echocardiography from JROP **& IMMAST**". WhatsApp says JROP 2022 diploma + separate IMMAST 2023 certificate. Use the WhatsApp version?]
- [CONFIRM: Infographic lists "Diabetic Diet Counselling (Certification)". Not in WhatsApp list. Body and year?]
- [CONFIRM: "IMMAST courses accredited by the Royal College of Surgeons UK". We print this only if it appears on his certificate. Otherwise left out.]
- [CONFIRM: MD subject printed on the degree: "General Medicine" or "Medicine"? He wrote "Internal Medicine".]
- #9 (IIM-A) goes under "Courses", not under medical qualifications.

**12. ★ Registration** ✅
- **Assam Council of Medical Registration, Reg. No. 20276**

**13. Experience** 🟡
- MBBS 2010 → **"more than 15 years as a doctor"** (he says 16; true from 2010).
- 🟡 Specialist since MD in 2015 = **11 years** in Oct 2026, not 12. Site will say **"more than 10 years as a specialist"** unless he gives an MD month in 2014.
- Work history:
  - Registrar, Dept. of Medicine, GMCH: Jul 2015 to Sep 2016
  - Consultant Physician, Arya Wellness Clinic, Guwahati: 2016 to 2017
  - Assistant Divisional Medical Officer, Indian Railways (UPSC CMS 2013): 2017 to 2019
  - Divisional Medical Officer (Medicine Specialist), Indian Railways: 2019 to Jun 2023
  - Internal Medicine and Cardio-Diabetic Consultant, MedCare Clinic: Sep 2023 to now

**14. Roles, memberships, talks** 🟡
- Current roles: Secretary, IMA Bongaigaon · Secretary, API Bongaigaon
- [CONFIRM: Infographic says "Joint Secretary, Lower Assam Diabetes Society". Not in WhatsApp. Still current?]
- Visiting roles (Swagat Hospital; Lower Assam Hospital) → see decision D1 below.
- Life memberships (11): API · RSSDI · IMA · Indian Academy of Echocardiography (IAE) · European Society of Cardiology (ESC) · European Association of Cardiovascular Imaging (EACVI) · Heart Failure Association (HFA of the ESC; he wrote "European Heart Failure Association") · Heart Failure Association of India (HFAI) · ISCCM · Clinical Cardio-Diabetic Society of India (CCDSI) · Doctors AI
  - [CONFIRM: "Doctors AI": full name of this body, or a link?]
  - [CONFIRM: ESC, EACVI, HFA are usually annual or professional memberships. Are they truly "life" memberships? Otherwise we write "Member of".]
- Speaker: API and RSSDI national and regional forums; International Congress of Diabetes Technology (DTechCon), Jaipur, May 2025. Also speaker at the API Assam Chapter Mid Term CME (photo).
- ⛔ Pharma roles (resource person / advisory board for Janssen, AstraZeneca, Sanofi, Novo Nordisk and others): **not on the site**. Drug-company names next to diabetes and heart care read as promotion (DMR Act 1954) and raise conflict-of-interest questions. One generic line is fine if he wants it: "Invited speaker at national medical education programmes."

**Publications** 🟡
- Verified: Gupta R, **Das T**, Suchak MK, et al. "Prevalence of stage B heart failure in patients undergoing echocardiography during regular clinical practice." *Indian Heart Journal*, 2025. (Exact title differs from his WhatsApp wording; we use the journal title.)
- ⏳ "Many papers in national and international journals": need the list with links or DOIs. We only print what we can link.

**15. Awards** ✅
- COVID-19 award for exemplary service, from the Divisional Railway Manager, Rangiya Division (N.F. Railway), 15 Aug 2021.

**16. Languages** ✅
- **English · Assamese · Bengali · Bodo · Hindi**
- Chip line: "Speaks English, Assamese, Bengali, Bodo and Hindi"
- Schema `knowsLanguage`: en, as, bn, brx, hi
- Site language stays English (en-IN). No translated pages, so no language switch. Noto Sans Devanagari is loaded only if a Hindi or Bodo word appears (Bodo is written in Devanagari). Assamese and Bengali script would need Noto Sans Bengali, which is not in the fixed font set, so local terms are written in English letters (e.g. "madhumeh").

**17. Conditions and services** ✅ (grouped; final wording on the content pass)

| Group | Items |
|---|---|
| Diabetes care | Type 1 · Type 2 · diabetes in pregnancy (GDM) · monogenic and other types · diabetic foot care · diet counselling · insulin counselling · continuous glucose monitoring (CGM) |
| Heart health | Hypertension · cardiac risk assessment · heart failure care · echocardiography · Holter (extended rhythm) monitoring |
| Weight and hormones | Obesity and weight management · thyroid disorders |
| Lungs and sleep | Asthma · COPD · sleep apnea and sleep disorders |
| General internal medicine | Fever and infections · fatty liver and liver disorders · joint pain, arthritis and rheumatic conditions · migraine and primary headache · long-standing anaemia |
| Prevention | Preventive health check-ups · lifestyle medicine |

Infographic extras: "Use of AI in medicine": profile line only, not a service.
No item excluded. Wording rules: "management", never "cure", "reversal" or "insulin-free".

**18. Approach (own words)** ✅
- "For people with chronic diseases, I look after your health so that you do not develop long-term complications. For people at risk, we screen, identify who is at high risk and act early."
- "Every person has different health issues and responds differently to treatment, so the plan is personal."
- Becomes the "How Dr. Das works" block (3 principles: prevent complications · find risk early · a plan for you).

**Clinic equipment (from "What sets me apart")** 🟡 compliance rewrite

| He wrote | Site says | Why |
|---|---|---|
| "State of the art echo, Philips Affinity 70" | "Echocardiography on a modern high-end system with strain imaging" | No model names; "state of the art" is banned wording |
| LV GLS bullseye, LA and RV strain, detects dysfunction before symptoms | "Strain imaging (speckle tracking) can show early changes in heart muscle function, sometimes before symptoms appear or a standard echo shows them." | Factual, patient-level |
| "No other centre in lower Assam has this" | Removed | Comparison with other doctors is not allowed (IMC 2002) |
| "Trained by the pioneers of echo in India" | "Trained in echocardiography at JROP Institute, Delhi; member of the Indian Academy of Echocardiography; reports follow American Society of Echocardiography guidelines." | Self-praise → verifiable facts |
| 72-hour disposable Holter, extendable to 10 days, up to 1 month | "Wearable patch Holter: worn at home for 3 days, and longer if needed. No admission. You carry on with daily life." | Kept, plain words |
| CGM can transform diabetes care | "Continuous glucose monitoring (CGM) shows how your sugar changes through the day and night." | No hype, no brands |

**Patient numbers** ⛔
- "10,000+ patients at MedCare", "1 lakh+ in career", "10,000+ echos": **not on the site**. Patient numbers presented as boasts break Part 6.3. Experience is shown in years and training instead.

**19. Videos** 🟡
- 6 WhatsApp clips (8 to 21 sec, 1024x576, one vertical): echo room b-roll, Dr. Das scanning, a staff member at the reporting desk. Usable as short muted loops or stills for "Your echo, step by step".
- ✅ **No talks, interviews or YouTube videos.** The 6 WhatsApp clips are the only video.
- Home "06 / Watch Dr. Das" section: **hidden** (no VideoObject schema).
- Use of the 6 clips instead:
  - Echocardiography page: one short silent loop "Inside our echo room" (8 to 12 s, muted, autoplay only when on screen, paused under reduced motion, poster image first, self-hosted MP4 + WebM under 1.5 MB, no sound track).
  - Stills from the clips for the StepTracker ("Tests if needed") and the echo / Holter pages.
  - Faces of the patient and the staff member: crop or blur unless consent (Q44).
- Future (optional, after launch): 3 to 4 short talking-head videos by Dr. Das (e.g. "What is HbA1c", "Why an echo for people with diabetes"). These would turn on the "Watch Dr. Das" section.
- Consent: see Q44 (staff member and patients are visible).

---

## C. Practice details

**20. ★ Clinic founding year** ✅
- **Opened September 2023 by Dr. Tamoghna Das.**
- Copy: "Caring for Bongaigaon since 2023". Schema: `foundingDate: "2023-09"`, `founder` → #dr-tamoghna-das.
- Note: with a young clinic, trust comes from the doctor (15+ years, MD, echo fellowship, Railways service), not the clinic's age. The About block leads with him.
**21. ★ Exact address + landmark** ✅ (canonical NAP, use word for word)
- **Medcare Diabetes & Obesity Clinic, Chapaguri Road, opposite Domino's, North Bongaigaon, Gurunanak Nagar, Bongaigaon, Assam 783380**
- Written as given, with two style fixes: "Rd" → "Road", "Dominos" → "Domino's". The Google profile must use the same text.
- Footer / contact line breaks (no split inside a name):
  - Chapaguri Road, opposite Domino's
  - North Bongaigaon, Gurunanak Nagar
  - Bongaigaon, Assam 783380
- Schema `PostalAddress`: streetAddress "Chapaguri Road, opposite Domino's, Gurunanak Nagar", addressLocality "Bongaigaon", addressRegion "Assam" (code AS), postalCode "783380", addressCountry "IN". Geo: from the Maps pin https://maps.app.goo.gl/pywFP4CULqxi2RBGA [CONFIRM: Windsurf reads exact lat/long from the pin; we check against GBP].
- [CONFIRM: floor or building name, if any (e.g. "Ground floor")? Optional. Helps first-time patients.]
**22. ★ OPD days and hours** ✅
- **Monday to Saturday: 9 am to 8:30 pm**
- **Sunday: 9 am to 3:30 pm**
- Open 7 days. Copy (utility bar): "OPD Mon to Sat, 9 am to 8:30 pm · Sun, 9 am to 3:30 pm"
- Booking form time of day: Morning (9 am to 12 pm) · Afternoon (12 pm to 4 pm) · Evening (4 pm to 8:30 pm, Mon to Sat only). Sunday shows Morning and Afternoon only (to 3:30 pm). No "Sunday closed" note.
- Schema `openingHoursSpecification`: Mo-Sa 09:00-20:30; Su 09:00-15:30.
- [CONFIRM: public holidays (e.g. Bihu, Durga Puja): open, short hours or closed? Default copy: "Holiday hours may change. Please call before you visit."]
- [CONFIRM: Dr. Das himself sees patients through all these hours, or are some hours for echo, tests and reports only? Default: OPD hours as above.]
**23. Lab / pharmacy / phone hours** ✅
- **No in-house lab. No pharmacy.** In-house tests: echocardiography (with strain imaging), patch Holter, CGM fitting.
- Hours: one set only (OPD). Footer and contact show 2 rows (Mon to Sat · Sun) + phone line, not 4.
- Phone answered: same as OPD hours (default; no separate answer given).
- Removed from the template: lab and pharmacy departments in schema, "Lab 7 am to 7 pm" chip, home sample collection (Q36), pharmacy delivery (Q37), drug licence display (Q53), the pathologist line (Part 7.4).
- Blood tests copy: "If you need blood tests, Dr. Das tells you which ones and why. You can get them done at a lab of your choice and bring or WhatsApp the reports." (No lab names, no referral arrangement.)
- **Update 3 Oct 2026:** a pharmacy operates in the same shopfront under a **tie-up** with Medcare. It is **not mentioned** on the site (no name, no hours, no "our pharmacy", no suggestion to buy there), in line with the rule against implying referral arrangements. Copy says "Medcare does not sell medicines" and "you are free to buy at any licensed pharmacy you choose". Same for lab tests (outside labs, patient's choice).
- **Future:** when Medcare opens its **own pharmacy** or **diagnostic lab**, add each as a service (page, footer hours, schema `department`, drug licence display decision, Plan your visit line).

**24. ★ Phones** ✅
- **Call (appointments): +91 60031 21297** → `tel:+916003121297`. Display: "60031 21297" (local) or "+91 60031 21297".
- **WhatsApp: +91 98642 66191** → `https://wa.me/919864266191?text=...` (pre-filled from page title via `lib/whatsapp.ts`).
- No landline. Two different numbers, so every button is labelled clearly ("Call 60031 21297" / "WhatsApp 98642 66191"). The Call sheet on mobile shows the one call number only.
- Schema: `telephone` = +91-6003121297; `ContactPoint` (appointments) same number; WhatsApp not in schema.
- [CONFIRM: Is 98642 66191 a clinic phone or Dr. Das's personal number? If personal, patients will message him directly. Fine if he is happy with that.]

**25. ★ One email** ✅ (updated 3 Oct 2026)
- **medcarebongaigaon@gmail.com** everywhere: booking and contact forms deliver here (`RESEND_TO`), privacy contact in the Privacy Policy, footer, Contact page, schema `email`, `entity-facts.md`. Matches the signboard.
- Shown obfuscated (no plain `mailto:` in HTML).
- The personal address used earlier is no longer used anywhere on the site.

**26. Booking confirmation time** ✅
- **30 to 60 minutes**, during clinic hours.
- Form line: "We will call or WhatsApp you within 30 to 60 minutes during clinic hours to confirm your time."
- Thank-you page: "Requests sent after 8:30 pm (or after 3:30 pm on Sunday) are confirmed the next morning." + emergency line.
- Who confirms: not given (default "we", no name).

**27. Access and parking** ✅ (parking open)
- **Ground floor. Wheelchair available at the clinic.**
- Visit card chips: "Ground floor" · "Wheelchair available". (Step-free entry assumed from "ground floor"; [CONFIRM: any step at the entrance?])
- "All facilities available": too general to print. We only list named, true items.
- [CONFIRM: parking: two-wheeler, car, or roadside only? No parking chip until confirmed.]
- Schema: `amenityFeature` "Wheelchair available", "Ground floor access".

**28. Patient catchment** ✅

| Band | Share | Places |
|---|---|---|
| Bongaigaon town | about 40% | Bongaigaon, North Bongaigaon, New Bongaigaon |
| Nearby (to about 15 km) | about 25% | Abhayapuri, Chapaguri, Bijni |
| Farther (16 km+) | about 35% | Kokrajhar, Chirang, Dhubri, Goalpara, Barpeta, other Bodoland (BTR) areas; some from towns near the Bhutan border |

**Service area wanted: all of Northeast India.** Agency decision (tiered, so Google and AI engines get a true, clear picture):
- Schema `areaServed` (on `MedicalClinic` and `Physician`):
  1. Tier 1 `City`: Bongaigaon, Abhayapuri, Bijni, Chapaguri
  2. Tier 2 `AdministrativeArea` (districts): Bongaigaon, Chirang, Kokrajhar, Dhubri, Goalpara, Barpeta, plus "Bodoland Territorial Region"
  3. Tier 3 `State`: Assam, Arunachal Pradesh, Meghalaya, Nagaland, Manipur, Mizoram, Tripura, Sikkim (the 8 Northeast states)
  4. `GeoCircle` around the clinic geo: radius 150 km (covers the districts above and the Bhutan border)
- **Not done:** a list of every Northeast city in schema, or one page per town. Google treats both as spam (doorway pages), and they do not move local ranking. Local results depend mainly on distance, the Google profile and reviews. Clear facts on the page are what AI engines read and quote.
- On-page text (real HTML, quoted by AI answers):
  - "Coming from outside Bongaigaon" page: "Patients visit Medcare from across lower Assam and the Bodoland region, including Kokrajhar, Chirang, Dhubri, Goalpara and Barpeta, and from other Northeast states." + one-visit plan (consult + echo + Holter on the same day, reports explained before you leave, follow-up on WhatsApp).
  - Footer and contact line: "Patients come to us from Bongaigaon, Kokrajhar, Chirang, Dhubri, Goalpara, Barpeta and across the Northeast."
  - `llms.txt` and `entity-facts.md`: the same sentence.
- "Bhutan border towns": mentioned in words only if Dr. Das confirms; no Bhutan in schema (a different country, and no telemedicine).
- Travel facts for the outside-town page: [CONFIRM: nearest railway station (New Bongaigaon Junction) and bus stand, distance from clinic.]

## D. Services and money

**29. ★ Service page list** ✅ (approved 2 Oct 2026: 20 service pages)

| # | Page | Type | Badge |
|---|---|---|---|
| 1 | Diabetes care (Type 1, Type 2, other types) | Hub | diabetes |
| 2 | Diabetes in pregnancy (GDM) | Detail of 1 | gdm |
| 3 | Diabetic foot care | Detail of 1 | diabetic-foot |
| 4 | Continuous glucose monitoring (CGM), insulin and diet counselling | Detail of 1 | cgm |
| 5 | Obesity and weight management | Page | weight |
| 6 | Heart health (cardiac risk) | Hub | heart |
| 7 | High blood pressure | Detail of 6 | blood-pressure |
| 8 | Heart failure care | Detail of 6 | heart-failure |
| 9 | Echocardiography with strain imaging | Detail of 6 | echo |
| 10 | Holter monitoring (patch Holter) | Detail of 6 | holter |
| 11 | Thyroid disorders | Page | thyroid |
| 12 | Sleep apnea | Page | sleep |
| 13 | Asthma and COPD | Page | lungs |
| 14 | Internal medicine | Hub | internal-medicine |
| 15 | Fever and infections | Detail of 14 | fever |
| 16 | Fatty liver and liver disorders | Detail of 14 | liver |
| 17 | Joint pain and arthritis | Detail of 14 | joints |
| 18 | Migraine and headache | Detail of 14 | headache |
| 19 | Anaemia | Detail of 14 | anaemia |
| 20 | Preventive health check-ups | Page | checkup |

- Menu groups (mega menu, 4 columns + doctor card): Diabetes and weight (1 to 5) · Heart health (6 to 10) · Hormones, lungs and sleep (11 to 13) · Internal medicine and prevention (14 to 20).
- Home tabs: Diabetes and weight · Heart · Internal medicine · Thyroid, lungs and sleep · Check-ups.
- **Badges needed: 20** (one per service page, plus 1 doctor badge for menu headings). Brief in Part 3.4.
- Page count: 20 service + Home, About, Dr. Das profile, Plan your visit, Coming from outside Bongaigaon, Contact and Book, FAQs, Health Library, thank-you, 404 + 7 legal = **about 37 pages** + blog posts.

**30. In-house tests and facilities** ✅
All done at Medcare:
- Echocardiography with strain imaging
- Patch Holter (3 days, extendable)
- Continuous glucose monitoring (CGM)
- ECG
- Blood sugar finger-prick check
- HbA1c point-of-care test (result during the visit)
- Body composition analysis (weight, fat, muscle)
- Diabetic foot nerve and circulation check
- Spirometry (lung function test)
- 24-hour blood pressure monitoring (ABPM)
- Sleep study [CONFIRM: home kit, or overnight at the clinic? Default copy: "sleep study" without saying where.]

No lab (blood tests outside), no pharmacy.

Use:
- "Why Medcare" card: "Most heart, diabetes and lung tests in one place: ECG, echo, Holter, BP monitoring, HbA1c, spirometry and more."
- Each service page lists only the relevant in-house tests under "What happens at the clinic".
- Schema `availableService` (MedicalTest / MedicalProcedure) per test. No machine names anywhere.
- One-visit line for outside-town patients: "Consultation and most tests on the same day."

**Patient count (raised again)** ⛔ held
- "More than 10,000 patients treated" stays off the site. IMC 2002 rules (6.1, 6.3) do not allow patient numbers as promotion. We show experience as years, training and in-house tests instead. If Dr. Das insists, it needs his written instruction, logged here, and the agency flags the risk in the report.

**31. Packages / programmes** ✅
- **No packages.** No package names, inclusions or prices on the site.

**29b. Added page: GLP-1 weight-loss medicines** ✅ (compliant version, page 21)
- Page title: **"GLP-1 weight-loss medicines: doctor-led assessment and follow-up"**. URL `/services/glp-1-weight-loss-medicines/`. Sits under Diabetes and weight, linked from the Obesity page. Badge: `glp1`.
- The service is the **medical assessment and monitoring**, not the medicine. GLP-1 medicines are prescription-only (Schedule H), and obesity and diabetes are listed conditions under the DMR Act 1954, so the page educates and does not promote a drug.
- Must:
  - explain in plain words what GLP-1 medicines are and how they work (appetite, fullness, blood sugar)
  - say who may be considered and who should not take them (general, guideline-level)
  - "Dr. Das decides if a medicine is right for you after examining you and checking your tests. Many people do well with diet, activity and other care first."
  - common side effects and the need for follow-up (sugar, kidneys, digestion)
  - "When to see a doctor urgently" callout (severe stomach pain, persistent vomiting, signs of dehydration)
  - 6 to 8 FAQs ("Is it an injection?", "Do I have to take it for life?", "Is it safe with diabetes?")
  - reviewer box + sources (ICMR / RSSDI / ADA guidance)
- Never:
  - brand names (Ozempic, Wegovy, Rybelsus, Mounjaro or any other)
  - kg or % weight-loss promises, "quick", "easy", "guaranteed", "permanent"
  - before/after, prices, "available here", "we sell", or any purchase or dose talk
  - "weight-loss injection clinic" style naming
- Same rules for any blog post on the topic.
- Totals now: **21 service pages, 21 badges, about 38 pages.**

**32. Preventive check-ups** ✅
- Custom per patient (no fixed packages). Copy (Part 7.4): "Each check-up is planned by Dr. Das after he sees you, based on your age, health and family history, so no test is repeated or wasted. Blood tests are done at a lab of your choice; ECG, echo and other tests are done here."

**33. Fees and payment** ✅
- **No fees on the site.** FAQ answer: "Please call 60031 21297 for current consultation and test charges."
- **Payment: cash, UPI and cards.** Shown on Plan your visit and in schema `paymentAccepted: "Cash, UPI, Credit Card, Debit Card"`, `currenciesAccepted: "INR"`.

**34. Insurance and cashless** ✅
- **OPD: no insurance or cashless.** Itemised bills given; patients claim from their insurer themselves.
- **Hospital admission:** when admission is needed, the patient chooses the hospital from several options based on need and location. Medcare does not favour any one hospital. Insurance and cashless depend on the chosen hospital and the patient's policy.
- Copy (FAQ + Plan your visit):
  - "We do not offer cashless or insurance billing for clinic visits. We give you an itemised bill so you can claim from your insurer if your policy covers OPD care."
  - "If you need to be admitted, Dr. Das explains your options and you choose the hospital that suits your needs, location and insurance."
- No hospital names anywhere in this context (Part 6.3). Hospital names appear only on the profile as his own visiting roles (decision D1).

**35. Advance payment** ✅
- **None.** Patients pay at the clinic after the visit or test.
- Cancellation and Refund page: short version. "No advance payment is taken. If you cannot come, please call or WhatsApp us so we can offer your slot to someone else." Refund section covers only payments made at the clinic in error (e.g. double UPI payment): "refunded to the same method within 7 working days" [CONFIRM: 7 days OK?].

**38. Workshops / school programmes** ⛔ assumed none (no workshop form). Health camps or IMA/API talks can appear as a short "Community work" line on his profile if he wants.
- Echo, strain imaging, patch Holter and CGM confirmed in-house. Lab and pharmacy unknown.

## E. Brand assets
**39. ★ Logo** ✅ Received 3 Oct 2026 as a transparent PNG (2172 x 724): heart with figure and leaf, "Medcare" wordmark, tagline "Diabetes & Obesity Clinic" between two rules. No red cross. Spelling "Medcare" correct.
- No vector file. Windsurf redraws it as SVG (full, white, heart-mark) for approval in Phase 1. Trimmed PNG, white PNG and a rough heart-mark crop are in `brand/` for reference and fallback.

**40. Colours and fonts** ✅ **LOCKED** (3 Oct 2026). Source of truth: `medcare-styleguide.html` (`:root` tokens). Derived by Claude from the logo teal and the Oliva reference (deep slate Book button). Windsurf copies the values exactly and does not change them.

| Token | Value | Role |
|---|---|---|
| `--primary` | #00838F | Medcare teal: buttons, active tab, Book icon block (4.52:1 white text) |
| `--secondary` | #1E3D49 | Deep slate: Book label, footer, gradient end (11.55:1) |
| `--primary-500` | #007680 | Text-safe teal: links, eyebrows, icons, focus ring (5.38:1) |
| `--primary-700` | #006973 | Pressed state (6.43:1) |
| `--primary-100` | #D9F1F3 | Tabs, chips, icon tiles |
| `--primary-50` | #F1FAFB | Washes, section tints |
| `--aqua` | #2AD4D8 | Logo shine: glows and badge highlights only, never text |
| `--accent` | #F2A98B | Warm peach: glows and badge sparkles only, never text |
| `--ink` | #14303A | All text (13.87:1) |
| `--ink-2` | #4A6570 | Captions (6.20:1) |
| `--line` | #DCE9EC | Borders |
| `--alert` | #C8302A | Emergency only (5.37:1) |
| `--success` | #2F7D5B | Form success (4.99:1) |
| `--star` | #F2B233 | Google rating icon only |
| `--grad-brand` | #00838F to #1E3D49 | One gradient surface per viewport |

Fonts (fixed for every project): Figtree (all UI and text), Instrument Serif italic (one accent word per heading), Noto Sans Devanagari (only if Hindi or Bodo text appears). `next/font`, self-hosted, preload only Figtree.

**41. Badges** ⏳ 21 service badges + 1 doctor badge, made by the agency with the locked prompt in `IMAGE-RESOURCES-NEEDED.md` (deep teal #006973 to aqua #2AD4D8 strokes, peach #F2A98B sparkles, off-white #F7FBFB background).
**42 to 43. Photos** ⏳ Sent with the image resources (hero original, avatar, clinic exterior, signboard, reception, waiting area, consultation room, echo room).
- Social: Facebook https://www.facebook.com/profile.php?id=61551113781226 · Instagram https://www.instagram.com/medcarebongaigaon/ ✅ (Q55)

## F. Photos

| File | Size | Verdict |
|---|---|---|
| White shirt, arms crossed, stethoscope, certificates behind | 1065x1600 | **KEEP: hero candidate.** Strong pose. Below the 2000px target; usable at 4:5 up to about 560px wide. A sharper original from the photographer would help. Wall and blinds are busy; light retouch only with his approval. |
| Speaking at API Assam Chapter Mid Term CME | 1280x853 | **KEEP: "Talks and teaching" / About.** Strong E-E-A-T photo. |
| Infographic headshot (blazer) | cropped, low-res | REFERENCE only. Need the original file for the avatar. |
| Google AI Mode screenshot | | REFERENCE only (SEO evidence for the report) |
| 6 video stills (echo room) | 1024x576 | KEEP for the echo page and step tracker, after consent check |

Gaps: original hero files at full size · square avatar · clinic exterior and signboard · reception and waiting area · consultation room.

**42b. Signboard and photos** ✅ The signboard in the exterior photo shows older contact details (second phone, medcare.org.in). Dr. Das confirmed on 3 Oct 2026 there is no conflict; photos are used as they are, no blur. If the domain changes and the board is redone, those specific images are replaced.

**42a. AI-enhanced photos** ✅ Doctor photos were upscaled and enhanced with ChatGPT and **approved by Dr. Das** (confirmed by the agency, 3 Oct 2026). Disclosed on the Editorial Policy page. Mapping in `IMAGE-MAP.md`.

**44. ★ Consent** ✅ (re-confirmed 3 Oct 2026: written consent covers everyone in every photo used, including waiting patients in the opening-day photo; no face blurring needed)
- **Written consent on file** for everyone shown (patient on the echo couch, staff member at the reporting desk), with a payment made to them.
- Faces may be shown. No blur or crop needed for consent reasons.
- Rules that still apply:
  - Clinic keeps the signed forms; consent covers website + social use [CONFIRM: does the form name the website?]. If anyone withdraws, the image comes down within 7 days.
  - People in photos are never presented as patients giving a testimonial or result, and never captioned with a diagnosis ("a heart failure patient"). Captions describe the activity only ("Echo in progress").
  - Paid models/participants are not described as "our patients".
  - Logged in `public/images/_todo.md` as "consent: on file".
- Editorial Policy page mentions: "People shown in photos have given written consent."

**45. Images not to use** ⏳ ask with the image resources.

## G. Legal and privacy

**46. ★ Legal entity** ✅
- **Proprietorship of Dr. Tamoghna Das, trading as "Medcare Clinic".** Records only; "proprietorship" is never printed.
- Site line (footer, Privacy, Terms): "This website is run by Medcare Diabetes & Obesity Clinic, Chapaguri Road, opposite Domino's, North Bongaigaon, Gurunanak Nagar, Bongaigaon, Assam 783380, owned by Dr. Tamoghna Das."
- Data fiduciary under the DPDP Act: Dr. Tamoghna Das (as proprietor of Medcare).
- 🟡 The trade name on paper is "Medcare Clinic"; the brand is "Medcare Diabetes & Obesity Clinic". Fine for the site. Worth making the signboard, GBP and any registration match one name over time.
- [CONFIRM: Clinical Establishments registration number (Assam), if any. Optional; shown on the legal pages if given.]

**47. ★ Privacy contact** ✅ (default)
- **Dr. Tamoghna Das**, medcarebongaigaon@gmail.com, +91 60031 21297, at the clinic address.

**48. Processors** ✅
- Clinic: **no clinic software.** Paper files and manual records; **WhatsApp** (messages, reports shared by patients); **email** (Gmail); **Google Drive** (storage).
- Website (added by the agency): Vercel (hosting), Resend (form email), Cloudflare Turnstile (spam check), Google Analytics 4 (only after cookie consent), Vercel Speed Insights (cookieless).
- Privacy Policy wording (types, not a sales list): "We keep paper records at the clinic. We also use WhatsApp, email and secure cloud storage from well-known providers to talk with you and store reports. Some of these providers may store data outside India, under their own security and privacy terms."
- [CONFIRM: Do the patch Holter, CGM or echo machines upload data to the maker's online portal? If yes, the policy adds "device makers' secure portals". Default: added as "may", covering it either way.]
- Suggestion (not on the site): use a separate WhatsApp Business account and a clinic Google account with 2-step verification for patient data.

**49. Retention** ✅
- **Medical records: 3 years from the last visit** (IMC 2002, reg. 1.3.1 minimum). Longer if a legal case or complaint needs it.
- **Website enquiries with no visit: 12 months** (default; answer covered records only). Then deleted from email.
- Form emails that lead to a visit become part of the medical record (3 years).
- Analytics: GA4 retention set to 2 months, no personal or health data sent.

**50. Complaint and request times** ✅
- **Acknowledge within 24 hours. Resolve within 4 days.**
- Copy (Privacy Policy, Patient Rights): "We aim to acknowledge your complaint or request within 24 hours and to resolve it within 4 days. If a request needs more time, for example copies of older paper records, we will tell you why and when to expect it."
- Applies to: complaints, record copies, correction, deletion and consent withdrawal requests.

**51. Charter of Patients' Rights** ✅
- **Displayed, framed in the patient waiting lounge.**
- Patient Rights page line: "The Charter of Patients' Rights is displayed in our waiting area. You can also read it here." + link to the official Charter (NHRC / MoHFW).

**52. Policies "last updated"** ✅ default: the launch date (`legalLastUpdated` in site-config).

## H. Integrations and launch

**54. Google rating on the site** ✅ (aggregate only, free route)
- **Show the clinic's Google rating and review count**, e.g. "4.9 on Google · 320 reviews", as a small chip linking to the Google Maps listing.
- Free method (no monthly cost):
  - Google Places API (New), Place Details with field mask `rating,userRatingCount` only, called **server-side** and cached 24 hours (`revalidate: 86400`). About 30 calls a month, far inside Google's free monthly allowance for this request type. A Google Cloud billing account must exist on the project (Google requires it) but the bill stays ₹0. Set a budget alert at ₹100 and a quota cap of 100 requests/day as a safety net. [CONFIRM at setup: current free cap in the Cloud console.]
  - API key restricted to the Places API, kept server-side only (never in the browser).
  - Fallback: if the call fails or the key is missing, the chip is hidden (never a hard-coded number, which goes stale and misleads).
  - Attribution: "on Google" text + Google Maps link, as Google's terms require.
- Also free: the click-to-load map on Contact (Maps Embed API) shows Google's own place card with stars.
- Placement: Visit band card, Contact block and footer only. **Not** in the hero, not next to Dr. Das's photo or name (no per-doctor rating), no review text, no star graphics larger than the text.
- **No `AggregateRating` or `Review` schema** (Google does not allow it for a business's own reviews, and it breaks Part 6.3).
- Needs: the Google Place ID (Windsurf finds it from the Maps link) and a Google Cloud project, ideally under the clinic's Google account (Q56).

**54b. Rating: build-phase decision (overrides the method above until launch)** ✅
- **Now (preview build):** "See us on Google Maps" link to the GBP + a **manual** rating and count in `lib/site-config.ts`:
  `googleRating: { value: [CONFIRM: e.g. 4.9], count: [CONFIRM: e.g. 320], checkedOn: "YYYY-MM-DD", source: "manual" }`
- Rules for the manual numbers: copy the exact current figures from the Google profile (never round up); show only with the "on Google" link; `npm run launch-check` warns if `checkedOn` is older than 30 days.
- **At go-live:** switch `source` to `"places-api"` (the free daily method above). The component is built once in Phase 6 with both modes, so the switch is an env change, not a rebuild.
- [CONFIRM: current rating and review count from the GBP, with today's date.]

**56. Accounts and integrations** ✅
- **Build and approval phase:** no third-party accounts. The site runs on the temporary Vercel preview link (noindex).
- **After Dr. Das approves → go-live:** agency team creates and integrates: Google Cloud project (Places API for the rating), GA4, Search Console, Resend (with the new domain verified: SPF, DKIM, DMARC; MX untouched), Cloudflare Turnstile. Dr. Das's Gmail added as owner of GA4, Search Console and the Cloud project at launch.
- Build impact (Windsurf must build everything ready to switch on via env vars, nothing hard-wired):
  - Forms: full Server Action + Resend code. In preview with no `RESEND_API_KEY`: the form validates and shows the real success page, logs the payload server-side (no PII in logs beyond a masked phone), and a small dev-only banner says "Preview: form not emailed". Call and WhatsApp buttons work normally.
  - Turnstile: Cloudflare's public **test keys** (always pass) in preview; real keys at launch.
  - GA4: cookie banner and consent logic built and tested; no GA script loads while `NEXT_PUBLIC_GA_ID` is empty.
  - Places API: `GOOGLE_PLACES_KEY` empty → manual mode.
  - Go-live checklist lists every env var to fill.

**55. Social media** ✅ Facebook + Instagram (links above). Icons in the footer; `sameAs` in schema.

**57. Canonical host and launch date** ✅
- Canonical: **apex** (e.g. medcare….com), www → 301 to apex. Set in `NEXT_PUBLIC_SITE_URL` when the domain arrives.
- **No target dates.** Build ASAP, phase after phase, with fast reviews. Preview shown to Dr. Das when complete; live after his approval.

## I. Approvals (process items)

**58. ★ Dr. Das signs off his pages** ⏳ at preview review. His approval date becomes "Last reviewed" on every medical page and the reviewer box.
**59. ★ Legal review of the 7 legal pages** ⏳ at preview review ("approved as written" or his lawyer's edits).

---

## Decisions for the agency (not client questions)

- **D1. Hospital roles.** "Visiting Consultant, Swagat Hospital" and "Visiting Echocardiologist, Lower Assam Hospital" are true roles, but Part 6.3 forbids naming hospitals in a referral sense. Recommendation: list them once on the profile under "Current roles" (and `affiliation` in schema), and never in booking or "we refer to" copy. Your call.
- **D2. Brand split.** ✅ Decided: clinic-branded (Medcare), Dr. Das as owner and lead doctor. Schema: `MedicalClinic` (#clinic) with `founder` and `employee` = `Physician` (#dr-tamoghna-das). His profile page carries his own E-E-A-T. GBP rename target: "Medcare Diabetes & Obesity Clinic" (exact signboard name, no extra keywords).

---

## Questions to send Dr. Das (one WhatsApp, all optional except ★)

None of these block the build. Defaults are already in the content.

1. Echo training: JROP PG Diploma 2022 and IMMAST certificate 2023 are two separate courses (as in your WhatsApp list)?
2. "Diabetic Diet Counselling" certificate on your infographic: which body and year?
3. Does your IMMAST certificate itself say "accredited by the Royal College of Surgeons"? (We print only what the certificate says.)
4. MD subject as printed on the degree: "General Medicine" or "Medicine"?
5. Still Joint Secretary, Lower Assam Diabetes Society?
6. "Doctors AI": full name or website?
7. ESC, EACVI and Heart Failure Association: life memberships, or annual?
8. Links or DOIs for your other published papers (we list only what we can link).
9. Holidays (Bihu, Puja): open, short hours or closed?
10. Are you personally in OPD for all of 9 am to 8:30 pm (Sun to 3:30 pm)?
11. Is 98642 66191 (WhatsApp) a clinic phone or your personal number?
12. Any step at the clinic entrance? What parking is there?
13. Nearest railway station and bus stand, and distance to the clinic.
14. Do patients come from Bhutan border towns (OK to mention)?
15. Sleep study: home kit or overnight at the clinic?
16. Do the Holter, CGM or echo machines upload data to the maker's portal?
17. Does the photo consent form mention the website?
18. Assam Clinical Establishments registration number, if any.
19. Refund of mistaken payments within 7 working days: OK?
20. ★ Current Google rating and review count (agency can read it from the GBP).

## Status

```
INTAKE  COMPLETE · 59 items: 41 answered · 6 later (logo, colours, badges, 2 photo sets, images not to use) · 2 approvals at preview (58, 59) · 1 at launch (7 domain) · 9 not applicable or skipped (2 to 5, 36, 37, 38, 53)
        20 small confirms for Dr. Das (list above; defaults in place)
★ Open blockers: logo SVG approval (39) · domain (7, at launch) · Dr. Das page sign-off (58) · legal sign-off (59)
PHASE   Intake ✅ · Audit (light) ◻ · Content ◻ · Images ⏳ (waiting for photos and badges) · Palette and style guide ✅ locked · Preview ⏳ · P1 to P6 ◻ · Polish ◻ · SEO pass ◻ · Launch ◻
NEXT    Claude writes site-plan.md + new-website-content.md (no logo needed). Agency sends logo, photos, badges, GBP rating.
```
