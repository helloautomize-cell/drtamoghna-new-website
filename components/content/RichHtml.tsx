import ConfirmChip from "@/components/ConfirmChip";
import { TOKEN_RE, type RenderToken } from "@/lib/content-types";
import { TriangleAlert, Info, Quote } from "lucide-react";

/**
 * RichHtml · renders remark/rehype HTML with %%TOK_n%% placeholders swapped
 * for real components (confirm chips, callouts). All copy is in the initial
 * HTML; tokens only wrap the interactive atoms.
 */
export default function RichHtml({
  html,
  tokens,
}: {
  html: string;
  tokens: RenderToken[];
}) {
  if (!tokens.length) {
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  }
  const parts = html.split(TOKEN_RE);
  // split yields [text, idx, text, idx, ...]
  const out: React.ReactNode[] = [];
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      if (parts[i]) {
        out.push(
          <span key={i} dangerouslySetInnerHTML={{ __html: parts[i] }} />,
        );
      }
    } else {
      const token = tokens[Number(parts[i])];
      if (token) out.push(<Token key={i} token={token} />);
    }
  }
  return <>{out}</>;
}

function Token({ token }: { token: RenderToken }) {
  if (token.kind === "confirm") {
    return <ConfirmChip>{token.note || "open question"}</ConfirmChip>;
  }
  if (token.variant === "emergency") {
    return (
      <div className="callout em">
        <TriangleAlert className="co-ic" size={24} strokeWidth={2} aria-hidden />
        <div>
          {token.title ? <b>{token.title}. </b> : null}
          <RichHtml html={token.html} tokens={[]} />
        </div>
      </div>
    );
  }
  if (token.variant === "quote") {
    return (
      <blockquote className="pullquote">
        <Quote size={18} strokeWidth={2} aria-hidden />
        <RichHtml html={token.html} tokens={[]} />
      </blockquote>
    );
  }
  return (
    <div className={`callout ${token.variant === "tip" ? "warn" : "info"}`}>
      <Info className="co-ic" size={24} strokeWidth={2} aria-hidden />
      <div>
        {token.title ? <b>{token.title}. </b> : null}
        <RichHtml html={token.html} tokens={[]} />
      </div>
    </div>
  );
}
