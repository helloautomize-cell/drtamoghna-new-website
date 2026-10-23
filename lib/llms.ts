/**
 * llms.ts · Builds /llms.txt and /llms-full.txt from the same content source
 * the site renders, so AI crawlers see exactly what visitors see.
 * No [CONFIRM] text and no build notes reach either file.
 */
import {
  allContentUrls,
  contentFile,
  dropBuildLines,
  getPage,
  pageH1,
  readContentFile,
} from "./content";
import { IDENTITY, siteConfig } from "./site-config";
import { SITE_BASE } from "./metadata";

const AGENCY_CREDIT =
  "Website built and marketed by Automize Media Labs (https://www.automizemedialabs.com/)";

/** Clinic and doctor social profiles; same split as schema sameAs. */
const SOCIAL_PROFILES = [
  "Social profiles:",
  `- Medcare: ${siteConfig.social.facebook} · ${siteConfig.social.instagram}`,
  `- Dr. Tamoghna Das: ${siteConfig.doctor.social.linkedin} · ${siteConfig.doctor.social.x} · ${siteConfig.doctor.social.facebook}`,
].join("\n");

/** Entity statement, site-plan section 1 (word for word). */
export const ENTITY_STATEMENT =
  "Medcare is a physician-led clinic run by Dr. Tamoghna Das, MBBS, MD (Internal Medicine), with a Post Graduate Fellowship in Echocardiography (JROP, Delhi). He is a member of the Indian Academy of Echocardiography (IAE) and the European Society of Cardiology (ESC), and has performed more than 10,000 echocardiography examinations. Medcare brings diabetes, obesity and heart care under one roof, with an advanced echocardiography lab, a weekly Heart Function Clinic recognised by the Heart Failure Association of India (HFAI), and in-house tests, so most patients can be examined, tested and treated in one place. The clinic is on Chapaguri Road, North Bongaigaon, Assam, founded in September 2023, and offers consultations, echocardiography with strain imaging, ECG, patch Holter monitoring, 24-hour blood pressure monitoring, continuous glucose monitoring, HbA1c testing, spirometry, body composition analysis, diabetic foot checks and sleep studies, an in-house pharmacy and lab sample collection through Agilus. It is open Monday to Saturday from 9 am to 8:30 pm and Sunday from 9 am to 3:30 pm. Patients come from Bongaigaon, Chirang, Kokrajhar, Dhubri, Goalpara, Barpeta and other parts of Northeast India.";

const GROUP_ORDER: { label: string; match: (u: string) => boolean }[] = [
  {
    label: "Clinic",
    match: (u) =>
      ["/", "/about/", "/dr-tamoghna-das/", "/services/"].includes(u),
  },
  {
    label: "Diabetes and weight",
    match: (u) => u.startsWith("/diabetes-care/") || u.startsWith("/weight-management/"),
  },
  {
    label: "Heart health",
    match: (u) => u.startsWith("/heart-health/"),
  },
  {
    label: "More care",
    match: (u) =>
      u.startsWith("/internal-medicine/") ||
      ["/thyroid-disorders/", "/asthma-copd/", "/sleep-apnea/", "/health-check-ups/"].includes(u),
  },
  {
    label: "Patient information",
    match: (u) =>
      [
        "/plan-your-visit/",
        "/coming-from-outside-bongaigaon/",
        "/faqs/",
        "/contact/",
        "/health-library/",
      ].includes(u),
  },
  {
    label: "Health Library articles",
    match: (u) => u.startsWith("/health-library/") && u !== "/health-library/",
  },
  {
    label: "Legal",
    match: (u) =>
      [
        "/privacy-policy/",
        "/terms-of-use/",
        "/medical-disclaimer/",
        "/editorial-policy/",
        "/patient-rights/",
        "/appointments-cancellation-refund/",
        "/accessibility/",
      ].includes(u),
  },
];

function groupOf(url: string): string {
  return GROUP_ORDER.find((g) => g.match(url))?.label ?? "Patient information";
}

function pageList(): { url: string; title: string; description: string }[] {
  return allContentUrls()
    .filter((u) => u !== "/thank-you/")
    .map((url) => {
      const page = getPage(url);
      return {
        url,
        title: pageH1(page).replace(/\*/g, ""),
        description: page.frontmatter.description || "",
      };
    });
}

type PageEntry = { url: string; title: string; description: string };

export function llmsTxt(): string {
  const groups = new Map<string, PageEntry[]>();
  for (const g of GROUP_ORDER) groups.set(g.label, []);
  for (const p of pageList()) {
    const list = groups.get(groupOf(p.url));
    if (list) list.push(p);
    else groups.set(groupOf(p.url), [p]);
  }

  const out: string[] = [
    "# Medcare Diabetes, Obesity and Echocardiography Clinic, Bongaigaon",
    "",
    `> ${ENTITY_STATEMENT}`,
    "",
    "One doctor runs every consultation: Dr. Tamoghna Das, MBBS, MD (Medicine), Assam Council of Medical Registration No. 20276. Consultation hours Monday to Saturday, 10 am to 2 pm and 6 pm to 8 pm, by prior appointment.",
    "Phone: +91 60031 21297. WhatsApp: +91 60031 21297 or +91 93651 75235. Email: medcarebongaigaon@gmail.com.",
    `Book online: ${SITE_BASE}/book/ (pick a day and hourly slot; the clinic confirms by phone).`,
    "Address: Chapaguri Road, opposite Domino's, North Bongaigaon, Gurunanak Nagar, Bongaigaon, Assam 783380.",
    SOCIAL_PROFILES,
    "",
  ];
  for (const [label, list] of groups) {
    if (!list.length) continue;
    out.push(`## ${label}`, "");
    for (const p of list) {
      const desc = p.description ? `, ${p.description}` : "";
      out.push(`- [${p.title}](${SITE_BASE}${p.url})${desc}`);
      if (p.url === "/dr-tamoghna-das/") {
        const entries = getPage(p.url).sections
          .filter((s) => /education and training|certifications and roles/i.test(s.heading))
          .flatMap((s) => s.raw.split("\n"))
          .filter((line) => /^- /.test(line) && /Burkholderia|Artificial Pancreas|CCAIM|Training on AI in Medicine/.test(line));
        for (const entry of entries) out.push(`  ${mdToPlain(entry)}`);
      }
    }
    out.push("");
  }
  return out.join("\n").trim() + `\n\n${AGENCY_CREDIT}\n`;
}

/* ----------------------------- llms-full.txt ----------------------------- */

const KV_RE = /^([A-Z][A-Za-z0-9' ()/`#.-]{1,48}):\s*(.*)$/;

// Build chrome that should never appear as text, whether or not it has a value.
const DROP_ALWAYS = new Set([
  "Buttons",
  "Links",
  "Map",
  "Photo labels (placed off faces)",
  "Portrait card name pill",
  "Doctor chip",
  "Mobile",
  "Mobile short line (under the portrait)",
  "Photo card",
  "Tabs and cards (each card",
  "Pills (each links to a page)",
]);

// Structural labels that are meaningful only to the layout. When they carry
// a value the value is real content and is kept; bare markers are dropped.
const BARE_DROP = new Set([
  "Cards",
  "Cards (6)",
  "Card",
  "Rows",
  "FAQs",
  "Key facts card",
  "Glass cards",
]);

function mdToPlain(md: string): string {
  const lines = dropBuildLines(md.split("\n"));
  const out: string[] = [];
  for (const line of lines) {
    let l = line.trimEnd();
    const t = l.trim();
    if (!t) {
      if (out.length && out[out.length - 1] !== "") out.push("");
      continue;
    }
    if (t === "Callout:" || /^-{3,}$/.test(t)) continue;
    // Table separator rows (|---|)
    if (/^\|[\s:|-]+\|$/.test(t)) continue;
    if (/^\|.*\|$/.test(t)) {
      // Table row: "a | b"
      out.push(t.slice(1, -1).split("|").map((c) => c.trim()).join(" | "));
      continue;
    }
    // Heading marks
    l = t.replace(/^#{1,6}\s+/, "");
    // List bullet handled around kv detection so "- Buttons: ..." still drops.
    const bullet = /^[-*]\s+/.test(l);
    l = l.replace(/^[-*]\s+/, "");
    // kv lines: keep the value, drop build-only keys and bare markers.
    const kv = l.match(KV_RE);
    if (kv) {
      if (DROP_ALWAYS.has(kv[1])) continue;
      if (kv[2]) l = kv[2].replace(/\s*(→|↗)\s*$/, "");
      else if (BARE_DROP.has(kv[1])) continue;
    }
    if (bullet) l = `- ${l}`;
    // images -> alt text, links -> label
    l = l.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1");
    l = l.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
    // bold/italic/code marks
    l = l.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1");
    l = l.replace(/`([^`]+)`/g, "$1");
    // blockquote / list marks kept as plain text
    l = l.replace(/^>\s?/, "").replace(/^[-*]\s+/, "- ");
    if (l.trim()) out.push(l.trim());
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function pagePlainText(url: string): string {
  const file = contentFile(url);
  if (!file) return "";
  const raw = readContentFile(file);
  const yamlMatch = raw.match(/```yaml\n([\s\S]*?)```/);
  const body = (yamlMatch ? raw.slice(yamlMatch.index! + yamlMatch[0].length) : raw)
    .replaceAll("{IDENTITY}", IDENTITY)
    .replace(/\[CONFIRM[^\]]*\]/g, "")
    .replace(/%%TOK_\d+%%/g, "");
  return mdToPlain(body);
}

export function llmsFullTxt(): string {
  const out: string[] = [
    "# Medcare Diabetes, Obesity and Echocardiography Clinic, Bongaigaon\n\n",
    ENTITY_STATEMENT,
    "\n\n",
    SOCIAL_PROFILES,
    `\nBook online: ${SITE_BASE}/book/ (pick a day and hourly slot; the clinic confirms by phone).\n`,
  ];
  const groups = new Map<string, { url: string; title: string }[]>();
  for (const g of GROUP_ORDER) groups.set(g.label, []);
  for (const p of pageList()) {
    const label = groupOf(p.url);
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push({ url: p.url, title: p.title });
  }
  for (const [, pages] of groups) {
    for (const p of pages) {
      const text = pagePlainText(p.url);
      if (!text) continue;
      out.push(`\n${"=".repeat(72)}\n`, `## ${p.title} · ${SITE_BASE}${p.url}\n\n`, text, "\n");
    }
  }
  return out.join("").replace(/\n{3,}/g, "\n\n").trimEnd() + `\n\n${AGENCY_CREDIT}\n`;
}
