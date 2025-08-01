// app/employer/post/preview/[postId]/page.tsx
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/utils/sessionOptions";
import JobPreviewEditPage from "@/components/employer/JobPreviewEditPage";

export default async function Page({ params, searchParams }: { params: { postId: string }; searchParams: { useAI?: string };}) {


  return <JobPreviewEditPage postId={params.postId}/>;
}