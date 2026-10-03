# Site plan · Medcare Diabetes & Obesity Clinic, Bongaigaon

Version 1 · 2 October 2026 · Prepared by Automize Media Labs for review by Dr. Tamoghna Das
Source of facts: `client-answers.md`. Anything not confirmed there is marked `[CONFIRM: ...]`.

---

## 1. Positioning in one line

Medcare is a physician-led clinic in North Bongaigaon where one doctor, Dr. Tamoghna Das (MD Medicine, with advanced training in echocardiography), looks after diabetes, weight, heart health, thyroid, lung and sleep problems, with most tests done under the same roof on the same day.

Entity statement (used word for word in About, `llms.txt`, `entity-facts.md` and the Google profile description):

> Medcare Diabetes & Obesity Clinic is an outpatient clinic on Chapaguri Road, North Bongaigaon, Assam, founded in September 2023 by Dr. Tamoghna Das, MBBS, MD (Medicine), a consultant physician in internal medicine, diabetes and heart health with advanced training in echocardiography. The clinic offers consultations, echocardiography with strain imaging, ECG, patch Holter monitoring, 24-hour blood pressure monitoring, continuous glucose monitoring, HbA1c testing, spirometry, body composition analysis, diabetic foot checks and sleep studies. It is open Monday to Saturday from 9 am to 8:30 pm and Sunday from 9 am to 3:30 pm. Patients come from Bongaigaon, Chirang, Kokrajhar, Dhubri, Goalpara, Barpeta and other parts of Northeast India.

---

## 2. Page list and URLs (39 pages + Health Library posts)

`trailingSlash: true`. All URLs lowercase, hyphenated. No dates in URLs.

### Core (10 + 404)

| # | Page | URL | H1 | Main search intent |
|---|---|---|---|---|
| 1 | Home | `/` | Diabetes, heart and weight care in *Bongaigaon* | diabetes doctor Bongaigaon, physician Bongaigaon |
| 2 | About Medcare | `/about/` | About *Medcare* | Medcare clinic Bongaigaon |
| 3 | Dr. Tamoghna Das | `/dr-tamoghna-das/` | Dr. Tamoghna Das, *MD Medicine* | Dr Tamoghna Das, cardio-diabetic consultant Bongaigaon |
| 4 | All services | `/services/` | Conditions we look after and *tests* we do | services, tests at Medcare |
| 5 | Plan your visit | `/plan-your-visit/` | Plan your *visit* | Medcare timings, what to bring |
| 6 | Coming from outside Bongaigaon | `/coming-from-outside-bongaigaon/` | Coming to Medcare from outside *Bongaigaon* | diabetes doctor Kokrajhar / Dhubri / Chirang |
| 7 | Contact and book | `/contact/` (form anchor `#book`) | Book an appointment or *contact* us | Medcare phone number, book appointment |
| 8 | FAQs | `/faqs/` | Questions patients *often* ask | |
| 9 | Health Library | `/health-library/` | Health *Library* | |
| 10 | Thank you (noindex) | `/thank-you/` | Thank you, we have your *request* | |
| 11 | 404 | | We could not find that *page* | |

### Services (21)

| # | Page | URL | Parent | Badge | Primary query |
|---|---|---|---|---|---|
| 12 | Diabetes care | `/diabetes-care/` | Hub | diabetes | diabetes specialist Bongaigaon, sugar doctor |
| 13 | Diabetes in pregnancy | `/diabetes-care/diabetes-in-pregnancy/` | 12 | gdm | gestational diabetes Bongaigaon |
| 14 | Diabetic foot care | `/diabetes-care/diabetic-foot-care/` | 12 | diabetic-foot | diabetic foot care, foot wound diabetes |
| 15 | Continuous glucose monitoring, insulin and diet counselling | `/diabetes-care/continuous-glucose-monitoring/` | 12 | cgm | CGM Bongaigaon, insulin counselling |
| 16 | Obesity and weight management | `/weight-management/` | Hub | weight | obesity doctor, weight loss doctor Bongaigaon |
| 17 | GLP-1 weight-loss medicines | `/weight-management/glp-1-medicines/` | 16 | glp1 | GLP-1 doctor, weight loss injection advice |
| 18 | Heart health | `/heart-health/` | Hub | heart | heart check-up Bongaigaon, cardio-diabetic |
| 19 | High blood pressure | `/heart-health/high-blood-pressure/` | 18 | blood-pressure | BP doctor, hypertension treatment |
| 20 | Heart failure care | `/heart-health/heart-failure/` | 18 | heart-failure | heart failure, breathlessness swelling legs |
| 21 | Echocardiography with strain imaging | `/heart-health/echocardiography/` | 18 | echo | echo test Bongaigaon, 2D echo, strain echo |
| 22 | Holter monitoring | `/heart-health/holter-monitoring/` | 18 | holter | Holter test Bongaigaon, palpitations test |
| 23 | Thyroid disorders | `/thyroid-disorders/` | Page | thyroid | thyroid doctor Bongaigaon |
| 24 | Sleep apnea | `/sleep-apnea/` | Page | sleep | snoring, sleep apnea test |
| 25 | Asthma and COPD | `/asthma-copd/` | Page | lungs | asthma doctor, spirometry, COPD |
| 26 | Internal medicine | `/internal-medicine/` | Hub | internal-medicine | MD medicine doctor Bongaigaon, physician |
| 27 | Fever and infections | `/internal-medicine/fever-and-infections/` | 26 | fever | fever doctor, dengue, typhoid, malaria |
| 28 | Fatty liver | `/internal-medicine/fatty-liver/` | 26 | liver | fatty liver treatment |
| 29 | Joint pain and arthritis | `/internal-medicine/joint-pain-arthritis/` | 26 | joints | joint pain doctor, arthritis, uric acid |
| 30 | Migraine and headache | `/internal-medicine/migraine-headache/` | 26 | headache | migraine doctor |
| 31 | Anaemia | `/internal-medicine/anaemia/` | 26 | anaemia | low haemoglobin, anaemia |
| 32 | Preventive health check-ups | `/health-check-ups/` | Page | checkup | full body check-up Bongaigaon |

Note: this URL set replaces the working URL `/services/glp-1-weight-loss-medicines/` mentioned in `client-answers.md`.

### Legal and trust (7)

| # | Page | URL |
|---|---|---|
| 33 | Privacy Policy | `/privacy-policy/` |
| 34 | Terms of Use | `/terms-of-use/` |
| 35 | Medical Disclaimer | `/medical-disclaimer/` |
| 36 | Editorial and Medical Review Policy | `/editorial-policy/` |
| 37 | Patient Rights and Responsibilities | `/patient-rights/` |
| 38 | Appointments, Cancellation and Refund | `/appointments-cancellation-refund/` |
| 39 | Accessibility Statement | `/accessibility/` |

### Health Library at launch (3 posts)

| Slug | Title | Links to |
|---|---|---|
| `/health-library/hba1c-explained/` | HbA1c explained: what your 3-month sugar number means | Diabetes care, CGM |
| `/health-library/echo-for-people-with-diabetes/` | Why people with diabetes or high BP may need an echo | Echocardiography, Heart failure |
| `/health-library/snoring-and-sleep-apnea/` | Loud snoring and daytime sleepiness: when to think of sleep apnea | Sleep apnea, High BP |

Plan after launch: 2 doctor-reviewed posts a month (topic list in section 10).

---

## 3. Navigation

### Utility bar (desktop)
Left: Plan your visit · Health Library
Right: clock icon "Mon to Sat 9 am to 8:30 pm · Sun 9 am to 3:30 pm" · phone "60031 21297" · red "Medical emergency? Call 108 or 112" · A / A+

### Header
Logo · Diabetes and weight ▾ · Heart health ▾ · More care ▾ · Dr. Das · About · Book Appointment (two-part button)

### Mega menu panels

**Diabetes and weight** (3 columns + doctor card)
- Diabetes: Diabetes care · Diabetes in pregnancy · Diabetic foot care · CGM, insulin and diet counselling
- Weight: Obesity and weight management · GLP-1 weight-loss medicines
- Tests: HbA1c · Body composition · Foot nerve and circulation check (links to the relevant page sections)
- Doctor card: Dr. Tamoghna Das · MD Medicine · View profile

**Heart health** (2 columns + doctor card)
- Care: Heart health overview · High blood pressure · Heart failure care
- Tests: Echocardiography with strain imaging · Holter monitoring · ECG · 24-hour BP monitoring

**More care** (3 columns + doctor card)
- Hormones, lungs and sleep: Thyroid disorders · Asthma and COPD · Sleep apnea
- Internal medicine: Overview · Fever and infections · Fatty liver · Joint pain and arthritis · Migraine and headache · Anaemia
- Prevention: Preventive health check-ups

### Mobile menu (accordion, all closed)
Diabetes and weight · Heart health · Hormones, lungs and sleep · Internal medicine · Check-ups · Dr. Tamoghna Das · About Medcare · Plan your visit · Coming from outside Bongaigaon · Health Library · FAQs · Contact
Fixed footer: Book · Call · "Open today: 9 am to 8:30 pm" (Sunday: "9 am to 3:30 pm")

### Mobile action bar
Book Now · Call Now (sheet with one number: 60031 21297) · WhatsApp (98642 66191, pre-filled)

WhatsApp pre-fill pattern: "Hello Medcare, I would like to book a visit about [page title]. My name is "

### Footer
- Logo + one line: "Physician-led care for diabetes, weight, heart health and more, in North Bongaigaon since 2023."
- Address (3 lines), Get directions
- Hours: Mon to Sat 9 am to 8:30 pm · Sun 9 am to 3:30 pm
- Call 60031 21297 · WhatsApp 98642 66191 · medcarebongaigaon@gmail.com (obfuscated)
- Google chip: "[rating] on Google · [count] reviews" + "See us on Google Maps"
- Columns: Diabetes and weight · Heart health · More care · Patient information (Plan your visit, Coming from outside Bongaigaon, FAQs, Health Library, Contact) · Legal (7) + Cookie settings
- Catchment line: "Patients come to us from Bongaigaon, Kokrajhar, Chirang, Dhubri, Goalpara, Barpeta and across the Northeast."
- Social: Facebook, Instagram
- Bottom: "© [year] Medcare Diabetes & Obesity Clinic, Bongaigaon. This website is run by Medcare, owned by Dr. Tamoghna Das. The information here is for general education and is not a substitute for a consultation. Registration: Assam Council of Medical Registration No. 20276."

---

## 4. Global copy blocks (reuse exactly)

**Emergency line:** Medical emergency? Call 108 or 112.

**Emergency callout (symptom pages):**
> **When to get help straight away.** Call 108 or 112, or go to the nearest hospital emergency, if you have chest pain or pressure, sudden breathlessness, fainting, weakness or numbness on one side of the body, slurred speech, confusion, or a seizure. Do not wait for a clinic appointment.

**Reviewer box:**
> Medically reviewed by **Dr. Tamoghna Das**, MBBS, MD (Medicine) · Assam Council of Medical Registration No. 20276 · Last reviewed [date set at sign-off]
> This page explains general care at Medcare. It does not replace a consultation. Read our [editorial policy](/editorial-policy/).

**CTA band:**
> Ready to talk to a *doctor*?
> Book a visit, call 60031 21297 or message us on WhatsApp. We confirm most requests within 30 to 60 minutes during clinic hours.
> [Book Appointment] [Call] [WhatsApp]

**Form consent line (checkbox, unticked):**
> I agree that Medcare may use these details to contact me about my appointment, as explained in the [Privacy Policy](/privacy-policy/).

**Under the form:**
> Please do not include detailed medical information here. You can share it with Dr. Das at your visit.

**Generic test line:** Dr. Das decides which tests you need after he has examined you, so you only do the tests that help.

**Blood tests line:** If you need blood tests, Dr. Das tells you which ones and why. You can get them done at a lab of your choice and bring or WhatsApp the reports.

**Medicines:** Medcare does not sell medicines. You are free to buy prescribed medicines at any licensed pharmacy you choose. (Do not mention any pharmacy by name or suggest one; see client-answers Q23.)

---

## 5. Writing rules applied in every page

- Plain English for a 60-year-old patient and a worried family member. Short sentences. "We" and "you".
- Every medical term explained the first time (e.g. "HbA1c, a blood test that shows your average sugar over about 3 months").
- Answer-first: every page opens with 2 to 3 sentences that answer "what is it, who is it for, what happens at Medcare".
- "At a glance" fact box near the top of each service page (AEO: short, quotable facts).
- One question-style H2 where it matches a real search ("What is gestational diabetes?"), otherwise statement headings. Sentence case.
- FAQs 5 to 8 per service page, answers 40 to 80 words, written as complete standalone answers.
- No em or en dashes. Ranges use "to".
- No: best, leading, top, No. 1, world-class, guaranteed, cure, permanent, reverse, 100%, state-of-the-art, comprehensive, holistic, seamless, tailored, peace of mind.
- No patient numbers, testimonials, review quotes, prices, drug or brand names, machine models, hospital names.
- Local names used where helpful: "sugar" (diabetes), "BP" (blood pressure), "pressure" in everyday speech.
- Numbers and cut-offs follow Indian guidance where it differs (e.g. Asian BMI cut-offs; DIPSI test for pregnancy).

---

## 6. Internal linking

- Every service detail links up to its hub, sideways to 2 related services, and to 1 or 2 Health Library posts.
- Hubs link down to every child page with a glass card.
- Every page ends with the CTA band; Book button carries the page as booking reason (`lib/booking-context.ts`).
- Dr. Das's profile links to every hub. Every service page's reviewer box links to the profile.
- "Coming from outside Bongaigaon" is linked from Contact, Plan your visit and the footer catchment line.

Booking reason dropdown (form): Diabetes or high sugar · Diabetes in pregnancy · Diabetic foot problem · CGM or insulin advice · Weight concerns · GLP-1 medicine advice · Blood pressure · Heart symptoms or heart failure · Echocardiography · Holter monitoring · Thyroid · Asthma or COPD · Snoring or sleep problems · Fever or infection · Fatty liver · Joint pain · Headache or migraine · Anaemia · Health check-up · Other

---

## 7. Schema plan (one `@graph` per page)

| Page | Types |
|---|---|
| All | `WebSite` (#website, inLanguage en-IN), `MedicalClinic` (#clinic), `Physician` (#dr-tamoghna-das), `BreadcrumbList` |
| Home | + `MedicalWebPage`, `FAQPage` |
| Dr. Das | + `ProfilePage` with `mainEntity` = #dr-tamoghna-das |
| Service pages | + `MedicalWebPage` (about = `MedicalCondition` or `MedicalTest`, `reviewedBy` #dr-tamoghna-das, `lastReviewed`), `FAQPage` |
| Test pages (echo, Holter) | `about` = `MedicalTest` / `DiagnosticProcedure` |
| Posts | `BlogPosting` (author + reviewedBy #dr-tamoghna-das, datePublished, dateModified), `FAQPage` |
| Contact | `ContactPage` |

`MedicalClinic` (#clinic):
- name "Medcare Diabetes & Obesity Clinic", alternateName "Medcare", "Medcare Clinic Bongaigaon"
- address as in `client-answers.md` Q21; geo from the Maps pin
- telephone +91-6003121297; email medcarebongaigaon@gmail.com; `openingHoursSpecification` Mo-Sa 09:00-20:30, Su 09:00-15:30
- foundingDate 2023-09; founder #dr-tamoghna-das; employee #dr-tamoghna-das
- medicalSpecialty: Endocrine, Cardiovascular, Pulmonary, Obesity (schema.org enumerations available), plus `knowsAbout` text list
- availableService: the 11 in-house tests as `MedicalTest`
- paymentAccepted "Cash, UPI, Credit Card, Debit Card"; currenciesAccepted INR
- amenityFeature: Ground floor access, Wheelchair available
- areaServed: 3 tiers + GeoCircle 150 km (Q28)
- sameAs: Google Maps URL, Facebook, Instagram
- no AggregateRating, no Review

`Physician` (#dr-tamoghna-das):
- name "Dr. Tamoghna Das", honorificSuffix "MBBS, MD"
- medicalSpecialty: Internal medicine (as text), Endocrine, Cardiovascular
- alumniOf: Gauhati Medical College and Hospital; JROP Institute; IMMAST; Parul University
- hasCredential: each qualification (`EducationalOccupationalCredential`), registration (`credentialCategory` "Medical registration", recognizedBy Assam Council of Medical Registration, identifier 20276)
- memberOf: the 11 bodies
- award: COVID-19 service award, Rangiya Division, 2021
- knowsLanguage: en, as, bn, brx, hi
- worksFor #clinic; affiliation (decision D1)
- subjectOf: the Indian Heart Journal 2025 article (`ScholarlyArticle`)

---

## 8. Home page section copy map

See `01-core-pages.md` for the full copy. Order: Hero · Find care by concern · 01 Why Medcare · 02 About Medcare · 03 How we can help (tabs) · 04 Your first visit, step by step · Visit band · 05 Meet your doctor · 06 Watch (hidden at launch) · 07 Conditions we look after (marquee) · 08 From our Health Library · 09 Quick answers · Contact block · CTA band.

---

## 9. GEO and AEO notes

- `llms.txt`: entity statement + page list with one-line summaries. `llms-full.txt`: all page text.
- Every service page's first paragraph names Medcare, Bongaigaon and Dr. Das in one natural sentence (entity linking for AI answers).
- "At a glance" boxes are plain HTML lists (not images).
- FAQ text in initial HTML (no client-only rendering).
- Same NAP and hours on every page, in schema, in `entity-facts.md` and on the Google profile.

---

## 10. Health Library topic list (year one, 24 topics)

Diabetes and weight: Prediabetes: the window to act · Sugar testing at home: when and how · Low sugar (hypoglycaemia): signs and what to do · Diabetes and kidney checks · Diabetes and eye checks · Rice, roti and diabetes: building a plate in Assam · Festivals and fasting with diabetes (Bihu, Durga Puja, Ramadan) · Waist size and Asian BMI · GLP-1 medicines: common questions
Heart: What your ECG can and cannot show · Palpitations: when to worry · Home BP checking the right way · Salt, pickles and blood pressure · Breathlessness in older adults
Hormones, lungs and sleep: Thyroid tests explained (TSH, T3, T4) · Thyroid in pregnancy · Inhalers: how to use them well · Air pollution, smoke and COPD
General medicine: Monsoon fevers in Assam: dengue, malaria, scrub typhus · Fatty liver: why the name changed · Uric acid and gout · Iron-deficiency anaemia in women · Migraine triggers diary · Annual check-up after 40: what is worth doing

---

## 11. Design system (locked 3 Oct 2026)

- Visual source of truth: `medcare-styleguide.html`. Its `:root` tokens are final and are copied exactly into `app/globals.css` and the Tailwind v4 `@theme`.
- Palette: Medcare teal #00838F, deep slate #1E3D49, text-safe teal #007680, tints #D9F1F3 and #F1FAFB, ink #14303A and #4A6570, line #DCE9EC, decorative aqua #2AD4D8 and peach #F2A98B (never text), alert #C8302A, success #2F7D5B. Brand gradient #00838F to #1E3D49.
- Fonts: Figtree, Instrument Serif italic (one accent word per heading), Noto Sans Devanagari (only if Hindi or Bodo appears).
- Logo: supplied PNG; SVG redraw approved in Phase 1. Files in `resources/images/brand/`.
- Hero: one doctor, one large portrait card. No fan.
- Service cards (decided 3 Oct 2026, overrides master Part 4.6 arch card): no arch, box or card behind the badge. The badge floats on the section wash with a soft round glow (no edges), then the title with a small gradient arrow and one line. Hover keeps the orbit ring, lift, coin flip and sheen; the arrow slides.
