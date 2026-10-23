import PostPage, { postMetadata } from "@/components/templates/PostPage";

export const metadata = postMetadata("/health-library/heart-tests-for-people-with-diabetes/");

export default function Page() {
  return <PostPage url="/health-library/heart-tests-for-people-with-diabetes/" />;
}
