import ServicePage, { serviceMetadata } from "@/components/templates/ServicePage";

export const metadata = serviceMetadata("/sleep-apnea/");

export default function Page() {
  return <ServicePage url="/sleep-apnea/" />;
}
