import ServicePage, { serviceMetadata } from "@/components/templates/ServicePage";

export const metadata = serviceMetadata("/internal-medicine/fever-and-infections/");

export default function Page() {
  return <ServicePage url="/internal-medicine/fever-and-infections/" />;
}
