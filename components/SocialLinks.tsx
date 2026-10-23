import { siteConfig } from "@/lib/site-config";

/**
 * SocialLinks · outbound icon links to the clinic's and Dr. Das's own
 * profiles. Plain links and inline SVGs only; no embedded feeds or
 * third-party social scripts. The link styling (`.foot-social` /
 * `.social-links` in globals.css) is shared so every icon on the site
 * matches the footer.
 */

export function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

const ICONS = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  x: XIcon,
} as const;

export type SocialNetwork = keyof typeof ICONS;

export type SocialLink = {
  network: SocialNetwork;
  href: string;
  label: string;
};

/** Clinic (Medcare) accounts. Link order is chosen at each call site. */
export const clinicSocial: Record<"facebook" | "instagram", SocialLink> = {
  facebook: {
    network: "facebook",
    href: siteConfig.social.facebook,
    label: "Medcare Clinic on Facebook (opens in a new tab)",
  },
  instagram: {
    network: "instagram",
    href: siteConfig.social.instagram,
    label: "Medcare Clinic on Instagram (opens in a new tab)",
  },
};

/** Dr. Das's personal accounts. */
export const doctorSocial: Record<"linkedin" | "x" | "facebook", SocialLink> = {
  linkedin: {
    network: "linkedin",
    href: siteConfig.doctor.social.linkedin,
    label: "Dr. Tamoghna Das on LinkedIn (opens in a new tab)",
  },
  x: {
    network: "x",
    href: siteConfig.doctor.social.x,
    label: "Dr. Tamoghna Das on X (opens in a new tab)",
  },
  facebook: {
    network: "facebook",
    href: siteConfig.doctor.social.facebook,
    label: "Dr. Tamoghna Das on Facebook (opens in a new tab)",
  },
};

export default function SocialLinks({
  links,
  className = "social-links",
}: {
  links: SocialLink[];
  className?: string;
}) {
  return (
    <div className={className}>
      {links.map((l) => {
        const Icon = ICONS[l.network];
        return (
          <a
            key={l.network + l.href}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={l.label}
          >
            <Icon />
          </a>
        );
      })}
    </div>
  );
}
