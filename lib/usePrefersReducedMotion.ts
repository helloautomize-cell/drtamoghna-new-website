"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const mq = matchMedia(QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

/** True when the user prefers reduced motion. SSR-safe (false on server). */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => matchMedia(QUERY).matches,
    () => false,
  );
}
