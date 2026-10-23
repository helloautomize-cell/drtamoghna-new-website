import PostPage, { postMetadata } from "@/components/templates/PostPage";

export const metadata = postMetadata("/health-library/sleep-apnea-metabolic-health/");

export default function Page() {
  return <PostPage url="/health-library/sleep-apnea-metabolic-health/" />;
}
