# Medcare Diabetes, Obesity and Echocardiography Clinic website

Public website for Medcare Diabetes, Obesity and Echocardiography Clinic, Bongaigaon, Assam,
the clinic of Dr. Tamoghna Das, MBBS, MD (Medicine).

## Stack

- Next.js (App Router) + TypeScript, static-first rendering
- Content in `content/**/*.md` with frontmatter, parsed by `lib/content.ts`
- Site facts in `lib/site-config.ts` (single source for NAP, hours, phones)
- Booking form: Server Action + Resend (`RESEND_API_KEY`); a
  phone/WhatsApp card is shown while the key is not configured
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
- `docs/client-inputs-needed.md` — open questions for Dr. Das
- `docs/entity-facts.md` — canonical NAP, hours and services for listings
- `docs/seo-meta.csv` — every page's title and description
