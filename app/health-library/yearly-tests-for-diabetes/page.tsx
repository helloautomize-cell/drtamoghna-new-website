import PostPage, { postMetadata } from "@/components/templates/PostPage";

export const metadata = postMetadata("/health-library/yearly-tests-for-diabetes/");

export default function Page() {
  return <PostPage url="/health-library/yearly-tests-for-diabetes/" />;
}
