import { User } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

/**
 * Hero doctor chip: one avatar (Dr. Das is the only doctor) + name line.
 * Avatar is a placeholder until Phase 1b wires the real photo.
 */
export default function DoctorChip() {
  return (
    <span className="chip-doc">
      <span
        className="avatar"
        style={{
          display: "grid",
          placeItems: "center",
          background: "linear-gradient(135deg, var(--primary-50), var(--primary-100))",
          color: "var(--primary-500)",
        }}
      >
        <User size={22} strokeWidth={1.75} aria-hidden />
      </span>
      <span>
        Physician-led care
        <small>
          {siteConfig.doctor.name}, {siteConfig.doctor.qualifications}
        </small>
      </span>
    </span>
  );
}
