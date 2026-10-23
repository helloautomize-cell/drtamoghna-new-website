import PostPage, { postMetadata } from "@/components/templates/PostPage";

export const metadata = postMetadata("/health-library/high-blood-pressure-guide/");

export default function Page() {
  return <PostPage url="/health-library/high-blood-pressure-guide/" />;
}
