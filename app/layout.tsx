import type { Metadata } from "next";
import { Figtree, Instrument_Serif, Noto_Sans_Devanagari } from "next/font/google";
import { siteConfig } from "@/lib/site-config";
import { siteGraph } from "@/lib/schema";
import UtilityBar from "@/components/UtilityBar";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import MobileActionBar from "@/components/MobileActionBar";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import CookieBanner from "@/components/CookieBanner";
import Analytics from "@/components/Analytics";
import RevealObserver from "@/components/RevealObserver";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-figtree",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-serif",
  display: "swap",
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["500", "600"],
  variable: "--font-deva",
  display: "swap",
  preload: false,
});

const indexable = process.env.SITE_NOINDEX !== "true";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

export const metadata: Metadata = {
  metadataBase: siteConfig.siteUrl ? new URL(siteConfig.siteUrl) : undefined,
  // Authored page titles render exactly (each is checked for the
  // 60-character limit in scripts/export-seo-meta.mjs).
  title: `${siteConfig.name}, Bongaigaon`,
  description: siteConfig.tagline,
  robots: indexable
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-IN"
      className={`${figtree.variable} ${instrumentSerif.variable} ${notoSansDevanagari.variable}`}
    >
      <body>
        {/* Enables the data-reveal hidden state only when JS is running
            and motion is allowed, so content can never stay invisible
            without JS. RevealObserver (below) adds .rv on scroll. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js-rv')`,
          }}
        />
        {GA_ID ? (
          // Consent Mode v2 defaults: everything denied until the visitor
          // accepts. Inline data only, no network request.
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});`,
            }}
          />
        ) : null}
        <a className="skip-link" href="#content">
          Skip to content
        </a>
        <UtilityBar />
        <SiteHeader />
        <main id="content" className="main-shell">
          {children}
        </main>
        <Footer />
        <MobileActionBar />
        <RevealObserver />
        <FloatingWhatsApp />
        <CookieBanner />
        <Analytics gaId={GA_ID} />
        <SpeedInsights />
        <VercelAnalytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteGraph) }}
        />
      </body>
    </html>
  );
}
