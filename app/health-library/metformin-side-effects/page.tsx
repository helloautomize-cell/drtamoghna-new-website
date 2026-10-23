import PostPage, { postMetadata } from "@/components/templates/PostPage";

export const metadata = postMetadata("/health-library/metformin-side-effects/");

export default function Page() {
  return <PostPage url="/health-library/metformin-side-effects/" />;
}
