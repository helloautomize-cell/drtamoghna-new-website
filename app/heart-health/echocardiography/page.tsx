import ServicePage, { serviceMetadata } from "@/components/templates/ServicePage";

export const metadata = serviceMetadata("/heart-health/echocardiography/");

export default function Page() {
  return <ServicePage url="/heart-health/echocardiography/" />;
}
