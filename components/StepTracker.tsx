"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { visitSteps } from "@/lib/services";
import { images, type ImageKey } from "@/lib/images";
import { useAutoScrollRow } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { BookingFormMock, WhatsAppMock } from "./PhoneMocks";

function StepMedia({ mock, img, eager = false }: { mock: string | null; img?: ImageKey; eager?: boolean }) {
  if (mock === "booking") return <BookingFormMock />;
  if (mock === "whatsapp") return <WhatsAppMock />;
  if (img) {
    const im = images[img];
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={im.src}
        alt={im.alt}
        width={im.width}
        height={im.height}
        loading={eager ? "eager" : "lazy"}
      />
    );
  }
  return null;
}

/**
 * StepTracker, six steps with real Home copy.
 * Desktop: sticky left column (big number, step name, rail) driven by
 * IntersectionObserver and click. Mobile (<900px): swipe slides with
 * "Step n of 6" and a progress bar.
 */
export default function StepTracker() {
  const [cur, setCur] = useState(0);
  const stepsRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);
  const [mobileIdx, setMobileIdx] = useState(0);
  const reduced = usePrefersReducedMotion();
  const { paused, togglePause } = useAutoScrollRow(slidesRef, { maxWidth: 899 });


  // IntersectionObserver drives the active step
  useEffect(() => {
    const steps = stepsRef.current;
    if (!steps || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) setCur(Number((en.target as HTMLElement).dataset.i));
        }),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    steps.querySelectorAll(".step").forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Mobile slide progress
  useEffect(() => {
    const slides = slidesRef.current;
    if (!slides) return;
    const onScroll = () => {
      const w = (slides.children[0] as HTMLElement)?.getBoundingClientRect().width ?? 1;
      const idx = Math.min(visitSteps.length - 1, Math.round(slides.scrollLeft / (w + 14)));
      setMobileIdx(idx);
    };
    slides.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => slides.removeEventListener("scroll", onScroll);
  }, []);

  const jump = (i: number) => {
    setCur(i);
    stepsRef.current?.querySelectorAll(".step")[i]?.scrollIntoView({
      block: "center",
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="tracker">
        <div className="trk-side">
          <div className="trk-num">{String(cur + 1).padStart(2, "0")}</div>
          <div className="trk-lab">{visitSteps[cur].name}</div>
          <div className="rail" aria-hidden>
            {visitSteps.map((_, i) => (
              <i key={i} className={i < cur ? "done" : i === cur ? "now" : ""} />
            ))}
          </div>
        </div>
        <div className="steps" ref={stepsRef}>
          {visitSteps.map((s, i) => (
            <div
              key={s.name}
              className={`step ${i === cur ? "on" : ""}`}
              data-i={i}
              tabIndex={0}
              onClick={() => jump(i)}
              onKeyDown={(e) => e.key === "Enter" && jump(i)}
            >
              <small>{String(i + 1).padStart(2, "0")}</small>
              <h3>{s.name}</h3>
              <p>{s.text}</p>
              <div className="step-media">
                <StepMedia mock={s.mock} img={s.img} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="trk-mobile">
        <div className="trk-slides" ref={slidesRef}>
          {visitSteps.map((s, i) => (
            <div className="trk-slide" key={s.name}>
              <div className="step-media">
                <StepMedia mock={s.mock} img={s.img} eager={i < 2} />
              </div>
              <small>{String(i + 1).padStart(2, "0")}</small>
              <h3>{s.name}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
        <div className="trk-foot">
          <div className="trk-count">
            Step {mobileIdx + 1} of {visitSteps.length}
          </div>
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
        </div>
        <div className="trk-prog">
          <i style={{ width: `${((mobileIdx + 1) / visitSteps.length) * 100}%` }} />
        </div>
      </div>
    </>
  );
}
