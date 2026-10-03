# Tone cleanup log · Phase 5 launch sweep

Date: 3 October 2026. Scope: every rendered page (`content/**/*.md`),
all components and templates, site config, schema strings and the two
`llms` outputs. Rule set: master Part 7.3 (AI-tone blacklist) plus the
project style rules (plain, warm, short sentences; sentence case;
no em or en dashes; no exclamation marks; no promotional claims).

## Method

1. Searched all rendered sources for every Part 7.3 blacklist term:
   delve, navigate (metaphor), embark, realm, tapestry, testament,
   seamless, comprehensive, holistic, robust, leverage, empower,
   elevate, unlock, tailored, cutting-edge, state-of-the-art,
   world-class, top-notch, game-changer, peace of mind, rest assured,
   one-stop solution, "it's important to note", "in today's fast-paced
   world", "whether you're ... or ...", "not just ... but ...",
   "look no further", furthermore/moreover/additionally at sentence
   start, rhetorical-question headings, exclamation marks, emojis,
   Title Case headings.
2. Ran `npm run check:dashes` over source and rendered output.
3. Swept for leftover review-mode text (`[CONFIRM]`, "Preview",
   phase notes, build markers) in rendered HTML.
4. Manual read of the highest-traffic pages (home, contact,
   dr-tamoghna-das, diabetes-care, echocardiography) for warmth and
   compliance tone.

## Findings

- **AI-tone blacklist: 0 hits.** All copy was already written in the
  plain, warm, short-sentence register. No changes were needed to
  medical content, so medical meaning is untouched.
- **Exclamation marks: 0.**
- **Em and en dashes: 0** in rendered HTML and JSON-LD
  (`check:dashes` clean). Two remaining em dashes inside comments of
  `scripts/split-content.mjs` (a build tool, never rendered) were
  removed anyway.
- **Review leftovers removed:**
  - `[CONFIRM]` chips render nothing; three content lines that would
    have become fragments were dropped (listed in the Phase 5 report).
  - The "Preview: requests are not emailed yet" notice was replaced by
    the book-by-phone card.
  - The styleguide's literal badge-generation prompt block was removed.
  - Phase references in comments and styleguide copy were neutralised.
- **Placeholders:** zero `[CONFIRM]`, zero "Preview", zero placeholder
  dates in rendered HTML; every page shows the 3 October 2026 date.

## Changes made to visible copy

None. The sweep found no tone violations in rendered copy; only
non-visible items (comments, styleguide internals, script notes) were
touched. Medical meaning is unchanged everywhere.
