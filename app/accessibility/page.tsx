import LegalPage, { legalMetadata } from "@/components/templates/LegalPage";

export const metadata = legalMetadata("/accessibility/");

export default function Page() {
  return <LegalPage url="/accessibility/" />;
}
