import PostPage, { postMetadata } from "@/components/templates/PostPage";

export const metadata = postMetadata("/health-library/echo-for-people-with-diabetes/");

export default function Page() {
  return (
    <PostPage
      url="/health-library/echo-for-people-with-diabetes/"
      imageIn={[{ match: /what an echo shows/i, img: "echoScreen" }]}
    />
  );
}
