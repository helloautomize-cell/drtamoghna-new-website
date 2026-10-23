# Medcare Diabetes, Obesity and Echocardiography Clinic website

Public website for Medcare Diabetes, Obesity and Echocardiography Clinic, Bongaigaon, Assam,
the clinic of Dr. Tamoghna Das, MBBS, MD (Medicine).

## Stack

- Next.js (App Router) + TypeScript, static-first rendering
- Content in `content/**/*.md` with frontmatter, parsed by `lib/content.ts`
- Site facts in `lib/site-config.ts` (single source for NAP, hours, phones)
- Booking form: hourly slots on `/book/`, `/contact/` and the home
  section, saved to a private Google Sheet through an Apps Script web
  app (`SHEETS_WEBHOOK_URL` + `SHEETS_WEBHOOK_SECRET`, server only).
  Setup notes: `docs/BOOKING.md`. The clinic gets email alerts from the
  Sheet and calls the patient; no WhatsApp or email service in the
  booking flow.
- Analytics: GA4 via gtag, loaded only after cookie consent
  (`NEXT_PUBLIC_GA_ID`), plus Vercel Speed Insights and Web Analytics

## Scripts

- `npm run dev` / `npm run build` / `npm run start`
- `npm run lint`, `npm run typecheck`
- `npm run check:dashes`, `npm run check:images`
- `npm run launch-check` — open confirmation items report
- `npm test` — Playwright suite
- `npm run indexnow` — submit sitemap URLs to IndexNow

## Environment

See `.env.example`. The site is indexable by default; set
`SITE_NOINDEX=true` only as an emergency brake.

## Docs for the agency

- `docs/go-live-checklist.md` — launch steps and owners
- `docs/BOOKING.md` — Google Sheet and Apps Script setup for online booking
- `docs/client-inputs-needed.md` — open questions for Dr. Das
- `docs/entity-facts.md` — canonical NAP, hours and services for listings
- `docs/seo-meta.csv` — every page's title and description

Built and marketed by Automize Media Labs - https://www.automizemedialabs.com/
