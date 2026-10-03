# IMAGE-GUIDE · Medcare website

Final image plan. Every image is already renamed and sorted in `resources/images/_source/`. Crops, sizes, treatments and alt text are in `image-manifest.json` (machine-readable; the script reads it). This file explains where each image goes and why.

Approved: all doctor and clinic images were AI-enhanced from real photos and **approved by Dr. Das** (3 Oct 2026). Disclosed on the Editorial Policy page.

---

## 1. Where every image is used (page by page)

| Page | Section | Image |
|---|---|---|
| Home | Hero (desktop 2:3, LCP, preload) | `doctors/dr-das-hero.jpg` |
| Home | Hero (mobile 4:5) | `doctors/dr-das-hero-mobile.jpg` |
| Home | Hero doctor chip | `doctors/dr-das-avatar.jpg` |
| Home | 02 About Medcare | `clinic/clinic-consultation-room.jpg` (glass labels on blinds and cabinet, off the face) |
| Home | 04 Step 1 Book | no photo: code-built phone mock-up showing the booking form and a WhatsApp chat with "Medcare" (no real names) |
| Home | 04 Step 2 Arrive and register | `clinic/clinic-reception.jpg` |
| Home | 04 Step 3 Consultation | `doctors/dr-das-consultation.jpg` |
| Home | 04 Step 4 Tests if needed | `clinic/echo-screen.jpg` |
| Home | 04 Step 5 Your plan | `doctors/dr-das-writing-plan.jpg` |
| Home | 04 Step 6 Follow-up | no photo: code-built phone mock-up of a WhatsApp chat ("Report received, Dr. Das will review it") |
| Home | Visit band (desktop only) | `clinic/clinic-exterior-wide.jpg` |
| Home | 05 Meet your doctor card | `doctors/dr-das-portrait.jpg` |
| Home | Contact block photo card | `clinic/clinic-exterior.jpg` |
| Home | 08 Health Library cards | designed covers (gradient + badge), no photos |
| About | Header | `clinic/clinic-consultation-room.jpg` |
| About | Why Medcare was started | `doctors/dr-das-api-cme-talk.jpg` |
| About | Timeline card "September 2023, Medcare opens" | `clinic/clinic-opening-day.jpg` |
| About | How we work | `doctors/dr-das-consultation.jpg` |
| Dr. Tamoghna Das | Split hero | `doctors/dr-das-hero.jpg` |
| Dr. Tamoghna Das | How Dr. Das works | `doctors/dr-das-consultation-3x2.jpg` |
| Dr. Tamoghna Das | Education and training (side) | `clinic/clinic-door-sign.jpg` |
| Dr. Tamoghna Das | Certifications and roles (banner + photo) | `clinic/dr-das-awards-shelf.jpg` (behind white 88% overlay) + `doctors/dr-das-plaques.jpg` |
| Dr. Tamoghna Das | Talks and teaching | `doctors/dr-das-api-cme-talk.jpg` |
| Plan your visit | Hero | `clinic/clinic-exterior.jpg` |
| Plan your visit | Booking | `clinic/clinic-reception.jpg` |
| Plan your visit | Your consultation | `clinic/clinic-door-sign.jpg` |
| Coming from outside Bongaigaon | Header | `clinic/clinic-exterior.jpg` |
| Contact | Photo card behind the info cards | `clinic/clinic-exterior.jpg` |
| Echocardiography | What echo can show | `clinic/echo-screen.jpg` |
| Echocardiography | Inside our echo room (silent loop) | `video/echo-room-loop.mp4` + `video/echo-room-poster.jpg` |
| Echocardiography | What happens during the test | `clinic/clinic-exam-room.jpg` |
| Holter monitoring | What happens at Medcare | `clinic/clinic-exam-room.jpg` |
| Heart health hub | Beside the sub-page cards | `clinic/echo-screen.jpg` |
| Patient Rights | Privacy and confidentiality | `clinic/clinic-exam-room.jpg` |
| Health Library post (echo) | Inline figure | `clinic/echo-screen.jpg` |
| Every medical page | Reviewer box | `doctors/dr-das-avatar.jpg` |
| Header mega menus | Doctor card | `doctors/dr-das-avatar.jpg` |
| All other service pages | Hero | the service badge (SVG/PNG set, coming next), no photo |
| Social share | Default OG image | generated: `dr-das-portrait.jpg` + logo + page title on the brand gradient |

Rule: no photo appears twice on the same page, and adjacent sections never repeat a photo.

## 2. Files

| File in `_source/` | Notes |
|---|---|
| `doctors/dr-das-hero.png` | 793 px wide: never upscale. 2:3 desktop, 4:5 mobile and card |
| `doctors/dr-das-avatar.png` | Square headshot |
| `doctors/dr-das-consultation.png` | Patient seen from behind only |
| `doctors/dr-das-writing-plan.png` | Already cleaned by Claude (drug-company leaflets cropped and blurred) |
| `doctors/dr-das-api-cme-talk.jpg` | Real, unedited photo |
| `doctors/dr-das-plaques-rssdi-hepatocon.png` | |
| `clinic/clinic-consultation-room.png` | Already cleaned by Claude (branded desk mat cropped, brochures softened) |
| `clinic/echo-screen.png` | **Already redacted by Claude** (patient name, scan dates, machine brand and model removed). The unredacted original must never enter the project |
| `clinic/dr-das-awards-shelf.png` | Crop removes the row with drug-company items |
| `clinic/clinic-exterior.png` | Crop removes the neighbouring press sign. Older contact details on the board are confirmed fine by Dr. Das: no blur |
| `clinic/clinic-reception.png` | Real wall sign uses the older green logo; leave as is |
| `clinic/clinic-exam-room.png` | No people |
| `clinic/clinic-door-sign.png` | |
| `clinic/clinic-opening-day.png` | Consent confirmed for everyone shown: no blur |
| `video/echo-room-loop.mp4` | 10 s, 960 px, no audio, 1.3 MB |
| `brand/medcare-logo.png`, `medcare-logo-white.png`, `medcare-mark-rough.png` | Reference for the SVG redraw |
| `_backup/dr-das-portrait-original.jpg` | Not used |
| `_backup/clinic-entrance-lobby.png` | Not used: shows the tie-up pharmacy counter, which the site does not mention |
| `evidence/cert-*.png` | AI-upscaled certificates. Facts only. **Never copy to `public/`** |

Not in the pack (rejected): drug-company brochure photo (brand names), and one duplicate of the consultation photo.

## 3. Rules
- No drug, device or machine brand names readable anywhere. No patient names, reports or screens with patient data.
- People shown have written consent (Q44). Patients appear only from behind or blurred, and never with a diagnosis in the caption.
- Faces never sit under glass labels or text.
- Metadata: strip EXIF, GPS, camera and software tags in all website outputs. Keep the approved originals in `_source/` untouched (including any C2PA content credentials). The web versions are new files and will not carry them; that is expected.

## 4. Gaps (fine to launch without)
No photos yet of ECG, Holter patch, CGM sensor, spirometry, body composition, foot check, BP monitor or a team photo. Those pages use their service badge as the hero, which is the plan anyway. Photos can be added after launch.

## 5. Decisions (3 Oct 2026)
- The pharmacy in the shopfront is a tie-up, not Medcare's own. It is never named, shown as a feature or suggested on the site. Photos where it appears in the background (exterior, opening day) are fine; the lobby photo centred on the counter is not used. When Medcare opens its own pharmacy or lab, they become services and new photos can be added.
- Signboard contact details are older but confirmed fine; images used as they are.
- Consent covers every person in every published photo.

## 6. Service badges (complete: 21 services + 1 doctor badge)

Already processed by Claude: cut out inside the original ring, transparent background, centred with 12% padding, 512 and 256 px, PNG and WebP, in `resources/images/icons/services/` (88 files). Originals in `_source/icons/services-original/` (not published). **The ring is drawn in CSS** (2 to 3 px `--primary`, orbit-ring hover outside it), so all badges match. Copy unchanged to `public/images/icons/services/`. Do not re-process.

| Badge | Page it leads (hero `lg`) | Also used on |
|---|---|---|
| `diabetes` | Diabetes care | Home tab "Diabetes and weight" · All services · cover of post "HbA1c explained" |
| `gdm` | Diabetes in pregnancy | Diabetes hub card · All services · related |
| `diabetic-foot` | Diabetic foot care | Diabetes hub card · All services · related |
| `cgm` | CGM, insulin and diet counselling | Diabetes hub card · All services · related |
| `weight` | Obesity and weight management | Home tab · All services · related on Fatty liver |
| `glp1` | GLP-1 weight-loss medicines | Weight hub card · All services |
| `heart` | Heart health | Home tab "Heart" · All services |
| `blood-pressure` | High blood pressure | Heart hub card · All services · related on Sleep apnea |
| `heart-failure` | Heart failure care | Heart hub card · All services |
| `echo` | Echocardiography | Heart hub card · All services · cover of post on echo |
| `holter` | Holter monitoring | Heart hub card · All services · related on Echo |
| `thyroid` | Thyroid disorders | Home tab "Thyroid, lungs and sleep" · All services |
| `sleep` | Sleep apnea | Home tab · All services · cover of post on snoring |
| `lungs` | Asthma and COPD | Home tab · All services |
| `internal-medicine` | Internal medicine | Home tab "Internal medicine" first card · All services |
| `fever` | Fever and infections | Internal medicine hub card · All services |
| `liver` | Fatty liver | Internal medicine hub card · All services |
| `joints` | Joint pain and arthritis | Internal medicine hub card · All services |
| `headache` | Migraine and headache | Internal medicine hub card · All services |
| `anaemia` | Anaemia | Internal medicine hub card · All services |
| `checkup` | Preventive health check-ups | Home tab "Check-ups" · All services · footer CTA band (optional) |
| `doctor` | none (menu only) | Mega menu column headings and the "Specialist-led care" row in Home 02. **Never replaces Dr. Das's real photo** |

Sizes: `lg` 160 px (512 file), `md` 112 px (512 file for 2x), `sm` 56 px (256 file). Alt `""` (title is always visible next to it).
Home "Find care by concern" pills and the conditions marquee use small line icons, not badges.

`lib/service-badges.ts`:
```ts
export const serviceBadges = {
  "/diabetes-care/": "diabetes",
  "/diabetes-care/diabetes-in-pregnancy/": "gdm",
  "/diabetes-care/diabetic-foot-care/": "diabetic-foot",
  "/diabetes-care/continuous-glucose-monitoring/": "cgm",
  "/weight-management/": "weight",
  "/weight-management/glp-1-medicines/": "glp1",
  "/heart-health/": "heart",
  "/heart-health/high-blood-pressure/": "blood-pressure",
  "/heart-health/heart-failure/": "heart-failure",
  "/heart-health/echocardiography/": "echo",
  "/heart-health/holter-monitoring/": "holter",
  "/thyroid-disorders/": "thyroid",
  "/sleep-apnea/": "sleep",
  "/asthma-copd/": "lungs",
  "/internal-medicine/": "internal-medicine",
  "/internal-medicine/fever-and-infections/": "fever",
  "/internal-medicine/fatty-liver/": "liver",
  "/internal-medicine/joint-pain-arthritis/": "joints",
  "/internal-medicine/migraine-headache/": "headache",
  "/internal-medicine/anaemia/": "anaemia",
  "/health-check-ups/": "checkup",
} as const;
export const doctorBadge = "doctor";
```
Every service has its own badge, so no two cards anywhere share one. Add a Playwright check that adjacent cards never repeat a badge.
