import { Accessibility, MapPin, PersonStanding } from "lucide-react";
import RouteLink from "./RouteLink";
import { siteConfig } from "@/lib/site-config";
import { images } from "@/lib/images";

/**
 * Visit band (content Home): desktop 60vh sticky exterior photo with a
 * frosted "Visit us in Bongaigaon" card; mobile compact card only.
 */
export default function VisitBand() {
  const im = images.exteriorWide;
  return (
    <section className="vband" aria-label="Visit the clinic">
      <div className="vb-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={im.src}
          alt={im.alt}
          width={im.width}
          height={im.height}
          loading="lazy"
        />
        <div className="vb-card">
          <h2>
            Visit us in <em className="acc">Bongaigaon</em>
          </h2>
          <p className="vb-addr">
            <MapPin size={17} strokeWidth={2} aria-hidden />
            {siteConfig.address.lines.join(", ")}
          </p>
          <div className="vb-chips">
            <span className="chip">
              <PersonStanding size={15} strokeWidth={2} aria-hidden /> Ground floor
            </span>
            <span className="chip">
              <Accessibility size={15} strokeWidth={2} aria-hidden /> Wheelchair
              available
            </span>
          </div>
          <div className="vb-acts">
            <a
              className="btn btn-p"
              href={siteConfig.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get directions
            </a>
            <RouteLink className="btn btn-s" href="/plan-your-visit/">
              Plan your visit
            </RouteLink>
          </div>
        </div>
      </div>
    </section>
  );
}
