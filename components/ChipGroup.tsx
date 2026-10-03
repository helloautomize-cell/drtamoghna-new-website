"use client";

import { useState } from "react";
import RichHtml from "./content/RichHtml";
import type { RenderToken } from "@/lib/content-types";

/**
 * Non-clickable chip group. Mobile shows 6 chips + "Show all (n)";
 * desktop shows every chip.
 */
export default function ChipGroup({
  label,
  items,
}: {
  label: string;
  items: { html: string; tokens: RenderToken[] }[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="chip-group">
      <b>{label}</b>
      <div className={`chip-list ${open ? "open" : ""}`}>
        {items.map((it, i) => (
          <span className={`chip ${i >= 6 ? "extra" : ""}`} key={i}>
            <RichHtml html={it.html} tokens={it.tokens} />
          </span>
        ))}
      </div>
      {items.length > 6 ? (
        <button type="button" className="chip-more" onClick={() => setOpen(!open)}>
          {open ? "Show less" : `Show all (${items.length})`}
        </button>
      ) : null}
    </div>
  );
}
