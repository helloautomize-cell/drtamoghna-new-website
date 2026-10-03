import { Star } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import ConfirmChip from "./ConfirmChip";

/**
 * Google rating chip, manual mode (Q54b). Hidden while the rating is null.
 * Pass `demo` to show placeholder numbers inside [CONFIRM] chips (styleguide only).
 */
export default function GoogleRatingChip({ demo = false }: { demo?: boolean }) {
  const { value, count } = siteConfig.googleRating;
  if (!demo && (value === null || count === null)) return null;
  return (
    <a className="gchip" href={siteConfig.mapsUrl} target="_blank" rel="noopener noreferrer">
      <Star size={16} fill="currentColor" aria-hidden />
      {demo ? (
        <>
          <b>
            <ConfirmChip>e.g. 4.9</ConfirmChip>
          </b>{" "}
          on Google · <ConfirmChip>count</ConfirmChip> reviews
        </>
      ) : (
        <>
          <b>{value}</b> on Google · {count} reviews
        </>
      )}
    </a>
  );
}
