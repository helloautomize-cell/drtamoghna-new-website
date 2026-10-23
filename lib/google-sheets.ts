/**
 * Google Sheets client over a private Apps Script web app
 * (docs/sheets-apps-script.gs). One "book" call does the capacity check and
 * the append under a lock inside the Sheet; "availability" returns slots
 * with places left. The shared secret travels in the POST body; it is
 * server only and never logged.
 */

const TIMEOUT_MS = 15000;
const AVAIL_TTL_MS = 30_000;

export function sheetsConfigured(): boolean {
  return Boolean(
    process.env.SHEETS_WEBHOOK_URL && process.env.SHEETS_WEBHOOK_SECRET,
  );
}

/* ----------------------------- Wire types ---------------------------- */

export type AvailabilitySlot = {
  start: string;
  end: string;
  label: string;
  capacity: number;
  left: number;
  open: boolean;
};

export type AvailabilityDate = {
  date: string;
  closed: boolean;
  reason: string;
  slots: AvailabilitySlot[];
};

export type AvailabilityResponse =
  | {
      ok: true;
      today: string;
      lastDate: string;
      dates: AvailabilityDate[];
    }
  | { ok: false };

export type BookingPayload = {
  id: string;
  source: string;
  name: string;
  mobile: string;
  visitType: string;
  reason: string;
  date: string;
  slotStart: string;
  notes: string;
  consent: string;
};

export type BookResponse =
  | { ok: true; code: "ok"; slot: string }
  | { ok: false; code?: string };

async function postToWebhook(body: Record<string, unknown>): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(process.env.SHEETS_WEBHOOK_URL as string, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...body,
        secret: process.env.SHEETS_WEBHOOK_SECRET,
      }),
      // Apps Script answers POSTs with a redirect to the web app content.
      redirect: "follow",
      cache: "no-store",
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`webhook ${res.status}`);
    }
    return (await res.json()) as unknown;
  } finally {
    clearTimeout(timer);
  }
}

/* ------------------------ Availability (cached) ----------------------- */

const availCache = new Map<
  string,
  { at: number; data: AvailabilityResponse }
>();

/** Availability for `days` days starting at `from` (YYYY-MM-DD). */
export async function getAvailability(
  from: string,
  days: number,
): Promise<AvailabilityResponse> {
  const key = `${from}:${days}`;
  const hit = availCache.get(key);
  if (hit && Date.now() - hit.at < AVAIL_TTL_MS) return hit.data;
  const json = (await postToWebhook({
    action: "availability",
    from,
    days,
  })) as AvailabilityResponse;
  availCache.set(key, { at: Date.now(), data: json });
  return json;
}

/**
 * Book one slot. The capacity check happens inside the Apps Script under a
 * lock. Throws on HTTP, JSON or timeout errors; callers catch. Every book
 * call clears the availability cache so counts stay fresh.
 */
export async function bookSlot(booking: BookingPayload): Promise<BookResponse> {
  try {
    const json = (await postToWebhook({
      action: "book",
      booking,
    })) as BookResponse;
    return json;
  } finally {
    availCache.clear();
  }
}
