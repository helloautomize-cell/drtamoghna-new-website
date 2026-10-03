/**
 * [CONFIRM] chip: visible only in review mode (SITE_NOINDEX="true"),
 * renders nothing on the live site.
 */
export default function ConfirmChip({ children }: { children: React.ReactNode }) {
  if (process.env.SITE_NOINDEX !== "true") return null;
  return <span className="confirm">[CONFIRM: {children}]</span>;
}
