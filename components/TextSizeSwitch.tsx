"use client";

import { useState } from "react";

/**
 * A / A+ text-size switch. Sets a data attribute on <html>; globals.css
 * bumps the body font size when "large" is active.
 */
export default function TextSizeSwitch() {
  const [large, setLarge] = useState(false);
  return (
    <span role="group" aria-label="Text size" style={{ gap: 2 }}>
      {(["A", "A+"] as const).map((label) => {
        const on = (label === "A+") === large;
        return (
          <button
            key={label}
            type="button"
            aria-pressed={on}
            onClick={() => {
              setLarge(label === "A+");
              document.documentElement.dataset.text = label === "A+" ? "large" : "";
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
