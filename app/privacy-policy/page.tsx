import LegalPage, { legalMetadata } from "@/components/templates/LegalPage";

export const metadata = legalMetadata("/privacy-policy/");

export default function Page() {
  return <LegalPage url="/privacy-policy/" />;
}
