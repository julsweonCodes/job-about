import React from "react";
import EmployerJobDetailPage from "@/components/employer/EmployerJobDetailPage";

export default async function Page({
  params,
  searchParams,
}: {
  params: { postId: string };
  searchParams: { status?: string };
}) {
  const status = searchParams.status === "draft" ? "draft" : "published";

  return <EmployerJobDetailPage postId={params.postId} status={status} />;
}
