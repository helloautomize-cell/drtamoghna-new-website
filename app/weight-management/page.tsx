import ServicePage, { serviceMetadata } from "@/components/templates/ServicePage";

export const metadata = serviceMetadata("/weight-management/");

export default function Page() {
  return <ServicePage url="/weight-management/" />;
}
