import ContentPage, { contentMetadata } from "@/components/templates/ContentPage";

export const metadata = contentMetadata("/about/");

export default function Page() {
  return (
    <ContentPage
      url="/about/"
      opts={{
        pageType: "AboutPage",
        heroImage: "consultationRoom",
        imageIn: [
          { match: /why medcare was started/i, img: "cmeTalk" },
          { match: /how we work/i, img: "consultation" },
          { match: /the clinic/i, img: "openingDay" },
        ],
      }}
    />
  );
}
