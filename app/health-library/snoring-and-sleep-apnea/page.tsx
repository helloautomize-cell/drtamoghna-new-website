import PostPage, { postMetadata } from "@/components/templates/PostPage";

export const metadata = postMetadata("/health-library/snoring-and-sleep-apnea/");

export default function Page() {
  return <PostPage url="/health-library/snoring-and-sleep-apnea/" />;
}
