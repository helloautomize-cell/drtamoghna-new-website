"use client";

import {
  Activity,
  Clock,
  Heart,
  Languages,
  ShieldCheck,
  User,
  type LucideIcon,
} from "lucide-react";
import { whyCards } from "@/lib/services";
import AutoScrollRow from "./AutoScrollRow";

const icons: Record<string, LucideIcon> = {
  user: User,
  activity: Activity,
  heart: Heart,
  shield: ShieldCheck,
  clock: Clock,
  languages: Languages,
};

/**
 * Six glass "Why Medcare" cards over the teal tint panel with peach and
 * teal glows. Below 768px they become a self-moving swipe carousel.
 */
export default function WhyCards() {
  return (
    <div className="bgsoft">
      <AutoScrollRow className="cards swipe" mobileOnly ctrlClass="mobile-only">
        {whyCards.map((c) => {
          const Icon = icons[c.icon];
          return (
            <div className="gcard" key={c.title}>
              <span className="i">
                <Icon size={24} strokeWidth={1.75} aria-hidden />
              </span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </div>
          );
        })}
      </AutoScrollRow>
    </div>
  );
}
