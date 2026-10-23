import PostPage, { postMetadata } from "@/components/templates/PostPage";

export const metadata = postMetadata("/health-library/sglt2-inhibitors-diabetes-heart-kidney/");

export default function Page() {
  return <PostPage url="/health-library/sglt2-inhibitors-diabetes-heart-kidney/" />;
}
