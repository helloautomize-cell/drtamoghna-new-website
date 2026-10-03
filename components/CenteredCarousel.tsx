"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  ArrowLeft,
  ArrowRight,
  Droplet,
  Gauge,
  HeartPulse,
  Moon,
  Pause,
  Play,
  Thermometer,
  Weight,
  type LucideIcon,
} from "lucide-react";
import { centredCards } from "@/lib/services";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const icons: Record<string, LucideIcon> = {
  droplet: Droplet,
  gauge: Gauge,
  heartpulse: HeartPulse,
  weight: Weight,
  moon: Moon,
  thermometer: Thermometer,
};

/**
 * Centred carousel: side cards scale(.92) rotate(-1deg) at 0.5 opacity,
 * active dot widens into a pill. Arrows, dots, swipe, autoplay every
 * 4.5s, pause on hover/focus/touch/hidden tab, resume 6s, off under
 * reduced motion.
 */
export default function CenteredCarousel() {
  const [cur, setCur] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const pausedRef = useRef(false);
  const userRef = useRef(false);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setCur(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

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
      <div
        className="car"
        ref={emblaRef}
        onKeyDown={onKeyDown}
        style={{ overflow: "hidden" }}
        aria-roledescription="carousel"
      >
        <div className="track">
          {centredCards.map((c, i) => {
            const Icon = icons[c.icon];
            return (
              <article className={`cc ${i === cur ? "on" : ""}`} key={c.title}>
                <div className="i">
                  <Icon size={24} strokeWidth={1.75} aria-hidden />
                </div>
                <h3>{c.title}</h3>
                <div className="sub">{c.sub}</div>
                <p>{c.text}</p>
              </article>
            );
          })}
        </div>
      </div>
      <div className="carnav">
        <button
          className="arr"
          type="button"
          aria-label="Previous"
          onClick={() => emblaApi?.scrollPrev()}
        >
          <ArrowLeft size={20} strokeWidth={2} aria-hidden />
        </button>
        <div className="dots">
          {centredCards.map((_, i) => (
            <button
              key={i}
              type="button"
              className={i === cur ? "on" : ""}
              aria-label={`Card ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
            />
          ))}
        </div>
        <button
          className="arr"
          type="button"
          aria-label="Next"
          onClick={() => emblaApi?.scrollNext()}
        >
          <ArrowRight size={20} strokeWidth={2} aria-hidden />
        </button>
        {!reduced && (
          <button
            className="arr"
            type="button"
            aria-label={paused ? "Play slideshow" : "Pause slideshow"}
            onClick={() => {
              pausedRef.current = !pausedRef.current;
              setPaused(pausedRef.current);
            }}
            style={{ width: 40, height: 40 }}
          >
            {paused ? <Play size={16} aria-hidden /> : <Pause size={16} aria-hidden />}
          </button>
        )}
      </div>
    </>
  );
}
