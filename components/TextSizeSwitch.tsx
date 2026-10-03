"use client";

import { useEffect, useState } from "react";

const KEY = "medcare-text-size";

function apply(large: boolean) {
  // Root font-size per spec (100% / 112.5%) plus the body bump in globals.css.
  document.documentElement.style.fontSize = large ? "112.5%" : "";
  document.documentElement.dataset.text = large ? "large" : "";
}

function persist(large: boolean) {
  try {
    if (large) window.localStorage.setItem(KEY, "large");
    else window.localStorage.removeItem(KEY);
  } catch {
    /* private mode etc: choice just is not remembered */
  }
}

/**
 * A / A+ text-size switch: sets the root font size to 100% or 112.5%,
 * remembered in localStorage (try/catch for private mode).
 */
export default function TextSizeSwitch() {
  const [large, setLarge] = useState(false);

  // Hydrate after mount; async so the render rule is not triggered.
  useEffect(() => {
    let stored = false;
    try {
      stored = window.localStorage.getItem(KEY) === "large";
    } catch {
      /* ignore */
    }
    apply(stored);
    if (stored) queueMicrotask(() => setLarge(true));
  }, []);

  return (
    <span role="group" aria-label="Text size" style={{ display: "inline-flex", gap: 2 }}>
      {(["A", "A+"] as const).map((label) => {
        const on = (label === "A+") === large;
        return (
          <button
            key={label}
            type="button"
            aria-pressed={on}
            onClick={() => {
              setLarge(label === "A+");
              apply(label === "A+");
              persist(label === "A+");
            }}
            style={{
              border: "1px solid var(--line)",
              background: on ? "var(--primary-100)" : "#fff",
              color: "var(--ink)",
              borderRadius: 8,
              minWidth: 34,
              minHeight: 32,
              font: "600 13px/1 var(--sans)",
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        );
      })}
    </span>
  );
}
