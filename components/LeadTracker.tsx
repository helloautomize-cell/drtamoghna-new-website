"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

/**
 * Fires `generate_lead` (GA4 conversion event) once when a form submission
 * has succeeded: on the booking form's success card, or on the thank-you
 * page. Only form_name and page_path are sent; no PII or health data.
 */
export default function LeadTracker({ formType }: { formType: string }) {
  const pathname = usePathname();
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackEvent("generate_lead", {
      form_name: formType === "contact" ? "contact_form" : "appointment_form",
      page_path: pathname,
    });
  }, [formType, pathname]);
  return null;
}
