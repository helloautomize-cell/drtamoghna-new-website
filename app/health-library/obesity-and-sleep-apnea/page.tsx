import PostPage, { postMetadata } from "@/components/templates/PostPage";

export const metadata = postMetadata("/health-library/obesity-and-sleep-apnea/");

export default function Page() {
  return <PostPage url="/health-library/obesity-and-sleep-apnea/" />;
}
