"use client";

import { useRouter } from "next/navigation";

interface ErrorPageProps {
  code: string;
  title: string;
  message: string;
  description?: string;
}

export default function ErrorPage({ code, title, message, description }: ErrorPageProps) {
  const router = useRouter();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="text-center max-w-md">
        {/* Error Code */}
        <h1 className="text-8xl font-bold text-gray-300 mb-4">{code}</h1>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>

        {/* Message */}
        <p className="text-gray-600 mb-4 leading-relaxed">{message}</p>

        {/* Description */}
        {description && <p className="text-sm text-gray-500 mb-8 leading-relaxed">{description}</p>}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleGoBack}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Go Back
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
