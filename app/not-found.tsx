import ErrorPage from "@/components/common/ErrorPage";

export default function NotFound() {
  return (
    <ErrorPage
      statusCode={404}
    />
  );
}
