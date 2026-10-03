"use client";

import { openCookieSettings } from "@/lib/consent";
import { useMounted } from "@/lib/useMounted";

/** Email assembled in JS; the noscript-safe text fallback stays readable. */
export function ObfuscatedEmail() {
  const mounted = useMounted();
  if (!mounted) {
    return <span className="foot-email">medcarebongaigaon at gmail dot com</span>;
  }
  const addr = "medcarebongaigaon" + "@" + "gmail" + "." + "com";
  return (
    <a className="foot-email" href={`mailto:${addr}`}>
      {addr}
    </a>
  );
}

/** Footer "Cookie settings" re-opens the consent dialog. */
export function CookieSettingsButton() {
  return (
    <button type="button" className="foot-cookies" onClick={openCookieSettings}>
      Cookie settings
    </button>
  );
}
