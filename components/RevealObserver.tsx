"use client";

import { useEffect } from "react";

/**
 * Reveal helper: fades elements with [data-reveal] up 16px over 500ms,
 * once, via IntersectionObserver. Content stays visible at rest without
 * JS. Never applied to the hero / LCP element.
 */
export default function RevealObserver() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("rv");
            io.unobserve(en.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
