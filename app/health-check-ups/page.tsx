import ServicePage, { serviceMetadata } from "@/components/templates/ServicePage";

export const metadata = serviceMetadata("/health-check-ups/");

export default function Page() {
  return <ServicePage url="/health-check-ups/" />;
}
