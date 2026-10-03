"use client";

import { useSyncExternalStore } from "react";

/**
 * consent.ts · Cookie consent store.
 *
 * Records the visitor's choice; components/Analytics.tsx gates GA4 on
 * the `consent:analytics` flag. Essential cookies are always on and are
 * not stored as a choice.
 *
 * Pitfall from master-rules Part 9 avoided: getSnapshot returns a cached
 * snapshot object, never a fresh one, so useSyncExternalStore does not loop.
 */

export type ConsentChoice = { essential: true; analytics: boolean };
export type ConsentState = ConsentChoice | null;

const KEY = "medcare-consent";
export const COOKIE_SETTINGS_EVENT = "medcare:cookie-settings";

let snapshot: ConsentState = null;
const listeners = new Set<() => void>();

function persist(choice: ConsentState) {
  try {
    if (choice === null) window.localStorage.removeItem(KEY);
    else window.localStorage.setItem(KEY, JSON.stringify(choice));
  } catch {
    /* private mode etc: keep the in-memory choice */
  }
}

function read(): ConsentState {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentChoice;
    return { essential: true, analytics: parsed.analytics === true };
  } catch {
    return null;
  }
}

export function setConsent(analytics: boolean) {
  snapshot = { essential: true, analytics };
  persist(snapshot);
  listeners.forEach((l) => l());
}

export function resetConsent() {
  snapshot = null;
  persist(null);
  listeners.forEach((l) => l());
}

/** Re-opens the settings dialog (used by the footer "Cookie settings" link). */
export function openCookieSettings() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT));
  }
}

// Hydrate the snapshot once on the client so the first render matches
// localStorage; the server snapshot stays null (banner hidden until mount).
if (typeof window !== "undefined") {
  snapshot = read();
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

const getSnapshot = () => snapshot;
const getServerSnapshot = () => null;

export function useConsent(): ConsentState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** The `consent:analytics` flag other code can read outside React. */
export function hasAnalyticsConsent(): boolean {
  return snapshot?.analytics === true;
}
