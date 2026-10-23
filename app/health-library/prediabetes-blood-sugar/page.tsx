import PostPage, { postMetadata } from "@/components/templates/PostPage";

export const metadata = postMetadata("/health-library/prediabetes-blood-sugar/");

export default function Page() {
  return <PostPage url="/health-library/prediabetes-blood-sugar/" />;
}
