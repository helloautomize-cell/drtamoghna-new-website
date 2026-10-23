import PostPage, { postMetadata } from "@/components/templates/PostPage";

export const metadata = postMetadata("/health-library/diabetes-medicines-treatment-options/");

export default function Page() {
  return <PostPage url="/health-library/diabetes-medicines-treatment-options/" />;
}
