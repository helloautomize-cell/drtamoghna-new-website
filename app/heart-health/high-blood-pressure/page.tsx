import ServicePage, { serviceMetadata } from "@/components/templates/ServicePage";

export const metadata = serviceMetadata("/heart-health/high-blood-pressure/");

export default function Page() {
  return <ServicePage url="/heart-health/high-blood-pressure/" />;
}
