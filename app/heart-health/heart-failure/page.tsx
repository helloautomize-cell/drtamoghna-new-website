import ServicePage, { serviceMetadata } from "@/components/templates/ServicePage";

export const metadata = serviceMetadata("/heart-health/heart-failure/");

export default function Page() {
  return <ServicePage url="/heart-health/heart-failure/" />;
}
