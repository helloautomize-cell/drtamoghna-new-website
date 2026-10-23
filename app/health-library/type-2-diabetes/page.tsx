import PostPage, { postMetadata } from "@/components/templates/PostPage";

export const metadata = postMetadata("/health-library/type-2-diabetes/");

export default function Page() {
  return <PostPage url="/health-library/type-2-diabetes/" />;
}
