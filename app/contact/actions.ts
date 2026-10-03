"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { isReasonSlug, BOOKING_REASONS } from "@/lib/booking-context";
import { dateBounds, normalizeMobile } from "@/lib/booking-validation";
import { GUARDIAN_CONSENT_TEXT, PATIENT_CONSENT_TEXT } from "@/lib/consent-text";
import { rateLimited } from "@/lib/rate-limit";
import { siteConfig } from "@/lib/site-config";

/**
 * Booking form Server Action (content Page 7, master Part 9.1).
 * Validates with Zod, normalizes the mobile to +91, rejects honeypot,
 * too-fast and rate-limited submissions, verifies Turnstile when its
 * keys are set, then emails the clinic via Resend. Nothing about the
 * patient is logged.
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
  consentAt: z.string().optional(), // consent tick time (client-set)
  source: z.string().trim().max(200).optional().or(z.literal("")),
  "cf-turnstile-response": z.string().optional(),
});

export interface BookingState {
  errors: Record<string, string>;
  values?: Record<string, string>;
  formError?: string;
  /** True when the request validated but the email could not be sent. */
  sendFailed?: boolean;
}

const GENERIC_FAIL =
  "Your request could not be sent. Please call or WhatsApp us and we will book you in.";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function istNow(): string {
  return new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // widget not configured
  if (!token) return false;
  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      },
    );
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

function reasonLabel(slug: string): string {
  return BOOKING_REASONS.find((r) => r.slug === slug)?.label ?? slug;
}

function buildEmail(v: Record<string, string>, mobile: string): string {
  const age = `${esc(v.age)} ${esc(v.ageUnit)}`;
  const rows: [string, string][] = [
    ["Patient name", esc(v.patientName)],
    [
      "Mobile",
      `<a href="tel:${esc(mobile)}">${esc(mobile)}</a> &middot; <a href="https://wa.me/${esc(
        mobile.replace("+", ""),
      )}">WhatsApp</a>`,
    ],
    ["Age", age],
    ["Doctor", "Dr. Tamoghna Das, MBBS, MD (Medicine)"],
    ["Reason for visit", esc(reasonLabel(v.reason))],
    ["Preferred date", esc(v.preferredDate)],
    ["Preferred time", esc(v.timeOfDay)],
  ];
  if (v.city) rows.push(["Town or city", esc(v.city)]);
  if (v.under18) {
    rows.push(["Patient is under 18", "Yes"]);
    rows.push(["Parent or guardian", esc(v.guardianName)]);
    rows.push(["Guardian consent", esc(GUARDIAN_CONSENT_TEXT)]);
  }
  const consentAt = v.consentAt && /^\d+$/.test(v.consentAt)
    ? new Date(Number(v.consentAt)).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : istNow();
  rows.push(["Consent", esc(PATIENT_CONSENT_TEXT)]);
  rows.push(["Consent ticked at (IST)", esc(consentAt)]);
  rows.push(["Source page", esc(v.source || "/contact/")]);
  rows.push(["Received at (IST)", esc(istNow())]);

  const tr = rows
    .map(
      ([k, val]) =>
        `<tr><td style="padding:8px 12px;border:1px solid #ddd;vertical-align:top;font-weight:600">${k}</td><td style="padding:8px 12px;border:1px solid #ddd">${val}</td></tr>`,
    )
    .join("");
  return `<h2 style="font-family:sans-serif">New appointment request, medcare website</h2>
<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">${tr}</table>
<p style="font-family:sans-serif;color:#555">Please call or WhatsApp the patient within ${siteConfig.bookingConfirmation} during clinic hours.</p>`;
}

export async function bookAppointment(
  _prev: BookingState,
  formData: FormData,
): Promise<BookingState> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";

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
    "consentAt",
    "source",
    "cf-turnstile-response",
  ]) {
    const v = formData.get(key);
    raw[key] = typeof v === "string" ? v : "";
  }

  // Honeypot: bots only. Reject without detail.
  if (raw.website) {
    return { errors: {}, formError: GENERIC_FAIL, sendFailed: true };
  }
  // Minimum fill time (3 s): bots submit instantly.
  const ts = Number(raw.ts);
  if (ts && Date.now() - ts < 3000) {
    return {
      errors: {},
      formError: "That was too quick. Please review the form and try again.",
    };
  }
  // Rate limit: 5 submissions per 10 minutes per address.
  if (rateLimited(`book:${ip}`)) {
    return {
      errors: {},
      formError:
        "Too many requests from this connection. Please call or WhatsApp us instead.",
      sendFailed: true,
    };
  }
  // Turnstile: only when the secret is configured.
  if (process.env.TURNSTILE_SECRET_KEY) {
    const ok = await verifyTurnstile(raw["cf-turnstile-response"], ip);
    if (!ok) {
      return { errors: {}, formError: GENERIC_FAIL, sendFailed: true };
    }
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

  // Valid request: email the clinic through Resend.
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // The form is only rendered when the key is set; guard anyway.
    return { errors, values, formError: GENERIC_FAIL, sendFailed: true };
  }
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const to = process.env.RESEND_TO || "medcarebongaigaon@gmail.com";
    const from =
      process.env.RESEND_FROM || "Medcare Website <appointments@resend.dev>";
    const { error } = await resend.emails.send({
      from,
      to,
      subject: `Appointment request: ${raw.patientName.slice(0, 60)}`,
      html: buildEmail(
        { ...raw, ageUnit: raw.ageUnit },
        mobile || raw.mobile,
      ),
    });
    if (error) {
      return { errors: {}, values, formError: GENERIC_FAIL, sendFailed: true };
    }
  } catch {
    return { errors: {}, values, formError: GENERIC_FAIL, sendFailed: true };
  }

  redirect("/thank-you/?type=appointment");
}
