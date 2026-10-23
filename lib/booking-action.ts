"use server";

import { randomInt } from "node:crypto";
import {
  STANDARD_SLOTS,
  dayName,
  slotLabel,
} from "@/data/booking-options";
import {
  addDays,
  bookingSchema,
  istDateString,
  CONSENT_VERSION,
} from "@/lib/booking-schema";
import {
  bookSlot,
  getAvailability,
  sheetsConfigured,
  type AvailabilityDate,
  type AvailabilityResponse,
} from "@/lib/google-sheets";

/**
 * Server actions for the slot booking form. getSlots feeds the day strip;
 * submitBooking runs the pipeline: honeypot, minimum fill time, zod, then
 * one "book" call to the Sheet (the capacity check lives inside the Apps
 * Script). Form values are never logged outside development.
 */

const MIN_SUBMIT_MS = 3000;
const STRIP_MAX_DAYS = 14;

export type SlotsResult =
  | AvailabilityResponse
  | { ok: false; offline?: boolean };

export type SubmitResult =
  | {
      ok: true;
      bookingId?: string;
      mobile?: string;
      date?: string;
      slotLabel?: string;
    }
  | { ok: false; reason: "slot_unavailable" | "duplicate" | "failed" };

const YMD = /^\d{4}-\d{2}-\d{2}$/;

/** Code-defined sources; never trusted from the URL or a free-text field. */
const SOURCE_MAP: Record<string, string> = {
  book: "website-book",
  home: "website-home",
  contact: "website-contact",
};

function devLog(note: string): void {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[booking] ${note}`);
  }
}

/* ---------------------------- Dev fallback ---------------------------- */

/**
 * With the Sheet env vars unset in development, the standard slot table
 * stands in for live availability (every slot open, four places left).
 */
function devAvailability(from: string, days: number): AvailabilityResponse {
  const today = istDateString();
  const lastDate = addDays(today, 30);
  const dates: AvailabilityDate[] = [];
  for (let i = 0; i < days; i++) {
    const date = addDays(from, i);
    if (date < today || date > lastDate) continue;
    const dow = dayName(date);
    const slots = STANDARD_SLOTS.filter((r) => r.day === dow).map((r) => ({
      start: r.start,
      end: r.end,
      label: slotLabel(r.start, r.end),
      capacity: 4,
      left: 4,
      open: true,
    }));
    dates.push({
      date,
      closed: slots.length === 0,
      reason: slots.length ? "" : "Clinic closed",
      slots,
    });
  }
  return { ok: true, today, lastDate, dates };
}

/* ------------------------------ Actions ------------------------------- */

/** Slots for the day strip (1 to 14 days) or one picked date. */
export async function getSlots(
  from: string,
  days: number,
): Promise<SlotsResult> {
  if (!YMD.test(from) || !Number.isInteger(days) || days < 1 || days > STRIP_MAX_DAYS) {
    return { ok: false };
  }
  if (!sheetsConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      return devAvailability(from, days);
    }
    return { ok: false, offline: true };
  }
  try {
    const res = await getAvailability(from, days);
    if (res.ok !== true) return { ok: false, offline: true };
    return res;
  } catch {
    devLog("availability fetch failed");
    return { ok: false, offline: true };
  }
}

function bookingId(): string {
  const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
  let id = "bk_";
  for (let i = 0; i < 8; i++) id += alphabet[randomInt(36)];
  return id;
}

export async function submitBooking(
  formData: FormData,
): Promise<SubmitResult> {
  const get = (k: string) => String(formData.get(k) ?? "");

  // Honeypot: silently accept so bots do not retry or adapt.
  if (get("website")) {
    devLog("honeypot hit, silently accepted");
    return { ok: true };
  }

  // Minimum fill time: bots submit instantly.
  const started = Date.parse(get("startedAt"));
  if (
    !get("startedAt") ||
    Number.isNaN(started) ||
    Date.now() - started < MIN_SUBMIT_MS
  ) {
    devLog("submitted too fast, silently accepted");
    return { ok: true };
  }

  const parsed = bookingSchema.safeParse({
    name: get("name"),
    mobile: get("mobile"),
    visitType: get("visitType"),
    reason: get("reason"),
    date: get("date"),
    slotStart: get("slotStart"),
    notes: get("notes"),
    consent: formData.get("consent") !== null && get("consent") !== "",
  });
  if (!parsed.success) {
    devLog("schema validation failed");
    return { ok: false, reason: "failed" };
  }
  const data = parsed.data;
  const source = SOURCE_MAP[get("surface")] ?? "website-book";
  const id = bookingId();

  if (!sheetsConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      devLog("sheets env not set; dev passthrough");
      const end =
        STANDARD_SLOTS.find(
          (s) => s.day === dayName(data.date) && s.start === data.slotStart,
        )?.end ?? data.slotStart;
      return {
        ok: true,
        bookingId: "bk_dev0000",
        mobile: data.mobile,
        date: data.date,
        slotLabel: slotLabel(data.slotStart, end),
      };
    }
    return { ok: false, reason: "failed" };
  }

  try {
    const res = await bookSlot({
      id,
      source,
      name: data.name,
      mobile: data.mobile,
      visitType: data.visitType,
      reason: data.reason,
      date: data.date,
      slotStart: data.slotStart,
      notes: data.notes,
      consent: CONSENT_VERSION,
    });
    if (res.ok) {
      return {
        ok: true,
        bookingId: id,
        mobile: data.mobile,
        date: data.date,
        slotLabel: res.slot,
      };
    }
    if (res.code === "slot_full" || res.code === "slot_closed") {
      return { ok: false, reason: "slot_unavailable" };
    }
    if (res.code === "duplicate") {
      return { ok: false, reason: "duplicate" };
    }
    devLog(`book rejected: ${res.code ?? "unknown"}`);
    return { ok: false, reason: "failed" };
  } catch {
    devLog("book call failed");
    return { ok: false, reason: "failed" };
  }
}
