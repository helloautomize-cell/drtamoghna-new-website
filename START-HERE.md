# START HERE · Medcare website kit

Everything needed to build the site, in the folder layout the coding agent expects.

```
drtamoghna-new-website/
├── START-HERE.md                  this file
├── AGENTS.md                      project rules the agent reads every time
├── .windsurf/rules/medcare.md     tells Windsurf to always follow AGENTS.md
└── resources/                     read-only inputs
    ├── docs/
    │   ├── medcare-styleguide.html   visual reference (locked colours and fonts)
    │   ├── client-answers.md         every confirmed fact about Medcare and Dr. Das
    │   ├── site-plan.md              pages, URLs, menus, schema, global copy
    │   └── master-rules.md           agency rules for components, compliance, SEO
    ├── content/
    │   └── new-website-content.md    all page copy and FAQs (39 pages + 3 articles)
    ├── prompts/
    │   └── phase-1b-images.md        image processing prompt (runs after Phase 1)
    └── images/
        ├── IMAGE-GUIDE.md            which image goes on which page
        ├── image-manifest.json       crops, sizes, alt text (read by the script)
        ├── icons/services/           22 badges, ready to use (PNG + WebP, 512/256)
        └── _source/
            ├── brand/                logo PNG, white logo, rough heart mark
            ├── doctors/              Dr. Das photos (approved)
            ├── clinic/               clinic photos (cleaned and redacted where needed)
            ├── video/                echo room loop + poster
            ├── icons/services-original/   badge originals (not published)
            ├── evidence/             certificates, facts only, NEVER published
            └── _backup/              not used
```

Phase order: 0 setup (this kit) → 1 foundation + `/styleguide` + logo SVG → 1b images → 2 site shell → 3 content pipeline → 4 home + templates → 5 blog, QA, preview → 6 forms, email, analytics → polish → SEO/GEO/AEO pass → launch.

Kit version: 3 Oct 2026.
