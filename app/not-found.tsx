import Link from "next/link";

/**
 * Branded 404 (content file, Page 11). Links to pages not yet built are
 * intentional; they resolve as phases land.
 */
const suggestions = [
  { label: "Diabetes care", href: "/diabetes-care/" },
  { label: "Heart health", href: "/heart-health/" },
  { label: "Weight management", href: "/weight-management/" },
  { label: "Echocardiography", href: "/heart-health/echocardiography/" },
  { label: "Plan your visit", href: "/plan-your-visit/" },
  { label: "Book an appointment", href: "/contact/#book" },
];

export default function NotFound() {
  return (
    <div className="container-mc nf">
      <h1 className="nf-title">
        We could not find that <em>page</em>
      </h1>
      <p className="nf-text">The page may have moved. Try one of these:</p>
      <ul className="nf-links">
        {suggestions.map((s) => (
          <li key={s.href}>
            <Link href={s.href}>{s.label}</Link>
          </li>
        ))}
      </ul>
      <Link className="book nf-home" href="/">
        <span className="lb">Back to home</span>
      </Link>
    </div>
  );
}
