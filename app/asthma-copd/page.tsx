import ServicePage, { serviceMetadata } from "@/components/templates/ServicePage";

export const metadata = serviceMetadata("/asthma-copd/");

export default function Page() {
  return <ServicePage url="/asthma-copd/" />;
}
