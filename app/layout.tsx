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
  preload: false,
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["500", "600"],
  variable: "--font-deva",
  display: "swap",
  preload: false,
});

const indexable = process.env.SITE_NOINDEX !== "true";

export const metadata: Metadata = {
  metadataBase: siteConfig.siteUrl ? new URL(siteConfig.siteUrl) : undefined,
  title: {
    default: `${siteConfig.name}, Bongaigaon`,
    template: `%s | ${siteConfig.shortName}`,
  },
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
        <FloatingWhatsApp />
        <CookieBanner />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteGraph) }}
        />
      </body>
    </html>
  );
}
