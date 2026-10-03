import type { Metadata } from "next";
import { TriangleAlert } from "lucide-react";
import RouteLink from "@/components/RouteLink";
import LeadTracker from "@/components/LeadTracker";
import { accent, getPage, pageH1 } from "@/lib/content";
import { pageMeta } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  ...pageMeta({ title: "Thank You | Medcare", url: "/thank-you/", noindex: true }),
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const isContact = params.type === "contact";
  const formType = typeof params.type === "string" ? params.type : "appointment";
  const page = getPage("/thank-you/");
  const h1 = pageH1(page);

  return (
    <div className="page-body thankyou">
      <LeadTracker formType={formType} />
      <h1 dangerouslySetInnerHTML={{ __html: accent(h1) }} />
      {isContact ? (
        <p className="ph-intro">
          We have your message and will reply within one working day.
        </p>
      ) : (
        <>
          <p className="ph-intro">
            We will call or WhatsApp you within {siteConfig.bookingConfirmation}{" "}
            during clinic hours to confirm your appointment. If you sent your
            request after 8:30 pm (or after 3:30 pm on Sunday), we will confirm
            it the next morning.
          </p>
          <p>
            If you do not hear from us, please call{" "}
            <a href={`tel:${siteConfig.phone.tel}`}>{siteConfig.phone.display}</a>.
          </p>
        </>
      )}
      <p className="callout em">
        <TriangleAlert size={20} strokeWidth={2} aria-hidden /> If your symptoms
        get worse, do not wait for your appointment.{" "}
        <a href="tel:112">Call 108 or 112</a>.
      </p>
      <nav className="ty-links" aria-label="Next steps">
        <RouteLink className="btn ghost" href="/plan-your-visit/">
          Plan your visit
        </RouteLink>
        <RouteLink className="btn ghost" href="/plan-your-visit/#what-to-bring">
          What to bring
        </RouteLink>
        <RouteLink className="btn ghost" href="/">
          Back to home
        </RouteLink>
      </nav>
    </div>
  );
}
