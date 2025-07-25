"use client";

import ErrorPage from "@/components/common/ErrorPage";

export default function Error({ error }: { error: Error }) {
  console.log(error);
  return (
    <ErrorPage
      statusCode={500}
    />
  );
}
