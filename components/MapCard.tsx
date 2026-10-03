"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { images } from "@/lib/images";
import { siteConfig } from "@/lib/site-config";
import { trackEvent } from "@/lib/analytics";

/**
 * Click-to-load map: a static clinic photo with a "Show map" button.
 * The Google Maps iframe is only mounted after the click, so the page
 * makes zero Google requests before consent.
 */
export default function MapCard() {
  const [show, setShow] = useState(false);
  if (show) {
    return (
      <div className="mapcard loaded">
        <iframe
          title="Map: Medcare Diabetes & Obesity Clinic, Bongaigaon"
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
  return (
    <div className="mapcard">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images.exterior.src}
        alt={images.exterior.alt}
        width={images.exterior.width}
        height={images.exterior.height}
        loading="lazy"
      />
      <button type="button" className="mapcard-btn" onClick={() => setShow(true)}>
        <MapPin size={18} strokeWidth={2} aria-hidden /> Show map
      </button>
      <a
        className="mapcard-link"
        href={siteConfig.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Open in Google Maps
      </a>
    </div>
  );
}
