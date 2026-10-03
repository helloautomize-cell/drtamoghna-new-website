import ContentPage, { contentMetadata } from "@/components/templates/ContentPage";
import MapCard from "@/components/MapCard";

export const metadata = contentMetadata("/coming-from-outside-bongaigaon/");

export default function Page() {
  return (
    <ContentPage
      url="/coming-from-outside-bongaigaon/"
      opts={{
        pageType: "WebPage",
        heroImage: "exterior",
        slots: [
          {
            match: /getting here/i,
            node: <MapCard />,
          },
        ],
      }}
    />
  );
}
