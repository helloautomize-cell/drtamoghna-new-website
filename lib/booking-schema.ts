import { z } from "zod";
import { VISIT_TYPES, isReasonFor } from "@/data/booking-options";

/**
 * Shared booking schema for the slot booking form. Client forms use it for
 * inline errors; the server action parses again before anything reaches the
 * Sheet. Dates are checked in Asia/Kolkata, matching the Apps Script.
 */

export const CONSENT_VERSION = "v1";

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const YMD = /^\d{4}-\d{2}-\d{2}$/;
const HHMM = /^\d{2}:\d{2}$/;

/** YYYY-MM-DD for a moment, in Asia/Kolkata. */
export function istDateString(now: Date = new Date()): string {
  return new Date(now.getTime() + IST_OFFSET_MS).toISOString().slice(0, 10);
}

export function addDays(ymd: string, days: number): string {
  const d = new Date(`${ymd}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** true when value is a real calendar date from today to today+30, IST. */
export function isBookingDateValid(
  value: string,
  today: string = istDateString(),
): boolean {
  if (!YMD.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== value) {
    return false;
  }
  return value >= today && value <= addDays(today, 30);
}

/**
 * Normalise an Indian mobile to 10 digits: strip spaces/dashes/brackets,
 * a +91 (or bare 91) country code and leading zeros. Anything that is not a
 * 10-digit Indian mobile is returned cleaned but unmodified, so
 * international numbers still survive.
 */
export function normalizeMobile(raw: string): string {
  let v = raw.trim().replace(/[\s\-()]/g, "");
  if (v.startsWith("+91")) v = v.slice(3);
  while (v.startsWith("0")) v = v.slice(1);
  if (v.startsWith("91") && v.length === 12) v = v.slice(2);
  return v;
}

const INDIAN_MOBILE = /^[6-9]\d{9}$/;
const INTL_PHONE = /^\+?[0-9]{10,15}$/;

export const mobileSchema = z
  .string()
  .transform(normalizeMobile)
  .pipe(
    z.union([
      z.string().regex(INDIAN_MOBILE, "Enter a valid 10 digit mobile number"),
      z.string().regex(INTL_PHONE, "Enter a valid phone number"),
    ]),
  );

export const bookingSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Please enter your name")
      .max(60, "Name looks too long"),
    mobile: mobileSchema,
    visitType: z.enum(VISIT_TYPES, "Please choose what brings you in"),
    reason: z
      .string()
      .trim()
      .min(1, "Please choose a reason")
      .max(160, "Reason looks too long"),
    date: z
      .string()
      .refine((v) => isBookingDateValid(v), "Choose a date within the next 30 days"),
    slotStart: z
      .string()
      .regex(HHMM, "Please pick a time slot"),
    notes: z.string().trim().max(300, "Keep this under 300 characters").default(""),
    consent: z.literal(true, "Please tick the consent box so we can call you"),
  })
  .superRefine((data, ctx) => {
    if (!isReasonFor(data.visitType, data.reason)) {
      ctx.addIssue({
        code: "custom",
        path: ["reason"],
        message:
          data.visitType === "Test only"
            ? "Please choose a test"
            : "Please choose a reason",
      });
    }
  });

export type BookingInput = z.input<typeof bookingSchema>;
export type BookingData = z.output<typeof bookingSchema>;
export type BookingField = keyof BookingData;

/** Show only the ends of a number: "9876543210" -> "98XXXXXX10". */
export function maskMobile(mobile: string): string {
  return mobile.length > 4
    ? `${mobile.slice(0, 2)}XXXXXX${mobile.slice(-2)}`
    : mobile;
}
