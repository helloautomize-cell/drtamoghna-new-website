"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Pause, Play } from "lucide-react";
import { serviceTabs } from "@/lib/services";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import ServiceBadgeCard from "./ServiceBadgeCard";

/**
 * Service tabs + Embla ServiceCarousel of ServiceBadgeCards.
 * Autoplay every 4.5s (loop), pauses on hover, focus, touch and a hidden
 * tab, resumes 6s after interaction, pause/play button, progress bar,
 * edge fade. On touch devices the orbit ring spins once on first scroll
 * into view. Off under prefers-reduced-motion.
 */
export default function ServiceTabs() {
  const [tab, setTab] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const pausedRef = useRef(false);
  const userRef = useRef(false);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const viewportRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement>(null);

  const current = serviceTabs[tab];
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: current.cards.length > 3,
    align: "start",
    containScroll: false,
    dragFree: false,
  });

  // Re-init when the slide set changes
  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit({ loop: current.cards.length > 3, align: "start", containScroll: false });
    emblaApi.scrollTo(0, true);
  }, [emblaApi, current]);

  // Progress bar
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

  // Autoplay
  useEffect(() => {
    if (!emblaApi) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hold = () => {
      userRef.current = true;
      clearTimeout(resumeRef.current);
      resumeRef.current = setTimeout(() => (userRef.current = false), 6000);
    };
    const viewport = emblaApi.rootNode();
    const events = ["pointerenter", "focusin", "touchstart", "wheel"] as const;
    events.forEach((e) => viewport.addEventListener(e, hold, { passive: true }));
    const timer = setInterval(() => {
      if (reduce || pausedRef.current || userRef.current || document.hidden) return;
      emblaApi.scrollNext();
    }, 4500);
    return () => {
      clearInterval(timer);
      clearTimeout(resumeRef.current);
      events.forEach((e) => viewport.removeEventListener(e, hold));
    };
  }, [emblaApi]);

  // Touch devices: spin the orbit ring once on first scroll into view
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
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
    const badges = viewport.querySelectorAll(".badge");
    badges.forEach((b) => io.observe(b));
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
      <div className="washsvc">
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
            {current.cards.map((c) => (
              <div key={c.href} className="sg-slide">
                <ServiceBadgeCard card={c} glow={current.glow} />
              </div>
            ))}
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
    </>
  );
}
