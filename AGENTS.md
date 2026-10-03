# AGENTS.md · Medcare Diabetes & Obesity Clinic website

Read this before every task. It applies to every prompt in this project.

## What this is
A Next.js website for Medcare Diabetes & Obesity Clinic, Bongaigaon, Assam, owned by Dr. Tamoghna Das (the only doctor). Built by Automize Media Labs. Medical site: YMYL, Indian medical advertising rules apply.

## Sources of truth (in this order)
1. The current prompt from the agency.
2. `resources/docs/medcare-styleguide.html`: visuals. Colours and fonts are LOCKED. Copy its `:root` tokens exactly.
3. `resources/docs/client-answers.md`: every fact (address, hours, phones, email, credentials). Never invent a fact.
4. `resources/docs/site-plan.md`: pages, URLs, navigation, schema, global copy blocks.
5. `resources/content/new-website-content.md`: all page copy and FAQs. Use the words as written.
6. `resources/images/IMAGE-GUIDE.md` + `image-manifest.json`: which image goes where.
7. `resources/docs/master-rules.md`: the agency's general rules (Parts 3 to 9 for components, compliance, SEO and engineering). Where it conflicts with the files above, the files above win (for example: one-doctor hero, no arch behind service badges, Medcare palette).

## Never change without the agency's approval
- Anything in `resources/` (read-only inputs).
- Fonts: Figtree, Instrument Serif italic (one accent word per heading), Noto Sans Devanagari. `next/font`, self-hosted.
- Colour values in the style guide.

## Non-negotiables
- White page background. One gradient surface per viewport. Ink text never pure black. Aqua and peach never used for text. Red only for emergency notices.
- Body text at least 17px, tap targets 48px, contrast 4.5:1, all motion respects `prefers-reduced-motion`.
- No em or en dashes in UI copy, content or JSON-LD.
- Compliance (India): no "best", "No. 1", "leading", "guaranteed", "cure", "permanent", "100%"; no testimonials, review quotes, star ratings per doctor, before/after, prices, patient counts, drug or device brand names, machine model names; never call Dr. Das a cardiologist; never name or suggest a pharmacy, lab or hospital; no `AggregateRating` or `Review` schema.
- Emergency line on every page: "Medical emergency? Call 108 or 112."
- `[CONFIRM: ...]` markers show as a yellow chip in development, are hidden in production, and `npm run launch-check` fails while any remain.
- `resources/images/_source/evidence/` and `_backup/` must never be copied to `public/` or deployed.
- Until launch: `SITE_INDEXABLE=false` (noindex everywhere).

## How we work
- One phase per prompt, on its own branch, with a preview deploy. Never merge to `main` without approval.
- At the end of every phase: report what was built, deviations, screenshots asked for, tests run. Then STOP.
- If a file a prompt mentions is missing, STOP and say so. Do not substitute.
- Stack: Next.js App Router (latest stable), TypeScript strict, Tailwind v4 (tokens as CSS variables), Radix primitives, Embla, sharp, Zod. Vercel, region `bom1`.
