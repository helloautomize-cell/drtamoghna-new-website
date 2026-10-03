import {
  Activity,
  Bone,
  Brain,
  Droplets,
  Footprints,
  HeartPulse,
  Leaf,
  Moon,
  ShieldPlus,
  Thermometer,
  Waves,
  Weight,
  Wind,
  type LucideIcon,
} from "lucide-react";
import RouteLink from "./RouteLink";

/**
 * 07 / Conditions we look after: two marquee rows of condition pills
 * scrolling in opposite directions. Pause on hover, focus and touch;
 * static and wrapped under reduced motion; one row on mobile.
 * Copy and links verbatim from content Home.
 */
const ROW1: { label: string; href: string; Icon: LucideIcon }[] = [
  { label: "Type 2 diabetes", href: "/diabetes-care/", Icon: Droplets },
  { label: "Type 1 diabetes", href: "/diabetes-care/", Icon: Droplets },
  { label: "Prediabetes", href: "/diabetes-care/", Icon: Droplets },
  {
    label: "Diabetes in pregnancy",
    href: "/diabetes-care/diabetes-in-pregnancy/",
    Icon: Droplets,
  },
  { label: "Diabetic foot", href: "/diabetes-care/diabetic-foot-care/", Icon: Footprints },
  { label: "Obesity", href: "/weight-management/", Icon: Weight },
  {
    label: "High blood pressure",
    href: "/heart-health/high-blood-pressure/",
    Icon: HeartPulse,
  },
  { label: "Heart failure", href: "/heart-health/heart-failure/", Icon: HeartPulse },
  { label: "Palpitations", href: "/heart-health/holter-monitoring/", Icon: Activity },
  { label: "High cholesterol", href: "/heart-health/", Icon: HeartPulse },
  { label: "Thyroid problems", href: "/thyroid-disorders/", Icon: Activity },
  { label: "PCOS-related weight gain", href: "/weight-management/", Icon: Weight },
];

const ROW2: { label: string; href: string; Icon: LucideIcon }[] = [
  { label: "Sleep apnea", href: "/sleep-apnea/", Icon: Moon },
  { label: "Asthma", href: "/asthma-copd/", Icon: Wind },
  { label: "COPD", href: "/asthma-copd/", Icon: Wind },
  { label: "Fatty liver", href: "/internal-medicine/fatty-liver/", Icon: Leaf },
  {
    label: "Gout and uric acid",
    href: "/internal-medicine/joint-pain-arthritis/",
    Icon: Bone,
  },
  { label: "Arthritis", href: "/internal-medicine/joint-pain-arthritis/", Icon: Bone },
  {
    label: "Back and joint pain",
    href: "/internal-medicine/joint-pain-arthritis/",
    Icon: Bone,
  },
  { label: "Migraine", href: "/internal-medicine/migraine-headache/", Icon: Brain },
  { label: "Anaemia", href: "/internal-medicine/anaemia/", Icon: Droplets },
  {
    label: "Dengue and other fevers",
    href: "/internal-medicine/fever-and-infections/",
    Icon: Thermometer,
  },
  {
    label: "Urinary infections",
    href: "/internal-medicine/fever-and-infections/",
    Icon: ShieldPlus,
  },
  { label: "Breathlessness", href: "/heart-health/heart-failure/", Icon: Waves },
];

function Row({
  items,
  reverse,
  mobile,
}: {
  items: typeof ROW1;
  reverse?: boolean;
  mobile?: boolean;
}) {
  const list = [...items, ...items];
  return (
    <div className={`mq${mobile ? " mq-mobile" : ""}`}>
      <div className={`mq-row${reverse ? " rev" : ""}`}>
        {list.map(({ label, href, Icon }, i) => (
          <RouteLink
            className="mq-pill"
            key={`${label}-${i}`}
            href={href}
            tabIndex={i < items.length ? 0 : -1}
            aria-hidden={i >= items.length}
          >
            <Icon size={16} strokeWidth={1.9} aria-hidden />
            {label}
          </RouteLink>
        ))}
      </div>
    </div>
  );
}

export default function ConditionsMarquee() {
  return (
    <div className="mqwrap">
      <Row items={ROW1} />
      <div className="mq-desktop">
        <Row items={ROW2} reverse />
      </div>
    </div>
  );
}
