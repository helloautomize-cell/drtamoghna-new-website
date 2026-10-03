import ServicePage, { serviceMetadata } from "@/components/templates/ServicePage";

export const metadata = serviceMetadata("/heart-health/");

export default function Page() {
  return <ServicePage url="/heart-health/" />;
}
