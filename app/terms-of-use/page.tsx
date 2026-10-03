import LegalPage, { legalMetadata } from "@/components/templates/LegalPage";

export const metadata = legalMetadata("/terms-of-use/");

export default function Page() {
  return <LegalPage url="/terms-of-use/" />;
}
