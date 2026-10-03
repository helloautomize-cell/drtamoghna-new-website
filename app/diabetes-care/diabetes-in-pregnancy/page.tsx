import ServicePage, { serviceMetadata } from "@/components/templates/ServicePage";

export const metadata = serviceMetadata("/diabetes-care/diabetes-in-pregnancy/");

export default function Page() {
  return <ServicePage url="/diabetes-care/diabetes-in-pregnancy/" />;
}
