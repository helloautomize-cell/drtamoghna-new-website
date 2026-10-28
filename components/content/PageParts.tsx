import { Phone } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { images, imgSrcSet } from "@/lib/images";
import { bookingHref } from "@/lib/booking-context";
import { accent, type GlanceItem, type Section, type Step } from "@/lib/content";
import { formatDate } from "@/lib/format";
import ConfirmChip from "@/components/ConfirmChip";
import BookButton from "@/components/BookButton";
import RouteLink from "@/components/RouteLink";
import WhatsAppMenu from "@/components/WhatsAppMenu";
import RichHtml from "./RichHtml";

/**
 * PageParts · shared blocks for content pages (styleguide-consistent):
 * At a glance card, sources strip, reviewer box, CTA band, steps list,
 * sticky TOC + booking card.
 */

export function AtAGlance({ items, id }: { items: GlanceItem[]; id?: string }) {
  return (
    <section className="glance" aria-label="At a glance" id={id}>
      <h2 className="glance-h">At a glance</h2>
      <ul>
        {items.map((it, i) => (
          <li key={i}>
            <b>{it.label}:</b>{" "}
            <RichHtml html={it.html} tokens={it.tokens} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Sources({ items }: { items: string[] }) {
  const linkRe = /^\[([^\]]+)\]\((https?:\/\/[^)]+)\)\s*$/;
  return (
    <div className="sources">
      <h2>Sources</h2>
      <ul>
        {items.map((s, i) => {
          const m = s.match(linkRe);
          return (
            <li key={i}>
              {m ? (
                <a href={m[2]} rel="noopener noreferrer">
                  {m[1]}
                </a>
              ) : (
                s
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Reviewer box: avatar, name, registration, last-reviewed confirm. */
export function ReviewerBox({ lastReviewed }: { lastReviewed?: string }) {
  const confirm = lastReviewed?.match(/\[CONFIRM(?::\s*([^\]]+))?\]/);
  return (
    <div className="callout info reviewer">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="co-avatar"
        src={images.avatar.src}
        srcSet={imgSrcSet(images.avatar)}
        sizes="48px"
        alt=""
        width={48}
        height={48}
        loading="lazy"
      />
      <p>
        <b>Medically reviewed by</b>{" "}
        <RouteLink href="/dr-tamoghna-das/">{siteConfig.doctor.name}</RouteLink>,{" "}
        {siteConfig.doctor.qualifications} · {siteConfig.doctor.registration}
        {confirm ? (
          <>
            {" "}· Last reviewed{" "}
            <ConfirmChip>{confirm[1]?.trim() || "date"}</ConfirmChip>
          </>
        ) : lastReviewed ? (
          <> · Last reviewed {formatDate(lastReviewed)}</>
        ) : null}
      </p>
    </div>
  );
}

/** Author box at the end of every Health Library article. */
export function AuthorBox({ url }: { url: string }) {
  const d = siteConfig.doctor;
  return (
    <div className="callout info reviewer author-box">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="co-avatar"
        src={images.avatar.src}
        srcSet={imgSrcSet(images.avatar)}
        sizes="48px"
        alt={images.avatar.alt}
        width={48}
        height={48}
        loading="lazy"
      />
      <div className="author-box-body">
        <p>
          <b>{d.name}</b>, {d.qualifications} · {d.shortTitle}, {siteConfig.name},{" "}
          North Bongaigaon.
        </p>
        <p>
          {d.titleLine}. {d.registration}.
        </p>
        <p className="author-box-links">
          <RouteLink href="/dr-tamoghna-das/">About Dr. Das</RouteLink>
          {" · "}
          <RouteLink href={bookingHref(url)}>Book an appointment</RouteLink>
          {" · "}
          <RouteLink href="/plan-your-visit/">Plan your visit</RouteLink>
        </p>
      </div>
    </div>
  );
}

/**
 * Medical disclaimer + red-flag line for Health Library articles.
 * Information only; urgent-care triggers from the content brief.
 */
export function PostNotice() {
  return (
    <div className="post-notice">
      <p>
        <b>Medical disclaimer.</b> This article is for general information only.
        It is not a diagnosis and is not a substitute for a consultation with a
        doctor. For advice about your own health, please{" "}
        <RouteLink href="/contact/#book">book an appointment</RouteLink>. Read our{" "}
        <RouteLink href="/medical-disclaimer/">medical disclaimer</RouteLink>.
      </p>
      <p>
        <b>Seek urgent care now</b>, call 108 or 112, or go to the nearest
        emergency department if you have chest pain, sudden breathlessness,
        fainting, weakness on one side of the body, very high blood sugar with
        vomiting or drowsiness, repeated low blood sugar with confusion, or a
        foot wound with redness, swelling or fever.
      </p>
    </div>
  );
}

/** CTA band at the end of every content page. */
export function CtaBand({ url }: { url: string }) {
  return (
    <section className="cta-band">
      <div className="cta-in">
        <h2>Book a visit with {siteConfig.doctor.name}</h2>
        <p>
          Call {siteConfig.phone.display} or send a WhatsApp message. We confirm your
          time within {siteConfig.bookingConfirmation} during clinic hours.
        </p>
        <div className="cta-actions">
          <BookButton href={bookingHref(url)} label="Book an appointment" />
          <a className="btn ghost" href={`tel:${siteConfig.phone.tel}`}>
            <Phone size={18} strokeWidth={2} aria-hidden /> Call {siteConfig.phone.display}
          </a>
          <WhatsAppMenu className="btn ghost">
            WhatsApp
          </WhatsAppMenu>
        </div>
      </div>
    </section>
  );
}

/** Numbered care steps ("What happens at Medcare" etc). */
export function StepsList({ steps }: { steps: Step[] }) {
  return (
    <ol className="steps">
      {steps.map((s, i) => (
        <li key={i}>
          <span className="step-n" aria-hidden>
            {i + 1}
          </span>
          <div>
            <b>{s.title}.</b> <RichHtml html={s.html} tokens={s.tokens} />
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Glass card row for hub children and related services. */
export function CardRow({
  cards,
}: {
  cards: { title: string; line: string; href: string; badge?: string }[];
}) {
  return (
    <div className="pcard-row">
      {cards.map((c, i) => (
        <RouteLink className="pcard" key={i} href={c.href}>
          <b dangerouslySetInnerHTML={{ __html: accent(c.title) }} />
          {c.line ? <span>{c.line}</span> : null}
        </RouteLink>
      ))}
    </div>
  );
}

/** Desktop sticky table of contents + small booking card (service detail). */
export function TocAside({
  sections,
  url,
}: {
  sections: Section[];
  url: string;
}) {
  const items = sections.filter((s) => s.kind !== "sources");
  if (!items.length) return null;
  const slug = (h: string) =>
    h
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  return (
    <aside className="toc-aside" aria-label="On this page" data-ga-location="sticky">
      <nav>
        <b>On this page</b>
        <ol>
          {items.map((s, i) => (
            <li key={i}>
              <a href={`#${slug(s.heading)}`}>{s.heading}</a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="toc-book">
        <b>Book a visit</b>
        <p>We confirm within {siteConfig.bookingConfirmation} in clinic hours.</p>
        <BookButton href={bookingHref(url)} label="Book now" />
        <a className="toc-call" href={`tel:${siteConfig.phone.tel}`}>
          <Phone size={15} strokeWidth={2} aria-hidden /> {siteConfig.phone.display}
        </a>
      </div>
    </aside>
  );
}

/** Anchor id used by TocAside; applied to rendered section headings. */
export function sectionId(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
