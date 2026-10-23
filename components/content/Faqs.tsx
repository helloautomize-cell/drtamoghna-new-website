import RichHtml from "./RichHtml";
import type { Faq } from "@/lib/content-types";

/**
 * FAQ accordion: native <details>/<summary>, so answers are in the initial
 * HTML, work without JavaScript and cost zero hydration. The shared `name`
 * groups them into an exclusive accordion where supported.
 */
export default function Faqs({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="faqs">
      {faqs.map((f, i) => (
        <details className="faq" key={i} name="faqs">
          <summary className="faq-t">
            <h3 className="faq-q">{f.q}</h3>
            <svg
              className="faq-i"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </summary>
          <div className="faq-c">
            <div className="faq-b">
              <RichHtml html={f.html} tokens={f.tokens} />
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
