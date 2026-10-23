import { Accessibility, MapPin, PersonStanding } from "lucide-react";
import RouteLink from "./RouteLink";
import { siteConfig } from "@/lib/site-config";
import { images, imgSrcSet } from "@/lib/images";

const VB_SIZES = "(max-width: 900px) 100vw, 720px";

/**
 * Visit band (content Home): "Visit us in Bongaigaon" card beside the
 * storefront photo on desktop; photo stacked above the card on mobile.
 */
export default function VisitBand() {
  const im = images.exteriorWide;
  return (
    <section className="vband" aria-label="Visit the clinic">
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
      <div className="vb-media">
        <picture>
          <source type="image/avif" srcSet={im.avif} sizes={VB_SIZES} media="(min-width: 901px)" />
          <source type="image/webp" srcSet={imgSrcSet(im)} sizes={VB_SIZES} />
          <img
            src={im.jpg ?? im.src}
            srcSet={imgSrcSet(im, ".jpg")}
            sizes={VB_SIZES}
            alt={im.alt}
            width={im.width}
            height={im.height}
            loading="lazy"
            decoding="async"
          />
        </picture>
      </div>
    </section>
  );
}
