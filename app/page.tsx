/* eslint-disable @next/next/no-img-element */
import { siteConfig } from "@/lib/site-config";
import BookButton from "@/components/BookButton";

export default function Home() {
  return (
    <main className="container-mc" style={{ paddingBlock: 96, minHeight: "100vh" }}>
      <img
        src="/brand/medcare-logo.svg"
        alt={siteConfig.name}
        height={58}
        style={{ height: 58, width: "auto" }}
      />
      <h1 className="t-h1" style={{ marginBlock: "32px 12px", maxWidth: 640 }}>
        {siteConfig.tagline.split("in")[0]}in <em className="acc">Bongaigaon</em>
      </h1>
      <p style={{ color: "var(--ink-2)", maxWidth: 520 }}>
        {siteConfig.name}, {siteConfig.address.lines.join(", ")}. {siteConfig.hours.display}.
      </p>
      <div className="btns" style={{ marginTop: 28 }}>
        <BookButton href="/contact/#book" />
        <a className="btn btn-s" href={`tel:${siteConfig.phone.tel}`}>
          Call {siteConfig.phone.display}
        </a>
      </div>
    </main>
  );
}
