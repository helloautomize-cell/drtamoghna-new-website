"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Pause, Play } from "lucide-react";
import { serviceTabs } from "@/lib/services";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import {
  AUTO_ADVANCE_MS,
  RESUME_AFTER_MS,
  bindRowProgress,
  smoothScrollTo,
  useAutoScrollRow,
} from "@/lib/motion";
import ServiceBadgeCard from "./ServiceBadgeCard";

/**
 * Service tabs + carousel of ServiceBadgeCards.
 * Below 768px: native scroll-snap row driven by the shared motion module
 * (no transforms, real scroll). Desktop: Embla with loop off and snaps
 * trimmed, re-initialised after fonts load and on every tab change, so
 * the cards are always measured on a settled layout. Autoplay uses the
 * shared timings, rewinds at the end, and pauses on touch, hover, focus,
 * a hidden tab and while off-screen. Pause/play + progress bar stay.
 */
export default function ServiceTabs() {
  const [tab, setTab] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const pausedRef = useRef(false);
  const userRef = useRef(false);
  const visibleRef = useRef(true);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const viewportRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const mRowRef = useRef<HTMLDivElement>(null);
  const mBarRef = useRef<HTMLElement>(null);

  const current = serviceTabs[tab];
  const { paused: mPaused, togglePause: mToggle } = useAutoScrollRow(mRowRef, {
    maxWidth: 767,
  });

  // Mobile progress bar
  useEffect(() => {
    const row = mRowRef.current;
    const bar = mBarRef.current;
    if (!row || !bar) return;
    return bindRowProgress(row, bar);
  }, [tab]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    containScroll: "trimSnaps",
  });

  // Re-init when the slide set changes, once fonts settle, and whenever
  // the desktop viewport becomes visible again after a breakpoint cross.
  useEffect(() => {
    if (!emblaApi) return;
    const reinit = () => {
      emblaApi.reInit({ loop: false, align: "start", containScroll: "trimSnaps" });
      emblaApi.scrollTo(0, true);
    };
    reinit();
    let live = true;
    document.fonts?.ready.then(() => live && emblaApi.reInit());
    const mq = matchMedia("(min-width: 768px)");
    const onMq = () => mq.matches && emblaApi.reInit();
    mq.addEventListener("change", onMq);
    return () => {
      live = false;
      mq.removeEventListener("change", onMq);
    };
  }, [emblaApi, current]);

  // Mobile row: reset scroll on tab change
  useEffect(() => {
    mRowRef.current?.scrollTo({ left: 0 });
  }, [tab]);

  // Progress bar (desktop Embla)
  useEffect(() => {
    if (!emblaApi) return;
    const update = () => {
      const bar = barRef.current;
      if (bar) {
        const p = Math.min(100, Math.max(0, emblaApi.scrollProgress() * 100));
        bar.style.width = `${p}%`;
      }
    };
    emblaApi.on("scroll", update);
    emblaApi.on("reInit", update);
    update();
    return () => {
      emblaApi.off("scroll", update);
      emblaApi.off("reInit", update);
    };
  }, [emblaApi, tab]);

  // Autoplay + off-screen gate (desktop Embla)
  useEffect(() => {
    if (!emblaApi) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const viewport = emblaApi.rootNode();
    const hold = () => {
      userRef.current = true;
      clearTimeout(resumeRef.current);
      resumeRef.current = setTimeout(() => (userRef.current = false), RESUME_AFTER_MS);
    };
    const enter = () => {
      userRef.current = true;
      clearTimeout(resumeRef.current);
    };
    const leave = () => {
      clearTimeout(resumeRef.current);
      userRef.current = false;
    };
    let io: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => entries.forEach((en) => (visibleRef.current = en.isIntersecting)),
        { threshold: 0.15 },
      );
      io.observe(viewport);
    }
    const events = ["focusin", "touchstart", "wheel"] as const;
    events.forEach((e) => viewport.addEventListener(e, hold, { passive: true }));
    viewport.addEventListener("pointerenter", enter, { passive: true });
    viewport.addEventListener("pointermove", enter, { passive: true });
    viewport.addEventListener("pointerleave", leave, { passive: true });
    const timer = setInterval(() => {
      if (
        reduce ||
        pausedRef.current ||
        userRef.current ||
        !visibleRef.current ||
        document.hidden
      )
        return;
      if (emblaApi.canScrollNext()) emblaApi.scrollNext();
      else emblaApi.scrollTo(0);
    }, AUTO_ADVANCE_MS);
    return () => {
      clearInterval(timer);
      clearTimeout(resumeRef.current);
      io?.disconnect();
      events.forEach((e) => viewport.removeEventListener(e, hold));
      viewport.removeEventListener("pointerenter", enter);
      viewport.removeEventListener("pointermove", enter);
      viewport.removeEventListener("pointerleave", leave);
    };
  }, [emblaApi]);

  // Touch devices: spin the orbit ring once on first scroll into view
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = matchMedia("(hover: none)").matches;
    if (reduce || !touch || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("spin");
            io.unobserve(en.target);
          }
        }),
      { threshold: 0.6 },
    );
    [viewportRef.current, mRowRef.current].forEach((root) =>
      root?.querySelectorAll(".badge").forEach((b) => io.observe(b)),
    );
    return () => io.disconnect();
  }, [tab]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!emblaApi) return;
      if (e.key === "ArrowLeft") emblaApi.scrollPrev();
      if (e.key === "ArrowRight") emblaApi.scrollNext();
    },
    [emblaApi],
  );

  const onMobileKeyDown = (e: React.KeyboardEvent) => {
    const row = mRowRef.current;
    if (!row) return;
    const c = row.children[0] as HTMLElement | undefined;
    if (!c) return;
    const gap = parseFloat(getComputedStyle(row).gap || "0") || 0;
    const w = c.getBoundingClientRect().width + gap;
    if (e.key === "ArrowLeft") smoothScrollTo(row, row.scrollLeft - w);
    if (e.key === "ArrowRight") smoothScrollTo(row, row.scrollLeft + w);
  };

  const cards = current.cards.map((c, i) => (
    <div key={c.href} className="sg-slide">
      <ServiceBadgeCard card={c} glow={current.glow} eager={i < 2} />
    </div>
  ));

  return (
    <>
      <div className="tabs" role="tablist" aria-label="Service groups">
        {serviceTabs.map((t, i) => (
          <button
            key={t.label}
            className="tab"
            role="tab"
            aria-selected={tab === i}
            onClick={() => setTab(i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p style={{ margin: 0, color: "var(--ink-2)" }}>{current.intro}</p>
      {/* Every group's links stay in the DOM (not only the active tab's) so the
          full service list is present in the server HTML and works without JS. */}
      {serviceTabs.map((t, i) =>
        i === tab ? null : (
          <div key={t.label} role="tabpanel" hidden aria-hidden="true">
            <b>{t.label}</b>
            <ul>
              {t.cards.map((c) => (
                <li key={c.href}>
                  <a href={c.href}>{c.title}</a>
                </li>
              ))}
            </ul>
          </div>
        ),
      )}
      <div className="washsvc">
        <div className="sg-mob">
          <div
            className="sg-mrow"
            ref={mRowRef}
            onKeyDown={onMobileKeyDown}
            tabIndex={0}
            aria-label={`${current.label} services`}
          >
            {cards}
          </div>
          <div className="ctrl">
            {!reduced && (
              <button
                className="pp"
                type="button"
                aria-label={mPaused ? "Play slideshow" : "Pause slideshow"}
                onClick={mToggle}
              >
                {mPaused ? (
                  <Play size={14} aria-hidden />
                ) : (
                  <Pause size={14} aria-hidden />
                )}
              </button>
            )}
            <span className="prog">
              <i ref={mBarRef} />
            </span>
          </div>
        </div>
        <div className="sg-emb">
          <div
            className="sg-embla"
            ref={(el) => {
              emblaRef(el);
              viewportRef.current = el;
            }}
            onKeyDown={onKeyDown}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                display: "flex",
                gap: 22,
                paddingBlock: "8px 20px",
                maskImage: "linear-gradient(90deg, #000 92%, transparent)",
                WebkitMaskImage: "linear-gradient(90deg, #000 92%, transparent)",
              }}
            >
              {cards}
            </div>
          </div>
          <div className="ctrl">
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
        </div>
      </div>
    </>
  );
}
