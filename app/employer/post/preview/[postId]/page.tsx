// app/employer/post/preview/[postId]/page.tsx
import JobPreviewEditPage from "@/components/employer/JobPreviewEditPage";

export default async function Page({ params }: { params: { postId: string } }) {
  return <JobPreviewEditPage postId={params.postId} />;
}
