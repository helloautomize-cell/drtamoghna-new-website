import type { Metadata } from "next";
import Image from "next/image";
import { Phone } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import BookButton from "@/components/BookButton";
import ChipGroup from "@/components/ChipGroup";
import SocialLinks, { doctorSocial } from "@/components/SocialLinks";
import Faqs from "@/components/content/Faqs";
import RichHtml from "@/components/content/RichHtml";
import { CtaBand, ReviewerBox } from "@/components/content/PageParts";
import {
  accent,
  extractConfirms,
  resolveTokens,
  getPage,
  mdToHtml,
  type RenderToken,
} from "@/lib/content";
import { images } from "@/lib/images";
import { siteConfig } from "@/lib/site-config";
import { pageGraph } from "@/lib/page-schema";
import { pageMeta } from "@/lib/metadata";
import { bookingHref } from "@/lib/booking-context";

export const metadata: Metadata = pageMeta({
  title: "Dr. Tamoghna Das, MD Medicine | Medcare Bongaigaon",
  description:
    "Internal medicine and cardio-diabetic consultant in Bongaigaon. MBBS, MD (GMCH), fellowship in echocardiography. Reg. No. 20276, Assam.",
  url: "/dr-tamoghna-das/",
});

function t(html: string, tokens: RenderToken[]) {
  return <RichHtml html={html} tokens={tokens} />;
}

/** Markdown line -> {html,tokens} for bespoke lists. */
function rich(text: string): { html: string; tokens: RenderToken[] } {
  const tokens: RenderToken[] = [];
  const html = resolveTokens(
    mdToHtml(extractConfirms(text.trim(), tokens)),
    tokens,
  ).replace(/^<p>|<\/p>$/g, "");
  return { html, tokens };
}

/** Parse "- **Group:** a · b · c" chip groups. */
function chipGroups(raw: string) {
  const groups: { label: string; items: { html: string; tokens: RenderToken[] }[] }[] = [];
  for (const l of raw.split("\n")) {
    const m = l.trim().match(/^-\s+\*\*(.+?):\*\*\s*(.*)$/);
    if (m) {
      groups.push({
        label: m[1],
        items: m[2].split("·").map((s) => rich(s)),
      });
    }
  }
  return groups;
}

/** Parse "- year · text" timeline rows. */
function timeline(raw: string) {
  const rows: { period: string; text: { html: string; tokens: RenderToken[] } }[] = [];
  for (const l of raw.split("\n")) {
    const m = l.trim().match(/^-\s+(.+?)\s*·\s*(.*)$/);
    if (m) rows.push({ period: m[1], text: rich(m[2]) });
  }
  return rows;
}

/** Split a section into labelled sub-lists ("Current roles:", etc). */
function subLists(raw: string) {
  const groups: { label: string; items: { html: string; tokens: RenderToken[] }[] }[] = [];
  let cur: { label: string; items: { html: string; tokens: RenderToken[] }[] } | null = null;
  for (const l of raw.split("\n")) {
    const t = l.trim();
    if (!t) continue;
    const head = t.match(/^([A-Z][A-Za-z' ()]+:?)\s*(\(.*\))?:?\s*$/);
    if (head && !t.startsWith("-")) {
      cur = { label: t.replace(/:$/, ""), items: [] };
      groups.push(cur);
    } else if (cur && t.startsWith("-")) {
      cur.items.push(rich(t.replace(/^-\s+/, "")));
    }
  }
  return groups;
}

function ProfileDocument({ html }: { html: string }) {
  const documents = [
    {
      match: "CCAIM",
      href: "/documents/ccaim-batch4-certificate.pdf",
      label: "View certificate (PDF)",
      image: { src: "/documents/ccaim-batch4-certificate.png", width: 1287, height: 909, alt: "CCAIM Batch 4 certificate, Dr. Tamoghna Das" },
    },
    {
      match: "Training on AI in Medicine",
      href: "/documents/ai-in-medicine-training-certificate.pdf",
      label: "View certificate (PDF)",
      image: { src: "/documents/ai-in-medicine-training-certificate.png", width: 1131, height: 1544, alt: "AI in Medicine training certificate, Dr. Tamoghna Das" },
    },
    {
      match: "Artificial Pancreas",
      href: "/documents/dtech-2025-talk-slide.jpg",
      label: "View talk slide (JPG)",
      image: { src: "/documents/dtech-2025-talk-slide.jpg", width: 1400, height: 787, alt: "Title slide of Dr. Tamoghna Das's talk at DTech 2025, Jaipur" },
    },
    {
      match: "Burkholderia",
      href: "/documents/burkholderia-cepacia-case-report-2017.pdf",
      label: "Read the paper (PDF)",
      image: undefined,
    },
  ];
  const document = documents.find((item) => html.includes(item.match));
  if (!document) return null;

  return (
    <span className="profile-document">
      {document.image && (
        <a className="profile-document-thumbnail" href={document.href} target="_blank" rel="noopener">
          <Image {...document.image} alt={document.image.alt} sizes="(max-width: 767px) 120px, 160px" loading="lazy" />
        </a>
      )}
      <a className="profile-document-link" href={document.href} target="_blank" rel="noopener">
        {document.label}
      </a>
    </span>
  );
}

export default function Page() {
  const page = getPage("/dr-tamoghna-das/");
  const sec = (re: RegExp) => page.sections.find((s) => re.test(s.heading));

  const hero = sec(/hero/i);
  const heroKv: Record<string, string> = {};
  const kvLines = hero?.raw.split("\n") || [];
  for (const l of kvLines) {
    const m = l.trim().match(/^([A-Z][A-Za-z' ()]+):\s*(.*)$/);
    if (m) heroKv[m[1]] = m[2];
  }
  const keyFacts: { label: string; val: { html: string; tokens: RenderToken[] } }[] = [];
  for (const l of kvLines) {
    const m = l.trim().match(/^-\s+\*\*(.+?):\*\*\s*(.*)$/);
    if (m) keyFacts.push({ label: m[1], val: rich(m[2]) });
  }
  const h1 = heroKv["H1"] || "Dr. Tamoghna Das";

  const works = sec(/how dr\. das works/i);
  const principles: { title: string; quote: { html: string; tokens: RenderToken[] } }[] = [];
  for (const l of (works?.raw || "").split("\n")) {
    const m = l.trim().match(/^\d+\.\s+\*\*(.+?)\.\*\*\s*(.*)$/);
    if (m) principles.push({ title: m[1], quote: rich(m[2].replace(/^"|"$/g, "")) });
  }
  const worksH2 = (works?.raw.match(/^H2:\s*(.+)$/m)?.[1]) || "How Dr. Das works";

  const education = timeline(sec(/education and training/i)?.raw || "");
  const work = timeline(sec(/work experience/i)?.raw || "");
  const certGroups = subLists(sec(/certifications and roles/i)?.raw || "");
  const chips = chipGroups(sec(/conditions and services/i)?.raw || "");
  const faqs = sec(/^faqs$/i)?.faqs || [];

  const graph = pageGraph({
    page,
    crumbs: [{ name: "Dr. Tamoghna Das", href: "/dr-tamoghna-das/" }],
    pageType: "ProfilePage",
    faqs,
  });

  return (
    <>
      <Breadcrumbs
        items={[{ label: "Dr. Tamoghna Das", href: "/dr-tamoghna-das/" }]}
        jsonLd={false}
      />
      <JsonLd data={graph} />

      <section className="page-hero prof">
        <div className="ph-in">
          <div className="ph-text">
            <h1 dangerouslySetInnerHTML={{ __html: accent(h1) }} />
            <p className="ph-titleline">{heroKv["Title line"]}</p>
            <div className="keyfacts glass">
              {keyFacts.map((f, i) => (
                <p key={i}>
                  <b>{f.label}:</b> {t(f.val.html, f.val.tokens)}
                </p>
              ))}
            </div>
            <div className="follow-row">
              <span>Follow Dr. Das</span>
              <SocialLinks
                links={[
                  doctorSocial.linkedin,
                  doctorSocial.x,
                  doctorSocial.facebook,
                ]}
              />
            </div>
            <div className="ph-actions">
              <BookButton href={bookingHref("/dr-tamoghna-das/")} label="Book with Dr. Das" />
              <a className="btn ghost" href={`tel:${siteConfig.phone.tel}`}>
                <Phone size={18} strokeWidth={2} aria-hidden /> Call {siteConfig.phone.display}
              </a>
            </div>
          </div>
          <figure className="ph-photo prof">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images.heroDesktop.src}
              alt={images.heroDesktop.alt}
              width={images.heroDesktop.width}
              height={images.heroDesktop.height}
              fetchPriority="high"
            />
          </figure>
        </div>
      </section>

      <div className="page-body">
        <div className="pb-main">
          {(() => {
            const about = sec(/^about$/i);
            return about ? (
              <section className="psec" aria-labelledby="about">
                <h2 id="about">About</h2>
                <RichHtml html={about.html} tokens={page.tokens} />
              </section>
            ) : null;
          })()}

          <section className="psec" aria-labelledby="how">
            <h2 id="how" dangerouslySetInnerHTML={{ __html: accent(worksH2) }} />
            <div className="how-grid">
              <div className="principles">
                {principles.map((p, i) => (
                  <div className="principle" key={i}>
                    <b>{p.title}.</b>
                    <p>{t(p.quote.html, p.quote.tokens)}</p>
                  </div>
                ))}
              </div>
              <figure className="sec-img side">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images.consultation3x2.src}
                  alt={images.consultation3x2.alt}
                  width={images.consultation3x2.width}
                  height={images.consultation3x2.height}
                  loading="lazy"
                />
              </figure>
            </div>
          </section>

          <section className="psec" aria-labelledby="edu">
            <h2 id="edu">Education and training</h2>
            <div className="edu-grid">
              <ol className="timeline">
                {education.map((e, i) => (
                  <li key={i}>
                    <span className="tl-period">{e.period}</span>
                    <span>{t(e.text.html, e.text.tokens)}<ProfileDocument html={e.text.html} /></span>
                  </li>
                ))}
              </ol>
              <figure className="sec-img side">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images.doorSign.src}
                  alt={images.doorSign.alt}
                  width={images.doorSign.width}
                  height={images.doorSign.height}
                  loading="lazy"
                />
              </figure>
            </div>
          </section>

          <section className="psec" aria-labelledby="work">
            <h2 id="work">Work experience</h2>
            <ol className="timeline">
              {work.map((e, i) => (
                <li key={i}>
                  <span className="tl-period">{e.period}</span>
                  <span>{t(e.text.html, e.text.tokens)}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="psec certs" aria-labelledby="certs">
            <h2 id="certs">Certifications and roles</h2>
            <div
              className="cert-banner"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.88), rgba(255,255,255,0.88)), url(${images.awardsShelf.src})`,
              }}
            >
              <figure className="cert-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images.plaques.src}
                  alt={images.plaques.alt}
                  width={images.plaques.width}
                  height={images.plaques.height}
                  loading="lazy"
                />
              </figure>
              <div className="cert-lists">
                {certGroups.map((g, i) => (
                  <div className="cert-group" key={i}>
                    <b>{g.label}</b>
                    <ul>
                      {g.items.map((it, j) => (
                        <li key={j}>{t(it.html, it.tokens)}<ProfileDocument html={it.html} /></li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <figure className="sec-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images.cmeTalk.src}
                alt={images.cmeTalk.alt}
                width={images.cmeTalk.width}
                height={images.cmeTalk.height}
                loading="lazy"
              />
            </figure>
          </section>

          <section className="psec" aria-labelledby="conditions">
            <h2 id="conditions">Conditions and services</h2>
            {chips.map((g, i) => (
              <ChipGroup key={i} label={g.label} items={g.items} />
            ))}
          </section>

          <section className="psec" aria-labelledby="faqs">
            <h2 id="faqs">FAQs</h2>
            <Faqs faqs={faqs} />
          </section>

          <ReviewerBox lastReviewed={page.frontmatter.lastReviewed} />
        </div>
      </div>

      <CtaBand url="/dr-tamoghna-das/" />
    </>
  );
}
