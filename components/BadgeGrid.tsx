import { allBadgeSlugs } from "@/lib/service-badges";
import Badge from "./Badge";

/**
 * All 22 badges shown at sm 56, md 112 and lg 160 px.
 */
export default function BadgeGrid() {
  return (
    <>
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size}>
          <p style={{ margin: "0 0 10px", fontSize: 14, color: "var(--ink-2)" }}>
            {size === "sm" ? "sm · 56 px" : size === "md" ? "md · 112 px" : "lg · 160 px"}
          </p>
          <div className={size === "lg" ? "bgrid bgrid-lg" : "bgrid"}>
            {allBadgeSlugs.map((slug) => (
              <figure key={`${size}-${slug}`}>
                <span className={`bslot ${size}`}>
                  <Badge slug={slug} size={size} />
                </span>
                <figcaption>{slug}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
