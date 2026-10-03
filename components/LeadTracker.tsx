"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Fires `generate_lead` once on the thank-you page. `form_type` is the only
 * parameter sent; no PII or health data.
 */
export default function LeadTracker({ formType }: { formType: string }) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackEvent("generate_lead", { form_type: formType });
  }, [formType]);
  return null;
}
