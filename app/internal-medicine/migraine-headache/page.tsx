import ServicePage, { serviceMetadata } from "@/components/templates/ServicePage";

export const metadata = serviceMetadata("/internal-medicine/migraine-headache/");

export default function Page() {
  return <ServicePage url="/internal-medicine/migraine-headache/" />;
}
