import type { NextConfig } from "next";

const noindex = process.env.SITE_NOINDEX === "true";

/**
 * Security + indexing headers (master Part 8).
 * SITE_NOINDEX="true" is the emergency brake: it restores site-wide noindex.
 * /styleguide/ and /thank-you/ stay noindex permanently.
 * The CSP allows self, the click-to-load Google Maps embed, YouTube-nocookie,
 * Google Analytics/Tag Manager (consent-gated), Cloudflare Turnstile and
 * Vercel analytics only.
 */
// React dev mode uses eval() for error callstack reconstruction.
const devEval = process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${devEval} https://www.googletagmanager.com https://challenges.cloudflare.com https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com",
  "font-src 'self'",
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://vitals.vercel-insights.com https://challenges.cloudflare.com",
  "frame-src https://www.google.com https://maps.google.com https://challenges.cloudflare.com https://www.youtube-nocookie.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  trailingSlash: true,
  productionBrowserSourceMaps: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 768, 1024, 1320, 1536],
  },
  async headers() {
    const rules = [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/styleguide/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/thank-you/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
    if (noindex) {
      rules.push({
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      });
    }
    return rules;
  },
};

export default nextConfig;
