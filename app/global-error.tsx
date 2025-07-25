"use client";

import ErrorPage from "@/components/common/ErrorPage";

export default function GlobalError({ error }: { error: Error }) {
  console.log(error);

  return (
    <html>
      <body>
        <ErrorPage statusCode={500} />
      </body>
    </html>
  );
}
