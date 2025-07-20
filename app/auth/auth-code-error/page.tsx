import { Button } from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-6">
        <div className="text-center">
          <Typography variant="headlineLg" className="text-red-600 mb-4">
            인증 오류
          </Typography>
          <Typography variant="bodyMd" className="text-gray-600 mb-8">
            로그인 과정에서 문제가 발생했습니다. 다시 시도해주세요.
          </Typography>

          <div className="space-y-4">
            <Link href="/">
              <Button variant="default" className="w-full">
                홈으로 돌아가기
              </Button>
            </Link>

            <Link href="/auth/login">
              <Button variant="secondary" className="w-full">
                다시 로그인하기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
