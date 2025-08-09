import { Button } from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 sm:p-8">
          <div className="text-center space-y-3">
            <Typography variant="headlineLg" className="mb-1">
              Authentication Error
            </Typography>
            <Typography variant="bodyMd" className="text-gray-600">
              Something went wrong during the sign-in process. Please try again.
            </Typography>

            <div className="pt-4 space-y-3">
              <Button
                variant="default"
                className="w-full"
                onClick={() => {
                  window.location.replace("/");
                }}
              >
                Go to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
