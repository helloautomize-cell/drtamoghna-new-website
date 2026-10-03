# Go-live checklist · Medcare website

Everything still to do after the launch deploy, with the owner for each
step. "Agency" = Automize Media Labs, "Clinic" = Dr. Das's team,
"Developer" = whoever manages the Vercel project.

## 1. Custom domain (Agency + Developer)

- [ ] Connect the apex custom domain in Vercel (e.g. `medcare….com`,
      no `www`). Vercel sets the `www` -> apex redirect automatically;
      verify it 301s.
- [ ] Set `NEXT_PUBLIC_SITE_URL` to `https://<apex-domain>` in the
      Vercel production environment and redeploy. Every canonical, OG
      URL, sitemap entry and JSON-LD `@id` switches to the domain.
- [ ] The old `drtamoghna-new-website.vercel.app` URL must then 301 to
      the apex domain. Add a `redirects()` rule in `next.config.ts` (or
      a Vercel domain-level redirect) once the domain is live.
- [ ] Update the Website field in `docs/entity-facts.md` and every
      directory listing.

## 2. Search engines (Agency)

- [ ] Google Search Console: verify the domain, submit
      `https://<apex-domain>/sitemap.xml`.
- [ ] Bing Webmaster Tools: import the site from Google Search Console.
      IndexNow already notifies Bing on every production deploy.
- [ ] Confirm `/llms.txt` and `/llms-full.txt` return 200 on the domain.

## 3. Booking email, Resend (Developer + Agency)

- [ ] In Resend, verify the sending domain with SPF, DKIM and DMARC
      records. **Never touch MX records** (clinic email stays on its
      current provider).
- [ ] Set `RESEND_API_KEY`, `RESEND_TO` (clinic inbox, default
      `medcarebongaigaon@gmail.com`) and `RESEND_FROM`
      (`Medcare Website <appointments@<verified-domain>>`) in Vercel,
      then redeploy.
- [ ] The full booking form appears automatically at `/contact/#book`;
      until then the phone/WhatsApp card is shown. Send one test
      request and confirm the email arrives with the field table.

## 4. Spam protection, Cloudflare Turnstile (Developer)

- [ ] Create a Turnstile site for the domain; set
      `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` in
      Vercel, redeploy. The widget appears on the form automatically.

## 5. Analytics (Agency)

- [ ] Create a GA4 property; set `NEXT_PUBLIC_GA_ID` in Vercel and
      redeploy. Nothing tracks until a visitor accepts analytics
      cookies (Consent Mode v2, ad signals always denied).
- [ ] Vercel Speed Insights and Web Analytics are already on; open them
      in the Vercel dashboard.

## 6. Google rating chip (Developer)

- [ ] Create a restricted Places API key (Places API only, HTTP
      referrer-restricted to the domain) and set a Rs 100 budget alert.
- [ ] Set `GOOGLE_PLACES_KEY` and `GOOGLE_PLACE_ID` in Vercel and
      redeploy. The footer chip shows the live rating, refreshed every
      24 h; it hides itself on any error. Until then it stays hidden.

## 7. Google Business Profile (Agency)

- [ ] Rename the profile to **Medcare Diabetes & Obesity Clinic**.
- [ ] Set the website link with UTM:
      `https://<apex-domain>/?utm_source=google&utm_medium=organic&utm_campaign=gbp`
- [ ] Set hours to match the site exactly: Mon-Sat 9 am-8:30 pm,
      Sun 9 am-3:30 pm.
- [ ] Copy the description from `docs/entity-facts.md`.

## 8. Other listings (Agency)

- [ ] Update Justdial and Practo using `docs/entity-facts.md`
      (identical NAP, hours, services and areas served).

## 9. After launch (Agency)

- [ ] Ask Dr. Das the questions in `docs/client-inputs-needed.md` and
      update the site where his answers differ.
- [ ] Re-run `npm run launch-check`; aim for zero open items.
