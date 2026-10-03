import LegalPage, { legalMetadata } from "@/components/templates/LegalPage";

export const metadata = legalMetadata("/patient-rights/");

export default function Page() {
  return (
    <LegalPage
      url="/patient-rights/"
      imageIn={[{ match: /your rights at medcare/i, img: "examRoom" }]}
    />
  );
}
