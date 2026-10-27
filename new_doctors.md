Add a new "Visiting doctors" page to the Medcare website (Next.js) for specialists from Yashoda Hospitals, Hyderabad who hold clinics at Medcare on set dates. Keep the current Medcare design: reuse the existing colours, fonts, buttons, cards, spacing, badges and focus styles. Don't add new brand colours, a UI library or any third-party script. Don't use the Yashoda Hospitals logo anywhere; name the hospital in text only.

These doctors are NOT part of the online booking system (the /book/ slot booking is only for Dr. Tamoghna Das). Don't add them to the booking form, its "Reason for visit" options or the Apps Script. Their cards have ONE booking button: a phone call to 93651 75235. No WhatsApp button on their cards, and don't change the site-wide WhatsApp message or any existing WhatsApp button.

FILES
I will put these files in `resources/visiting-doctors/` (copy them, don't edit them):
- dr-naresh-lalam.webp, dr-naresh-lalam.jpg (headshot, 480 x 480)
- dr-naresh-lalam-poster.webp (1200 x 1200), dr-naresh-lalam-poster-640w.webp, dr-naresh-lalam-poster.jpg (1600 x 1600)
- dr-tajuddin-farooqui.webp, dr-tajuddin-farooqui.jpg (headshot, 480 x 480)
- dr-tajuddin-farooqui-poster.webp (1200 x 1200), dr-tajuddin-farooqui-poster-640w.webp, dr-tajuddin-farooqui-poster.jpg (1600 x 1600)
Copy them into public/images/visiting-doctors/.

1. SEARCH FIRST
Before editing, search the WHOLE repo (outside the read-only resources/ folder) for: the site config that holds the phone numbers (60031 21297 and 93651 75235) and any `tel:` helper; the header top bar ("Plan your visit", "Health Library"); the footer "Patient information" list; the homepage sections (section numbering like "05 Meet Dr. Tamoghna Das"); lib/schema.ts; lib/llms.ts (llms.txt + llms-full.txt); docs/entity-facts.md; the sitemap; and how existing pages set metadata/canonical. Reuse the existing 93651 75235 value from config; don't hard-code the number twice.

2. DATA FILE (single source of truth)
Create lib/visiting-doctors.ts with a typed array. Adding a future visit should only need a new entry or a new date here.

```ts
export type VisitingDoctor = {
  slug: string;
  name: string;            // "Dr. Naresh Lalam"
  specialty: string;       // "Orthopedics"
  title: string;           // "Consultant Orthopedics"
  hospital: string;        // "Yashoda Hospitals, Hitec City, Hyderabad"
  conditions: string[];
  photo: string;           // /images/visiting-doctors/....webp
  photoFallback: string;   // .jpg
  poster: string;          // 1200w webp
  posterSmall: string;     // 640w webp
  posterFallback: string;  // jpg
  visits: string[];        // "YYYY-MM-DD", any order
};
```

Entries:

Dr. Naresh Lalam
- specialty: Orthopedics. title: Consultant Orthopedics. hospital: Yashoda Hospitals, Hitec City, Hyderabad
- conditions: "Musculoskeletal injuries (fractures, sprains, strains)", "Joint problems (arthritis, joint replacements)", "Spinal disorders (herniated discs, scoliosis)"
- visits: ["2026-10-27"]

Dr. Tajuddin Farooqui
- specialty: Gastroenterology. title: Consultant Gastroenterologist. hospital: Yashoda Hospitals, Hitec City, Hyderabad
- conditions: "Gastroesophageal reflux disease (GERD)", "Inflammatory bowel disease", "Liver diseases", "Pancreatic diseases", "Hemorrhoids (piles)", "Stomach cancer and colon cancer"
- visits: ["2026-10-08"]

Add a helper that works out each doctor's status using the Asia/Kolkata date (not the server's UTC date):
- "today" if any visit date is today
- "upcoming" if the next visit date is after today (use the nearest future date)
- "past" otherwise (use the most recent past date)
Status must stay correct without a redeploy: render the page dynamically or with `export const revalidate = 3600`, whichever fits how the other pages are built. Don't compute it once at build time.

3. THE PAGE: /visiting-doctors/
- H1: "Visiting specialists at Medcare"
- Intro (one short paragraph): "Senior specialists from Yashoda Hospitals, Hyderabad hold clinics at Medcare, Bongaigaon on set dates. Call us to book a consultation slot."
- Section "Upcoming visits": doctors whose status is "today" or "upcoming", soonest first. If there are none, show one line: "No visits are scheduled right now. Call 93651 75235 to ask about the next visit." (number as a tel: link).
- Section "Recent visits": doctors whose status is "past", most recent first.

Doctor card (same card component for both sections; responsive grid: 1 column on phones, 2 on desktop):
- Headshot (circle or rounded square, matching how Dr. Das's portrait is styled). Use <picture> with the .webp and .jpg fallback, width/height set, alt "Dr. Naresh Lalam, Consultant Orthopedics", loading="lazy".
- Name (h3), title, hospital
- Date badge: "Today, 27 October 2026" / "Visiting 27 October 2026" / "Last visited 8 October 2026". Format dates as "D Month YYYY".
- "Treats" list with the conditions
- Buttons:
  - status today/upcoming: primary "Call 93651 75235 to book" (tel:+919365175235)
  - status past: secondary "Call to ask about the next visit" (same tel: link)
  - "View poster" text button: opens the poster in an accessible modal/lightbox (focus trapped, Esc and backdrop close it, close button with aria-label, focus returns to the button). Use <picture> with the 640w/1200w webp via srcset and the jpg fallback. Alt: "Poster: Dr. Naresh Lalam, Orthopedics, visiting Medcare Bongaigaon on 27 October". If the site already has a dialog/lightbox component, reuse it.
- Under the grid, a small note: "Visiting specialists are independent consultants from Yashoda Hospitals. Fees and timings are confirmed when you call." and a link to /plan-your-visit/ for directions.

Metadata: title "Visiting specialists from Yashoda Hospitals | Medcare Bongaigaon", a meta description naming orthopedics and gastroenterology, a canonical /visiting-doctors/, and the same OG image pattern the other pages use. Add the page to the sitemap.

4. LINKS TO THE PAGE
- Header top bar: add "Visiting doctors" next to "Plan your visit" (same style). On mobile it goes in the same menu where the top bar links appear.
- Footer "Patient information" list: add "Visiting doctors" after "Dr. Tamoghna Das".
- Homepage: add a slim strip "Visiting specialists" just before the "Meet Dr. Tamoghna Das" section, ONLY when at least one doctor has status today/upcoming. Show each doctor as one line: small headshot, "Dr. Naresh Lalam, Orthopedics: 27 October", plus one link "See visiting doctors" to /visiting-doctors/. When nothing is upcoming, render nothing (no empty box, and don't renumber the other sections). Don't put a call button in the strip.

5. SCHEMA
On /visiting-doctors/ only, add JSON-LD: one Physician per doctor with name, medicalSpecialty ("https://schema.org/Musculoskeletal" for Dr. Lalam, "https://schema.org/Gastroenterologic" for Dr. Farooqui), image (absolute URL of the headshot), and hospitalAffiliation { "@type": "Hospital", "name": "Yashoda Hospitals, Hitec City", "address": { "@type": "PostalAddress", "addressLocality": "Hyderabad", "addressRegion": "Telangana", "addressCountry": "IN" } }. Don't use worksFor (they are not Medcare staff). Don't add these doctors to the Medcare clinic or Dr. Das JSON-LD, and don't add Event schema.

6. LLMS FILES AND ENTITY FACTS
In lib/llms.ts (llms.txt + llms-full.txt) and docs/entity-facts.md, add a short "Visiting specialists" note: name, specialty, "Yashoda Hospitals, Hyderabad", "book by phone 93651 75235", and the page URL. Don't list visit dates there (they go out of date).

7. CHECK
Run the build (npm run build) and the tests (BASE_URL pointing to a fresh production server on a free port; kill any old server on that port first). Fix any errors from these edits. Then:
- Temporarily change Dr. Lalam's visit date to a future date and confirm he shows under "Upcoming visits" with the primary call button and the homepage strip appears. Change it to a past date and confirm he moves to "Recent visits" and the homepage strip disappears. Put the date back to 2026-10-27.
- Check that the status uses the India date (a visit on today's date shows "Today" between 00:00 and 05:30 IST too).
- Validate that the /visiting-doctors/ JSON-LD parses.
- Open and close the poster dialog using only the keyboard.
- Take screenshots of /visiting-doctors/ and the homepage strip at 1440px and 360px, and confirm nothing overflows horizontally.
- Confirm no WhatsApp link or booking-form link appears inside the visiting doctor cards.
When you're done, list every file you changed. Don't commit.
