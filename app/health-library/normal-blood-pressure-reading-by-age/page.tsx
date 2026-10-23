import PostPage, { postMetadata } from "@/components/templates/PostPage";

export const metadata = postMetadata("/health-library/normal-blood-pressure-reading-by-age/");

export default function Page() {
  return <PostPage url="/health-library/normal-blood-pressure-reading-by-age/" />;
}
