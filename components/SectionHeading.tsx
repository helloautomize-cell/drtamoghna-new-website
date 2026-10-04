/**
 * Section heading: eyebrow, H2 with one italic serif accent word, intro line.
 */
export default function SectionHeading({
  eyebrow,
  title,
  accent,
  reveal = false,
  children,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  reveal?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="sec-h" {...(reveal ? { "data-reveal": true } : {})}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>
        {title} {accent ? <em className="acc">{accent}</em> : null}
      </h2>
      {children ? <p>{children}</p> : null}
    </div>
  );
}
