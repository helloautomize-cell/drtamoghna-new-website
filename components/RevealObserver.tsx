"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Reveal helper: fades elements with [data-reveal] up 16px over 500ms,
 * once, via IntersectionObserver. Runs on every route change, reveals
 * anything already in or above the viewport immediately, and has a
 * 1.2s failsafe so content can never stay hidden. Off under reduced
 * motion (the hidden state is gated on html.js-rv, which the layout
 * script only sets when motion is allowed).
 */
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const reveal = (el: Element) => el.classList.add("rv");
    const els = Array.from(
      document.querySelectorAll("[data-reveal]:not(.rv)"),
    );
    if (!els.length) return;

    let io: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) =>
          entries.forEach((en) => {
            if (en.isIntersecting) {
              reveal(en.target);
              io?.unobserve(en.target);
            }
          }),
        { rootMargin: "0px 0px -8% 0px" },
      );
    }

    const vh = window.innerHeight;
    els.forEach((el) => {
      if (el.getBoundingClientRect().top < vh) reveal(el);
      else io?.observe(el);
    });

    const failsafe = setTimeout(() => {
      document.querySelectorAll("[data-reveal]:not(.rv)").forEach(reveal);
    }, 1200);

    return () => {
      io?.disconnect();
      clearTimeout(failsafe);
    };
  }, [pathname]);

  return null;
}
