import {
  Activity,
  ClipboardCheck,
  Droplet,
  Gauge,
  HeartPulse,
  Moon,
  Thermometer,
  Weight,
  type LucideIcon,
} from "lucide-react";
import RouteLink from "./RouteLink";

/**
 * "Find care by concern" (content Home): one row of 8 icon pills linking
 * to the matching service page. Horizontal scroll on mobile, no wrap.
 */
const PILLS: { label: string; href: string; Icon: LucideIcon }[] = [
  { label: "High sugar or diabetes", href: "/diabetes-care/", Icon: Droplet },
  { label: "Weight concerns", href: "/weight-management/", Icon: Weight },
  { label: "Blood pressure", href: "/heart-health/high-blood-pressure/", Icon: Gauge },
  { label: "Breathless or chest discomfort", href: "/heart-health/", Icon: HeartPulse },
  { label: "Thyroid", href: "/thyroid-disorders/", Icon: Activity },
  { label: "Snoring or tiredness", href: "/sleep-apnea/", Icon: Moon },
  { label: "Fever", href: "/internal-medicine/fever-and-infections/", Icon: Thermometer },
  { label: "A yearly check-up", href: "/health-check-ups/", Icon: ClipboardCheck },
];

export default function ConcernPills() {
  return (
    <nav className="concern" aria-label="Find care by concern">
      <span className="concern-label">What brings you in today</span>
      <div className="concern-row">
        {PILLS.map(({ label, href, Icon }) => (
          <RouteLink className="concern-pill" key={label} href={href}>
            <Icon size={17} strokeWidth={1.9} aria-hidden />
            {label}
          </RouteLink>
        ))}
      </div>
    </nav>
  );
}
