"use client";

import { useSyncExternalStore } from "react";

/**
 * useMounted · true only after client hydration, without setState in an
 * effect (React 19 lint). Server and first client render return false.
 */
const emptySubscribe = () => () => {};

export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
