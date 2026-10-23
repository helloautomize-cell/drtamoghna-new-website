import PostPage, { postMetadata } from "@/components/templates/PostPage";

export const metadata = postMetadata("/health-library/cholesterol-diabetes-ldl-hdl-triglycerides/");

export default function Page() {
  return <PostPage url="/health-library/cholesterol-diabetes-ldl-hdl-triglycerides/" />;
}
