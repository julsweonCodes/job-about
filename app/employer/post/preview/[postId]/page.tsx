// app/employer/post/preview/[postId]/page.tsx
import JobPreviewEditPage from "@/components/employer/JobPreviewEditPage";
import { getCache } from "@/utils/cache";

export default async function Page({ params, searchParams }: { params: { postId: string }; searchParams: { useAI?: string };}) {
  return <JobPreviewEditPage postId={params.postId}/>;
}