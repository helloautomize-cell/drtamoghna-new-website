"use client";

import { useEffect, useRef } from "react";
import { Pause, Play } from "lucide-react";
import { bindRowProgress, useAutoScrollRow } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/**
 * Self-moving scroll-snap row for mobile carousels, on the shared motion
 * module (lib/motion.ts). Advances one card every AUTO_ADVANCE_MS and
 * rewinds at the end; pauses on touch, hover, focus, wheel, a hidden tab
 * and while off-screen. Pause/play button (WCAG 2.2.2) + progress bar.
 * Off under reduced motion. `mobileOnly`: only auto-advances below 768px.
 */
export default function AutoScrollRow({
  children,
  className = "",
  mobileOnly = false,
  ctrlClass = "",
}: {
  children: React.ReactNode;
  className?: string;
  mobileOnly?: boolean;
  ctrlClass?: string;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const { paused, togglePause } = useAutoScrollRow(rowRef, {
    maxWidth: mobileOnly ? 767 : Infinity,
  });

  useEffect(() => {
    const row = rowRef.current;
    const bar = barRef.current;
    if (!row || !bar) return;
    return bindRowProgress(row, bar);
  }, []);

  return (
    <>
      <div ref={rowRef} className={className}>
        {children}
      </div>
      <div className={`ctrl ${ctrlClass}`}>
        {!reduced && (
          <button
            className="pp"
            type="button"
            aria-label={paused ? "Play slideshow" : "Pause slideshow"}
            onClick={togglePause}
          >
            {paused ? <Play size={14} aria-hidden /> : <Pause size={14} aria-hidden />}
          </button>
        )}
        <span className="prog">
          <i ref={barRef} />
        </span>
      </div>
    </>
  );
}
