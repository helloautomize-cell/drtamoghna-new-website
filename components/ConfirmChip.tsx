/**
 * [CONFIRM] chip: visible on the review site while SITE_INDEXABLE is not
 * "true", renders nothing once indexing is switched on at launch.
 * npm run launch-check fails while any remain in rendered output.
 */
export default function ConfirmChip({ children }: { children: React.ReactNode }) {
  if (process.env.SITE_INDEXABLE === "true") return null;
  return <span className="confirm">[CONFIRM: {children}]</span>;
}
