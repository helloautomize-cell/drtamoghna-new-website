import ServicePage, { serviceMetadata } from "@/components/templates/ServicePage";

export const metadata = serviceMetadata("/thyroid-disorders/");

export default function Page() {
  return <ServicePage url="/thyroid-disorders/" />;
}
