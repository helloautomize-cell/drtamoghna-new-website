/** Shared booking-form validation helpers (server + client safe). */

/** IST "today" and "+60 days" as YYYY-MM-DD bounds. */
export function dateBounds() {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
  );
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate(),
    ).padStart(2, "0")}`;
  const max = new Date(now);
  max.setDate(max.getDate() + 60);
  return { min: fmt(now), max: fmt(max) };
}

export function normalizeMobile(raw: string): string | null {
  let d = raw.replace(/[^\d]/g, "");
  if (d.startsWith("91") && d.length === 12) d = d.slice(2);
  if (d.startsWith("0") && d.length === 11) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? `+91${d}` : null;
}
