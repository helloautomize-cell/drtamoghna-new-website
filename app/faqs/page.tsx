import ContentPage, { contentMetadata } from "@/components/templates/ContentPage";

export const metadata = contentMetadata("/faqs/");

export default function Page() {
  return <ContentPage url="/faqs/" opts={{ pageType: "FAQPage" }} />;
}
