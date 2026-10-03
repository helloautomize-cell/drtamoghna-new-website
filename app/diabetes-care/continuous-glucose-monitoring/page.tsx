import ServicePage, { serviceMetadata } from "@/components/templates/ServicePage";

export const metadata = serviceMetadata("/diabetes-care/continuous-glucose-monitoring/");

export default function Page() {
  return <ServicePage url="/diabetes-care/continuous-glucose-monitoring/" />;
}
