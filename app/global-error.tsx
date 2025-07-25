"use client";

import ErrorPage from "@/components/common/ErrorPage";
import { ERROR_MESSAGES } from "@/constants/errors";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const errorInfo = ERROR_MESSAGES[500];

  return (
    <html>
      <body>
        <ErrorPage
          code="500"
          title={errorInfo.title}
          message={errorInfo.message}
          description={errorInfo.description}
        />
      </body>
    </html>
  );
}
