import Link from "next/link";
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
    <div className="ubar-wrap">
      <div className="ubar container-mc">
        <span>
          <Link href="/plan-your-visit/">Plan your visit</Link> ·{" "}
          <Link href="/health-library/">Health Library</Link>
        </span>
        <span>
          <Clock size={16} strokeWidth={2} aria-hidden />
          {siteConfig.hours.display}
        </span>
        <span>
          <a href={`tel:${siteConfig.phone.tel}`}>{siteConfig.phone.display}</a>
        </span>
        <a className="em" href="tel:112">
          {siteConfig.emergencyLine.replace(".", "")}
        </a>
        <TextSizeSwitch />
      </div>
    </div>
  );
}
