"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { images } from "@/lib/images";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/**
 * "Inside our echo room" silent loop. preload="none" and the video only
 * plays while at least half visible (IntersectionObserver); under
 * prefers-reduced-motion the poster shows with a play button instead.
 * No network request for the video until it is on screen.
 */
export default function EchoVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [reducedPlay, setReducedPlay] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video || reduced || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([en]) => {
        if (en.intersectionRatio >= 0.5) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: [0, 0.5, 1] },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [reduced]);

  if (reduced && !reducedPlay) {
    return (
      <figure className="echovideo">
        <button
          type="button"
          className="ev-poster"
          onClick={() => {
            setReducedPlay(true);
            requestAnimationFrame(() => ref.current?.play().catch(() => {}));
          }}
          aria-label="Play video: inside our echo room"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images.echoPoster.src} alt={images.echoPoster.alt} loading="lazy" />
          <span className="ev-play">
            <Play size={22} strokeWidth={2} aria-hidden />
          </span>
        </button>
        <figcaption>
          Inside our echo room. Dr. Das performs every echocardiogram himself.
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className="echovideo">
      <video
        ref={ref}
        muted
        playsInline
        loop
        preload="none"
        poster={images.echoPoster.src}
        src={images.echoLoop.src}
        aria-label={images.echoLoop.alt}
      />
      <figcaption>
        Inside our echo room. Dr. Das performs every echocardiogram himself.
      </figcaption>
    </figure>
  );
}
