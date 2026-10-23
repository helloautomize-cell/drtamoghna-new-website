import PostPage, { postMetadata } from "@/components/templates/PostPage";

export const metadata = postMetadata("/health-library/glp-1-medicines-diabetes-weight-loss/");

export default function Page() {
  return <PostPage url="/health-library/glp-1-medicines-diabetes-weight-loss/" />;
}
