import ServicePage, { serviceMetadata } from "@/components/templates/ServicePage";

export const metadata = serviceMetadata("/weight-management/glp-1-medicines/");

export default function Page() {
  return <ServicePage url="/weight-management/glp-1-medicines/" />;
}
