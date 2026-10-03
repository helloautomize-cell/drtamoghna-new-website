# Phase 1b · Images: pre-treat and publish the Medcare photo set and badges

Run this only after Phase 1 (Next.js app + `/styleguide`) is approved.

Before starting, confirm these paths exist and list them:
- `resources/images/IMAGE-GUIDE.md`
- `resources/images/image-manifest.json`
- `resources/images/icons/services/` (88 files: 22 badges x 512/256 x PNG/WebP)
- `resources/images/_source/` with folders `brand/`, `doctors/`, `clinic/`, `video/`, `evidence/`, `_backup/`
- `resources/docs/medcare-styleguide.html`

If any is missing, STOP and tell me. Do not substitute another file, and do not rename or move anything inside `_source/`.

Branch: `phase-1b-images` (from the approved Phase 1 branch). Deploy a preview. Do not merge to `main` until I approve.

## Non-negotiables (short)
- Never upscale. Never use AI tools to change faces or add content. Only the treatments listed in the manifest.
- `resources/images/_source/` is read-only. The approved originals stay exactly as delivered (including any embedded C2PA content credentials). Do not strip or edit them.
- **Never copy `evidence/` or `_backup/` into `public/`.** They must not be deployed.
- `clinic/echo-screen.png` is a redacted file. Use it as is. Do not look for or request an unredacted version.
- No drug, device or machine brand names may be readable in any published image. No patient names, reports or screens with patient data.
- Faces are never covered by glass labels or text.
- Website outputs carry no EXIF, GPS, camera or software metadata, in sRGB.
- Fonts and colours are locked in `medcare-styleguide.html`. This task changes no styles.

## Tasks

1. **Install** `sharp` (dev dependency) if it is not there yet.

2. **Write `scripts/process-images.mjs`** that reads `resources/images/image-manifest.json` and, for every entry in `images[]` and every item in `outputs[]`:
   - opens `resources/images/_source/<src>`;
   - applies `crop` (`[left, top, right, bottom]` in source pixels; `"full"` = no crop) with `extract()`;
   - applies `treatment` text where present, mapped as:
     - "contrast +3%" → `linear(1.03, -(128*0.03))`
     - "exposure +8%" → `modulate({ brightness: 1.08 })`
     - "slightly cooler white balance" → `tint` neutral: `recomb` with blue +2%, red -2%
     - "blur ... [l,t,r,b] at radius N" → extract that box, `blur(N)`, composite it back at the same position (generic support; no blur is currently required on the exterior or opening-day photos)
     - "blur any legible brand on the echo monitor bezel": inspect at 100%; if a brand is readable, blur that box at radius 6 and log the box in `_todo.md`
     - "no skin smoothing": no filters on faces
   - resizes to the **largest** value in `widths` (never larger than the cropped width);
   - outputs JPEG quality 85 with mozjpeg, `toColourspace('srgb')`, **no `withMetadata()`**, to `public/images/<out>`;
   - for `.mp4` and `.jpg` video items, copies the file to `public/images/<out>` unchanged (the video has no audio and no metadata already);
   - for `brand/medcare-logo.png`, trims transparent padding and writes PNG with alpha.
   - The script is idempotent and prints a table: out file, size in px, size in KB.

3. **Write `public/images/alt-text.json`** from the manifest: `{ "<out path>": "<alt>" }`. An empty alt (`""`) means decorative.

4. **Write `public/images/_todo.md`** listing:
   - any brand you found and blurred on the consultation photo's echo monitor;
   - "Replace clinic-exterior if the signboard is redone (new domain)".

4b. **Service badges:** copy `resources/images/icons/services/*` to `public/images/icons/services/` unchanged (already processed; do not run them through sharp). Create `lib/service-badges.ts` exactly as in `IMAGE-GUIDE.md` section 6. In `/styleguide`, replace the placeholder SVG badges with these PNG/WebP badges wherever a matching slug exists, keeping the CSS ring, coin, orbit ring, coin flip and sheen. All 22 badges exist; remove every placeholder badge SVG from `/styleguide`.

5. **Add `lib/images.ts`**: a typed map from a short key (e.g. `heroDesktop`, `heroMobile`, `avatar`, `consultation`, `exteriorWide`) to `{ src, width, height, alt }` built from the outputs. Components import from here; no hard-coded image paths in components.

6. **Wire the images into `/styleguide`** only (pages come in later phases):
   - Hero: `heroDesktop` (2:3) above 900 px, `heroMobile` (4:5) below, using `<picture>` or `next/image` with art direction. `priority` and `fetchPriority="high"` on the hero only.
   - Doctor chip and reviewer box: `avatar`.
   - Step tracker: steps 2, 3, 4 and 5 use `reception`, `consultation`, `echoScreen`, `writingPlan`. Steps 1 and 6 use the code-built phone mock-ups described in `IMAGE-GUIDE.md` (no photos).
   - Doctor card: `portrait`.
   - Add a "Photo set" section at the end of `/styleguide` showing every published image with its key, size and alt text, as a contact sheet.

7. **`next.config`**: `images.formats: ['image/avif','image/webp']`, sensible `deviceSizes`, no remote domains.

8. **Checks** (add to `npm run check:images`):
   - every manifest output exists in `public/images/`;
   - no file in `public/` comes from `evidence/` or `_backup/` (compare file hashes, not only names);
   - `sharp(file).metadata()` shows no `exif`, `icc` other than sRGB, `xmp` or `iptc` on every published JPEG;
   - no output is wider than its cropped source;
   - total `public/images/` size reported.

## Acceptance
- `npm run images` builds everything from the manifest with no errors; running it twice gives identical files.
- `npm run check:images` passes.
- `/styleguide` shows the hero with Dr. Das at 1440 and 390 widths, the step tracker with 4 photos and 2 mock-ups, and the photo-set contact sheet.
- No console errors; Lighthouse accessibility 100 on `/styleguide`.

## Report
- What was built, by task; deviations and why
- Screenshots: `/styleguide` hero at 1440 and 390; step tracker at 1440; the photo-set contact sheet at 1440
- The output table from `npm run images` and the result of `npm run check:images`
- Contents of `public/images/_todo.md`

STOP after this. Do not start Phase 2.
