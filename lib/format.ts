/** Small display helpers (fs-free: safe for client components). */

/** "2026-10-03" -> "3 October 2026". Non-ISO input is returned unchanged. */
export function formatDate(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return iso;
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${Number(m[3])} ${months[Number(m[2]) - 1]} ${m[1]}`;
}
