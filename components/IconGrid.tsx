import {
  Activity,
  ArrowRight,
  Award,
  Baby,
  Bone,
  Brain,
  CalendarCheck,
  CalendarDays,
  ChevronDown,
  Clock,
  Droplet,
  FileText,
  Footprints,
  Gauge,
  Heart,
  HeartPulse,
  Info,
  Languages,
  MapPin,
  MessageCircle,
  Moon,
  Pause,
  Phone,
  Pill,
  Play,
  ScanHeart,
  ShieldCheck,
  Star,
  Stethoscope,
  Thermometer,
  TriangleAlert,
  User,
  Weight,
  Wind,
  type LucideIcon,
} from "lucide-react";

const icons: [LucideIcon, string][] = [
  [CalendarDays, "CalendarDays"],
  [CalendarCheck, "CalendarCheck"],
  [Clock, "Clock"],
  [Phone, "Phone"],
  [MessageCircle, "MessageCircle"],
  [ArrowRight, "ArrowRight"],
  [ChevronDown, "ChevronDown"],
  [MapPin, "MapPin"],
  [User, "User"],
  [Stethoscope, "Stethoscope"],
  [Heart, "Heart"],
  [HeartPulse, "HeartPulse"],
  [ScanHeart, "ScanHeart"],
  [Activity, "Activity"],
  [Gauge, "Gauge"],
  [Droplet, "Droplet"],
  [Baby, "Baby"],
  [Footprints, "Footprints"],
  [Weight, "Weight"],
  [Pill, "Pill"],
  [Thermometer, "Thermometer"],
  [Bone, "Bone"],
  [Brain, "Brain"],
  [Wind, "Wind"],
  [Moon, "Moon"],
  [ShieldCheck, "ShieldCheck"],
  [Languages, "Languages"],
  [FileText, "FileText"],
  [Award, "Award"],
  [Star, "Star"],
  [Info, "Info"],
  [TriangleAlert, "TriangleAlert"],
  [Play, "Play"],
  [Pause, "Pause"],
];

/**
 * Line icons used in UI: Lucide, 24px, stroke 1.75.
 */
export default function IconGrid() {
  return (
    <div className="icongrid">
      {icons.map(([Icon, name]) => (
        <figure key={name}>
          <Icon size={24} strokeWidth={1.75} aria-hidden />
          <figcaption>{name}</figcaption>
        </figure>
      ))}
    </div>
  );
}
