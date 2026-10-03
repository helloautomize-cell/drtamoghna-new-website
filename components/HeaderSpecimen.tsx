import { ChevronDown } from "lucide-react";
import BookButton from "./BookButton";
import { siteConfig } from "@/lib/site-config";

/**
 * Header specimen for /styleguide: logo, menu labels, Dr. Das, About, BookButton.
 * Static only; the working menus arrive in Phase 2.
 */
export default function HeaderSpecimen() {
  const menus = ["Diabetes and weight", "Heart health", "More care"];
  return (
    <div className="hdr">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="logo" src="/brand/medcare-logo.svg" alt={siteConfig.name} />
      <nav aria-label="Main menu (specimen)">
        {menus.map((m) => (
          <span key={m}>
            <a href="#">{m}</a>
            <ChevronDown size={14} strokeWidth={2} aria-hidden />
          </span>
        ))}
        <span>
          <a href="/dr-tamoghna-das/">Dr. Das</a>
        </span>
        <span>
          <a href="/about/">About</a>
        </span>
      </nav>
      <BookButton />
    </div>
  );
}
