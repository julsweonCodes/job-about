import React from "react";
import EmployerJobDetailPage from "@/components/employer/EmployerJobDetailPage";

export default async function Page({ params }: { params: { postId: string }}) {

  return <EmployerJobDetailPage postId={params.postId}/>;
}