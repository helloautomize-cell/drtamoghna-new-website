import ContentPage, { contentMetadata } from "@/components/templates/ContentPage";
import MapCard from "@/components/MapCard";
import ConfirmChip from "@/components/ConfirmChip";
import { siteConfig } from "@/lib/site-config";
import { MapPin } from "lucide-react";

export const metadata = contentMetadata("/plan-your-visit/");

function AddressBlock() {
  return (
    <div className="addr-block">
      <address>
        <b>{siteConfig.name}</b>
        {siteConfig.address.lines.map((l, i) => (
          <span key={i}>{l}</span>
        ))}
      </address>
      <a
        className="btn ghost"
        href={siteConfig.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <MapPin size={17} strokeWidth={2} aria-hidden /> Get directions
      </a>
      <p className="addr-note">Landmark: directly opposite Domino&apos;s on Chapaguri Road.</p>
      <p>
        <ConfirmChip>
          distance from New Bongaigaon railway station and the bus stand
        </ConfirmChip>
      </p>
      <MapCard />
    </div>
  );
}

export default function Page() {
  return (
    <ContentPage
      url="/plan-your-visit/"
      opts={{
        pageType: "WebPage",
        heroImage: "exterior",
        imageIn: [
          { match: /booking/i, img: "reception" },
          { match: /what to bring/i, img: "doorSign" },
        ],
        slots: [{ match: /address and directions/i, node: <AddressBlock /> }],
      }}
    />
  );
}
