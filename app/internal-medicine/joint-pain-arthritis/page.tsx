import ServicePage, { serviceMetadata } from "@/components/templates/ServicePage";

export const metadata = serviceMetadata("/internal-medicine/joint-pain-arthritis/");

export default function Page() {
  return <ServicePage url="/internal-medicine/joint-pain-arthritis/" />;
}
