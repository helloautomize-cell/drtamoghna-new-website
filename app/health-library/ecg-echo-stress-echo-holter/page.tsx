import PostPage, { postMetadata } from "@/components/templates/PostPage";

export const metadata = postMetadata("/health-library/ecg-echo-stress-echo-holter/");

export default function Page() {
  return <PostPage url="/health-library/ecg-echo-stress-echo-holter/" />;
}
