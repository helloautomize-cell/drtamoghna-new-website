"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { isReasonSlug } from "@/lib/booking-context";
import { dateBounds, normalizeMobile } from "@/lib/booking-validation";

/**
 * Booking form Server Action (content Page 7).
 * Validates with Zod, normalizes the mobile to +91, rejects honeypot and
 * too-fast submissions, then redirects to /thank-you/. Email sending
 * arrives in Phase 6 (RESEND_API_KEY); the request is validated and
 * accepted either way for now.
 */

const schema = z.object({
  patientName: z
    .string()
    .trim()
    .min(2, "Please enter the patient's name")
    .max(80),
  mobile: z.string().trim().min(1, "Please enter a mobile number"),
  age: z.string().trim().min(1, "Please enter the age"),
  ageUnit: z.enum(["years", "months"]),
  doctor: z.literal("dr-tamoghna-das"),
  reason: z.string().refine(isReasonSlug, "Please choose a reason"),
  preferredDate: z.string().min(1, "Please choose a date"),
  timeOfDay: z.enum(["morning", "afternoon", "evening"]),
  city: z.string().trim().max(60).optional().or(z.literal("")),
  under18: z.string().optional(),
  guardianName: z.string().trim().max(80).optional().or(z.literal("")),
  guardianConsent: z.string().optional(),
  consent: z.string().optional(),
  website: z.string().optional(), // honeypot
  ts: z.string().optional(), // render timestamp
});

export interface BookingState {
  errors: Record<string, string>;
  values?: Record<string, string>;
  formError?: string;
}

export async function bookAppointment(
  _prev: BookingState,
  formData: FormData,
): Promise<BookingState> {
  const raw: Record<string, string> = {};
  for (const key of [
    "patientName",
    "mobile",
    "age",
    "ageUnit",
    "doctor",
    "reason",
    "preferredDate",
    "timeOfDay",
    "city",
    "guardianName",
    "website",
    "ts",
    "under18",
    "guardianConsent",
    "consent",
  ]) {
    const v = formData.get(key);
    raw[key] = typeof v === "string" ? v : "";
  }

  // Honeypot: bots only. Reject without detail.
  if (raw.website) {
    return { errors: {}, formError: "Your request could not be sent. Please call or WhatsApp us." };
  }
  // Minimum fill time (3 s): bots submit instantly.
  const ts = Number(raw.ts);
  if (ts && Date.now() - ts < 3000) {
    return { errors: {}, formError: "That was too quick. Please review the form and try again." };
  }

  const parsed = schema.safeParse(raw);
  const errors: Record<string, string> = {};
  const values: Record<string, string> = {
    patientName: raw.patientName,
    mobile: raw.mobile,
    age: raw.age,
    ageUnit: raw.ageUnit,
    reason: raw.reason,
    preferredDate: raw.preferredDate,
    timeOfDay: raw.timeOfDay,
    city: raw.city,
    guardianName: raw.guardianName,
    under18: raw.under18,
    guardianConsent: raw.guardianConsent,
    consent: raw.consent,
  };

  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const k = String(issue.path[0]);
      if (!errors[k]) errors[k] = issue.message;
    }
  }

  const mobile = normalizeMobile(raw.mobile);
  if (raw.mobile && !mobile) {
    errors.mobile = "Enter a 10-digit Indian mobile number starting with 6, 7, 8 or 9";
  }

  const ageNum = Number(raw.age);
  if (raw.age && (!Number.isFinite(ageNum) || ageNum <= 0 || ageNum > 120)) {
    errors.age = "Enter a valid age";
  }
  if (raw.ageUnit === "months" && ageNum > 36) {
    errors.age = "Age in months should be 36 or less. Choose years instead.";
  }

  const { min, max } = dateBounds();
  if (raw.preferredDate && (raw.preferredDate < min || raw.preferredDate > max)) {
    errors.preferredDate = "Choose a date within the next 60 days";
  }
  if (raw.preferredDate) {
    const d = new Date(`${raw.preferredDate}T12:00:00+05:30`);
    const istDay = new Date(d.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })).getDay();
    if (istDay === 0 && raw.timeOfDay === "evening") {
      errors.timeOfDay = "On Sunday we are open 9 am to 3:30 pm. Please choose morning or afternoon.";
    }
  }

  if (raw.under18) {
    if (!raw.guardianName || raw.guardianName.trim().length < 2) {
      errors.guardianName = "Please enter the parent or guardian's name";
    }
    if (!raw.guardianConsent) {
      errors.guardianConsent = "Please confirm you are the parent or legal guardian";
    }
  }

  if (!raw.consent) {
    errors.consent = "Please tick the consent box so we can contact you";
  }

  if (Object.keys(errors).length) {
    return { errors, values };
  }

  // Valid request. Phase 6 will email this; for now it is accepted.
  redirect("/thank-you/");
}
