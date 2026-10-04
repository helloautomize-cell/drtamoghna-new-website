import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

/** Shared timings for every auto-advancing row and carousel. */
export const AUTO_ADVANCE_MS = 3000;
export const RESUME_AFTER_MS = 4000;
export const SCROLL_MS = 450;

let rafId = 0;

/** Smoothly scroll a row to `left` over ~SCROLL_MS (instant under reduced motion). */
export function smoothScrollTo(el: HTMLElement, left: number, ms = SCROLL_MS) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || ms <= 0) {
    el.scrollLeft = left;
    return;
  }
  cancelAnimationFrame(rafId);
  const from = el.scrollLeft;
  const dist = left - from;
  if (!dist) return;
  const t0 = performance.now();
  const tick = (t: number) => {
    const p = Math.min(1, (t - t0) / ms);
    const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    el.scrollLeft = from + dist * e;
    if (p < 1) rafId = requestAnimationFrame(tick);
  };
  rafId = requestAnimationFrame(tick);
}

/** Bind a progress bar `<i>` to a row's scroll position. Returns cleanup. */
export function bindRowProgress(row: HTMLElement, bar: HTMLElement) {
  const update = () => {
    const max = row.scrollWidth - row.clientWidth;
    bar.style.width = `${max > 0 ? Math.min(100, (row.scrollLeft / max) * 100) : 100}%`;
  };
  row.addEventListener("scroll", update, { passive: true });
  update();
  return () => row.removeEventListener("scroll", update);
}

/**
 * Auto-advance behaviour for a native scroll-snap row.
 * Advances one card every AUTO_ADVANCE_MS, rewinds smoothly to the first
 * card at the end, pauses on touch, hover, focus, wheel, a hidden tab and
 * while the row is off-screen, and resumes RESUME_AFTER_MS after the last
 * interaction. Never runs under prefers-reduced-motion.
 * `maxWidth` limits auto-advance to viewports below the breakpoint.
 * Returns pause state plus a toggle for the pause/play button.
 */
export function useAutoScrollRow(
  rowRef: RefObject<HTMLElement | null>,
  opts: { maxWidth?: number } = {},
) {
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const maxWidth = opts.maxWidth ?? 767;

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let user = false;
    let visible = true;
    let resume: ReturnType<typeof setTimeout> | undefined;

    let io: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => entries.forEach((en) => (visible = en.isIntersecting)),
        { threshold: 0.15 },
      );
      io.observe(row);
    }

    const active = () =>
      !reduce &&
      !pausedRef.current &&
      !user &&
      !document.hidden &&
      visible &&
      window.innerWidth <= maxWidth;

    const step = () => {
      const c = row.children[0] as HTMLElement | undefined;
      if (!c) return;
      const gap = parseFloat(getComputedStyle(row).gap || "0") || 0;
      const w = c.getBoundingClientRect().width + gap;
      const max = row.scrollWidth - row.clientWidth;
      smoothScrollTo(row, row.scrollLeft + w > max + 2 ? 0 : row.scrollLeft + w);
    };

    const hold = () => {
      user = true;
      clearTimeout(resume);
      resume = setTimeout(() => (user = false), RESUME_AFTER_MS);
    };

    const timer = setInterval(() => {
      if (active()) step();
    }, AUTO_ADVANCE_MS);

    const events = ["pointerenter", "focusin", "touchstart", "wheel"] as const;
    events.forEach((e) => row.addEventListener(e, hold, { passive: true }));

    return () => {
      clearInterval(timer);
      clearTimeout(resume);
      events.forEach((e) => row.removeEventListener(e, hold));
      io?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxWidth]);

  const togglePause = useCallback(() => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
  }, []);

  return { paused, togglePause };
}
