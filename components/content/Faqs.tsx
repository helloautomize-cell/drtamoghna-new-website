"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import RichHtml from "./RichHtml";
import type { Faq } from "@/lib/content-types";

/** FAQ accordion: numbered questions, answers with confirm/callout atoms. */
export default function Faqs({ faqs }: { faqs: Faq[] }) {
  return (
    <Accordion.Root type="single" collapsible className="faqs">
      {faqs.map((f, i) => (
        <Accordion.Item className="faq" key={i} value={`f${i}`}>
          <Accordion.Header className="faq-h">
            <Accordion.Trigger className="faq-t">
              <span>{f.q}</span>
              <Plus className="faq-i" size={18} strokeWidth={2.2} aria-hidden />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="faq-c">
            <div className="faq-b">
              <RichHtml html={f.html} tokens={f.tokens} />
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
