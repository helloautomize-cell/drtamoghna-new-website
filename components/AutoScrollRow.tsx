"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/**
 * Self-moving scroll-snap row for mobile carousels.
 * Every 4.5s, loops to start at the end, pauses on hover, focus, touch,
 * wheel and a hidden tab, resumes 6s after the last interaction.
 * Pause/play button (WCAG 2.2.2) + progress bar. Off under reduced motion.
 * `mobileOnly`: only auto-advances below 768px.
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
  const pausedRef = useRef(false);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let user = false;
    let resume: ReturnType<typeof setTimeout> | undefined;

    const active = () =>
      !reduce &&
      !pausedRef.current &&
      !user &&
      !document.hidden &&
      (!mobileOnly || window.innerWidth < 768);

    const step = () => {
      const c = row.children[0] as HTMLElement | undefined;
      if (!c) return;
      const gap = parseFloat(getComputedStyle(row).gap || "0") || 0;
      const w = c.getBoundingClientRect().width + gap;
      const max = row.scrollWidth - row.clientWidth;
      row.scrollTo({
        left: row.scrollLeft + w > max + 2 ? 0 : row.scrollLeft + w,
        behavior: "smooth",
      });
    };

    const update = () => {
      const bar = barRef.current;
      if (!bar) return;
      const max = row.scrollWidth - row.clientWidth;
      bar.style.width = `${max > 0 ? Math.min(100, (row.scrollLeft / max) * 100) : 100}%`;
    };

    const hold = () => {
      user = true;
      clearTimeout(resume);
      resume = setTimeout(() => (user = false), 6000);
    };

    const timer = setInterval(() => {
      if (active()) step();
    }, 4500);

    const events = ["pointerenter", "focusin", "touchstart", "wheel"] as const;
    events.forEach((e) => row.addEventListener(e, hold, { passive: true }));
    row.addEventListener("scroll", update, { passive: true });
    update();

    return () => {
      clearInterval(timer);
      clearTimeout(resume);
      events.forEach((e) => row.removeEventListener(e, hold));
      row.removeEventListener("scroll", update);
    };
  }, [mobileOnly]);

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
            onClick={() => {
              pausedRef.current = !pausedRef.current;
              setPaused(pausedRef.current);
            }}
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
