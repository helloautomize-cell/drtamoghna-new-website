import LegalPage, { legalMetadata } from "@/components/templates/LegalPage";

export const metadata = legalMetadata("/appointments-cancellation-refund/");

export default function Page() {
  return <LegalPage url="/appointments-cancellation-refund/" />;
}
