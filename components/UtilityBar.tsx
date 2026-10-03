import { Clock } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import TextSizeSwitch from "./TextSizeSwitch";

/**
 * Desktop utility bar (specimen): visit links, hours, phone, emergency line, A / A+.
 */
export default function UtilityBar() {
  return (
    <div className="ubar">
      <span className="hide-s">
        <a href="/plan-your-visit/">Plan your visit</a> ·{" "}
        <a href="/health-library/">Health Library</a>
      </span>
      <span>
        <Clock size={16} strokeWidth={2} aria-hidden />
        {siteConfig.hours.display}
      </span>
      <span>
        <a href={`tel:${siteConfig.phone.tel}`}>{siteConfig.phone.display}</a>
      </span>
      <span className="em">{siteConfig.emergencyLine.replace(".", "")}</span>
      <TextSizeSwitch />
    </div>
  );
}
