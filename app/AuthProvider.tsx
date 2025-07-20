"use client";
import { useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/client/supabase";
import { useAuthStore } from "@/stores/useAuthStore";

export default function AuthProvider() {
  const { setIsLoggedIn, setUser } = useAuthStore();

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    // 초기 로그인 상태 확인
    const checkAuthStatus = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          // 우리 서비스 DB에서 사용자 확인
          const response = await fetch("/api/user/me", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const result = await response.json();
            console.log("result", result);

            // 200 OK - 기존 사용자
            setIsLoggedIn(true);
            setUser(session.user);
          } else if (response.status === 404) {
            // 404 Not Found - 신규 사용자
            setIsLoggedIn(false);
            setUser(null);
          } else {
            // 401 Unauthorized 또는 기타 에러
            setIsLoggedIn(false);
            setUser(null);
          }
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Auth status check error:", error);
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkAuthStatus();

    // 인증 상태 변경 리스너
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        // 로그인 시 우리 서비스 DB 확인
        try {
          const response = await fetch("/api/user/me", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          console.log("response", response);

          if (response.ok) {
            const result = await response.json();

            // 200 OK - 기존 사용자
            setIsLoggedIn(true);
            setUser(session.user);
          } else if (response.status === 404) {
            // 404 Not Found - 신규 사용자는 온보딩으로 리다이렉트
            window.location.href = "/onboarding";
          } else {
            // 401 Unauthorized 또는 기타 에러
            setIsLoggedIn(false);
            setUser(null);
          }
        } catch (error) {
          console.error("Sign in check error:", error);
          setIsLoggedIn(false);
          setUser(null);
        }
      }

      if (event === "SIGNED_OUT") {
        setIsLoggedIn(false);
        setUser(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [setIsLoggedIn, setUser]);

  return null;
}
