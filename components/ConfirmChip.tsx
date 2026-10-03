/**
 * [CONFIRM] chip: visible in development only, renders nothing in production.
 * npm run launch-check fails while any remain in rendered output.
 */
export default function ConfirmChip({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === "production") return null;
  return <span className="confirm">[CONFIRM: {children}]</span>;
}
