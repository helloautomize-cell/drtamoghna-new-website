"use client";

import { trackEvent } from "@/lib/analytics";

/**
 * Embedded Google Maps card for the clinic location.
 */
export default function MapCard() {
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
