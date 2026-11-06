import RouteLink from "@/components/RouteLink";
import { Clock } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import TextSizeSwitch from "./TextSizeSwitch";

/**
 * Desktop utility bar (master-rules 3.1): thin white bar, hairline below.
 * Left: Plan your visit · Health Library. Right: hours, phone link, red
 * emergency line, A / A+ text-size switch. Hidden below 1024px (.ubar-wrap).
 */
export default function UtilityBar() {
  return (
    <div className="ubar-wrap" data-ga-location="header">
      <div className="ubar container-mc">
        <span>
          <RouteLink href="/plan-your-visit/">Plan your visit</RouteLink> ·{" "}
          <RouteLink href="/visiting-doctors/">Visiting doctors</RouteLink> ·{" "}
          <RouteLink href="/health-library/">Health Library</RouteLink>
        </span>
        <span>
          <Clock size={16} strokeWidth={2} aria-hidden />
          {siteConfig.hours.display}
        </span>
        <span>
          {siteConfig.phone.numbers.map((n, i) => (
            <span key={n.tel}>
              {i > 0 ? " or " : ""}
              <a href={`tel:${n.tel}`}>{n.display}</a>
            </span>
          ))}
        </span>
        <a className="em" href="tel:112">
          {siteConfig.emergencyLine.replace(".", "")}
        </a>
        <TextSizeSwitch />
      </div>
    </div>
  );
}
