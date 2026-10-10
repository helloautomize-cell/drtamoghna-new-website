import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * /og?title=... · dynamic Open Graph image: Dr. Das portrait + Medcare
 * name + page title on the brand gradient (site-plan social image).
 */
export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") || "Medcare Bongaigaon").slice(0, 120);

  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://drtamoghna-new-website.vercel.app";
  const portrait = await readFile(
    join(process.cwd(), "public/images/doctors/dr-das-portrait.jpg"),
  );
  const portraitSrc = `data:image/jpeg;base64,${portrait.toString("base64")}`;
  void base;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(120deg, #00838F 0%, #1E3D49 100%)",
          padding: 56,
          alignItems: "center",
          gap: 48,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            color: "white",
          }}
        >
          <div style={{ fontSize: 26, fontWeight: 700, opacity: 0.92 }}>
            Medcare Diabetes, Obesity and Echocardiography Clinic
          </div>
          <div
            style={{
              fontSize: title.length > 55 ? 44 : 54,
              fontWeight: 800,
              lineHeight: 1.12,
              marginTop: 18,
              letterSpacing: -1,
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 22, marginTop: 26, opacity: 0.85 }}>
            Dr. Tamoghna Das, MBBS, MD (Medicine) · Bongaigaon, Assam
          </div>
        </div>
        <div
          style={{
            display: "flex",
            width: 320,
            height: 400,
            borderRadius: 28,
            overflow: "hidden",
            border: "3px solid rgba(255,255,255,0.35)",
            flexShrink: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={portraitSrc}
            alt=""
            width={320}
            height={400}
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
