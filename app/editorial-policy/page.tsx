import LegalPage, { legalMetadata } from "@/components/templates/LegalPage";

export const metadata = legalMetadata("/editorial-policy/");

export default function Page() {
  return <LegalPage url="/editorial-policy/" />;
}
