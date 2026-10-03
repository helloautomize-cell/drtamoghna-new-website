import { Star } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import ConfirmChip from "./ConfirmChip";

/**
 * Google rating chip (Q54b). Hidden while no rating is available.
 * Places API mode activates when GOOGLE_PLACES_KEY and GOOGLE_PLACE_ID are
 * set (server-side fetch, field mask rating,userRatingCount, revalidated
 * every 24 h, hides on any error). Otherwise manual site-config values.
 * Pass `demo` to show placeholder numbers (styleguide only).
 */
async function fetchPlacesRating(): Promise<{ value: number; count: number } | null> {
  const key = process.env.GOOGLE_PLACES_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return null;
  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?fields=rating,userRatingCount&key=${encodeURIComponent(key)}`,
      { next: { revalidate: 86400 } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      rating?: number;
      userRatingCount?: number;
    };
    if (typeof data.rating !== "number" || typeof data.userRatingCount !== "number") {
      return null;
    }
    return { value: data.rating, count: data.userRatingCount };
  } catch {
    return null;
  }
}

export default async function GoogleRatingChip({ demo = false }: { demo?: boolean }) {
  if (demo) {
    return (
      <a className="gchip" href={siteConfig.mapsUrl} target="_blank" rel="noopener noreferrer">
        <Star size={16} fill="currentColor" aria-hidden />
        <b>
          <ConfirmChip>e.g. 4.9</ConfirmChip>
        </b>{" "}
        on Google · <ConfirmChip>count</ConfirmChip> reviews
      </a>
    );
  }

  const places = await fetchPlacesRating();
  const value = places?.value ?? siteConfig.googleRating.value;
  const count = places?.count ?? siteConfig.googleRating.count;
  if (value === null || count === null) return null;

  return (
    <a className="gchip" href={siteConfig.mapsUrl} target="_blank" rel="noopener noreferrer">
      <Star size={16} fill="currentColor" aria-hidden />
      <b>{value}</b> on Google · {count} reviews
    </a>
  );
}
