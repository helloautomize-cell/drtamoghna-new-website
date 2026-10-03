import { ArrowRight } from "lucide-react";
import Badge from "./Badge";
import type { ServiceCard } from "@/lib/services";

/**
 * Service badge card: badge floats on the section wash with a soft round
 * glow (no arch, box or card behind it), then the title with a small
 * gradient arrow and one line.
 * Hover: orbit ring spins once (1.2s), lift + scale 1.06, coin flip
 * rotateY(360deg) once (0.9s), sheen sweep once, arrow slides 4px.
 */
export default function ServiceBadgeCard({ card, glow }: { card: ServiceCard; glow: string }) {
  return (
    <a className={`sgc ${glow}`} href={card.href}>
      <span className="halo">
        <span className="badge">
          <span className="coin">
            <Badge slug={card.badge} size="md" />
          </span>
        </span>
      </span>
      <b>
        {card.title}
        <span className="go2" aria-hidden>
          <ArrowRight size={15} strokeWidth={2.4} />
        </span>
      </b>
      <span className="d">{card.line}</span>
    </a>
  );
}
