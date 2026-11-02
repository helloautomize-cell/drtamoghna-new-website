"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { trackEvent } from "@/lib/analytics";

/**
 * Click-to-load Google Maps card (NMC-09): the iframe reaches Google only
 * after the visitor taps "Load map". Until then a static address card with
 * a plain Maps link is shown, so no third-party request fires on render.
 */
export default function MapCard() {
  const [loadMap, setLoadMap] = useState(false);

  if (!loadMap) {
    return (
      <div className="mapcard">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            minHeight: 340,
            padding: 24,
            textAlign: "center",
            background: "var(--surface, #f6f8f7)",
          }}
        >
          <MapPin size={28} strokeWidth={1.8} aria-hidden />
          <address style={{ fontStyle: "normal", lineHeight: 1.6 }}>
            {siteConfig.address.lines.map((l) => (
              <span key={l} style={{ display: "block" }}>
                {l}
              </span>
            ))}
          </address>
          <button
            type="button"
            className="btn btn-p"
            style={{ minHeight: 48 }}
            onClick={() => setLoadMap(true)}
          >
            Load map
          </button>
          <a
            href={siteConfig.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            See us on Google Maps
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mapcard loaded">
      <iframe
        title="Map: Medcare Diabetes, Obesity and Echocardiography Clinic, Bongaigaon"
        src="https://www.google.com/maps?cid=18284086181285239697&hl=en&output=embed"
        width="100%"
        height="340"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        onLoad={() => trackEvent("map_load")}
      />
    </div>
  );
}
