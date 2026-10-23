import RouteLink from "@/components/RouteLink";
import { CalendarDays } from "lucide-react";

/**
 * The two-part Book button: teal icon block, deep slate label, single line.
 */
export default function BookButton({
  href = "/book/",
  label = "Book Appointment",
  ariaLabel,
}: {
  href?: string;
  label?: string;
  ariaLabel?: string;
}) {
  return (
    <RouteLink className="book" href={href} aria-label={ariaLabel ?? label}>
      <span className="ic">
        <CalendarDays size={22} strokeWidth={1.8} aria-hidden />
      </span>
      <span className="lb">{label}</span>
    </RouteLink>
  );
}
