import ServicePage, { serviceMetadata } from "@/components/templates/ServicePage";

export const metadata = serviceMetadata("/heart-health/holter-monitoring/");

export default function Page() {
  return <ServicePage url="/heart-health/holter-monitoring/" />;
}
