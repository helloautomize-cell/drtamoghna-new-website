import LegalPage, { legalMetadata } from "@/components/templates/LegalPage";

export const metadata = legalMetadata("/medical-disclaimer/");

export default function Page() {
  return <LegalPage url="/medical-disclaimer/" />;
}
