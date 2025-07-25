import ErrorPage from "@/components/common/ErrorPage";
import { ERROR_MESSAGES } from "@/constants/errors";

export default function NotFound() {
  const error = ERROR_MESSAGES[404];

  return (
    <ErrorPage
      code="404"
      title={error.title}
      message={error.message}
      description={error.description}
    />
  );
}
