import PostPage, { postMetadata } from "@/components/templates/PostPage";

export const metadata = postMetadata("/health-library/high-cholesterol-triglycerides/");

export default function Page() {
  return <PostPage url="/health-library/high-cholesterol-triglycerides/" />;
}
