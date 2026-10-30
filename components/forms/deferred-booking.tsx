"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
} from "react";
import type { BookingLayout, BookingValues } from "@/components/forms/booking-fields";

/**
 * Below-the-fold wrapper for the homepage booking form. The real form
 * (controller, fields and the zod schema) stays out of the initial JS and
 * is not even fetched until the section gets near the viewport, so nothing
 * parses, hydrates, downloads or calls getSlots during load. Uses a manual
 * import() rather than next/dynamic: a dynamic() boundary would still emit
 * a preload hint that downloads the chunk up front.
 *
 * While unloaded, an inert skeleton mirrors the form's first paint: real
 * labels and card shapes at roughly the real height, so the mount swap
 * does not shift the layout or leave a blank gap.
 */

type ControllerProps = {
  surface: string;
  layout: BookingLayout;
  formId?: string;
  initialVisitType?: BookingValues["visitType"];
  initialReason?: string;
};

const SKELETON_VISIT_TYPES = [
  "New consultation",
  "Follow-up",
  "Show reports",
  "Test only",
];

function BookingSkeleton() {
  return (
    <div className="bform booking compact book-skeleton" aria-hidden="true">
      <fieldset className="bk-step">
        <legend>1. What brings you in?</legend>
        <div className="vt-grid">
          {SKELETON_VISIT_TYPES.map((t) => (
            <span className="vt-card" key={t}>
              <span>{t}</span>
            </span>
          ))}
        </div>
      </fieldset>

      <div className="bk-step">
        <div className="fld">
          <span className="fld-like">2. Reason for visit</span>
          <span className="bks bks-input">Choose what brings you in first</span>
        </div>
      </div>

      <fieldset className="bk-step">
        <legend>3. Choose a day and time</legend>
        <div className="day-strip">
          {Array.from({ length: 8 }, (_, i) => (
            <span className="day bks" key={i} />
          ))}
        </div>
        <div className="slot-grid">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className="slot skeleton" />
          ))}
        </div>
      </fieldset>

      <fieldset className="bk-step">
        <legend>4. Your details</legend>
        <div className="fld">
          <span className="fld-like">Name</span>
          <span className="bks bks-input" />
        </div>
        <div className="fld">
          <span className="fld-like">Mobile</span>
          <span className="bks bks-input" />
        </div>
        <div className="fld">
          <span className="fld-like">
            Anything we should know? <span className="opt">(optional)</span>
          </span>
          <span className="bks bks-area" />
        </div>
        <div className="fld check">
          <span className="bks bks-check" />
          <span className="bks-consent">
            I agree that Medcare may call me about this request.
          </span>
        </div>
      </fieldset>

      <span className="bform-submit bks-submit">Request appointment</span>
      <p className="fld-note under">
        No advance payment. Pay at the clinic by cash, UPI or card.
      </p>
    </div>
  );
}

export function DeferredBooking(props: ControllerProps) {
  const host = useRef<HTMLDivElement>(null);
  const [Controller, setController] =
    useState<ComponentType<ControllerProps> | null>(null);

  useEffect(() => {
    const el = host.current;
    if (!el || Controller) return;
    let cancelled = false;
    const arm = () => {
      import("@/components/forms/booking-form-controller").then((m) => {
        if (!cancelled) setController(() => m.BookingFormController);
      });
    };
    if (typeof IntersectionObserver === "function") {
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            arm();
            io.disconnect();
          }
        },
        { rootMargin: "640px 0px" },
      );
      io.observe(el);
      return () => {
        cancelled = true;
        io.disconnect();
      };
    }
    const t = window.setTimeout(arm, 2000);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [Controller]);

  return (
    <div ref={host} className="book-defer">
      {Controller ? <Controller {...props} /> : <BookingSkeleton />}
    </div>
  );
}
