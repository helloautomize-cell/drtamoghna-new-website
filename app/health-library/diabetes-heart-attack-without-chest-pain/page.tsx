import PostPage, { postMetadata } from "@/components/templates/PostPage";

export const metadata = postMetadata("/health-library/diabetes-heart-attack-without-chest-pain/");

export default function Page() {
  return <PostPage url="/health-library/diabetes-heart-attack-without-chest-pain/" />;
}
