/**
 * content-types.ts · fs-free token types shared by server loaders and
 * client components (RichHtml, Faqs). Never import node modules here.
 */

export type RenderToken =
  | { kind: "confirm"; note: string }
  | {
      kind: "callout";
      variant: "tip" | "info" | "emergency" | "quote";
      title?: string;
      html: string;
    };

export const TOKEN_RE = /%%TOK_(\d+)%%/g;

export interface Faq {
  q: string;
  html: string;
  tokens: RenderToken[];
}

export interface GlanceItem {
  label: string;
  html: string;
  tokens: RenderToken[];
}

export interface Step {
  title: string;
  html: string;
  tokens: RenderToken[];
}

export interface GlassCard {
  title: string;
  line: string;
}

/** Render `*word*` accents inside h1/label text as italic accent <em>. */
export function accent(text: string): string {
  return text.replace(/\*([^*]+)\*/g, '<em class="acc">$1</em>');
}
