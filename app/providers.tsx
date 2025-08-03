"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5분간 신선한 데이터
            gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
            retry: 3, // 에러 시 3번 재시도
            refetchOnWindowFocus: false, // 윈도우 포커스 시 재요청 안함
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
