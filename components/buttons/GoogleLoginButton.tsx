"use client";
import React from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { supabaseClient } from "@/utils/supabase/client";

export default function GoogleLoginButton() {
  const { setAuthState, setLastError } = useAuthStore();

  const handleGoogleLogin = async () => {
    try {
      // 로그인 시도 시작
      setAuthState("initializing");
      setLastError(null);

      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error("Google login error:", error);
        setAuthState("error");
        setLastError("Google 로그인에 실패했습니다. 다시 시도해주세요.");
        return;
      }

      // OAuth는 리다이렉트 방식이므로 콜백에서 처리됨
      console.log("Google login initiated, redirecting...");
    } catch (error) {
      console.error("Login process error:", error);
      setAuthState("error");
      setLastError("로그인 과정에서 오류가 발생했습니다.");
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center p-0 bg-transparent border-none shadow-none hover:opacity-90 transition-opacity duration-200 rounded-none"
      style={{ minHeight: 0, minWidth: 0 }}
    >
      <img
        src="/images/img-google-login-button.png"
        alt="Sign in with Google"
        className="w-[150px] md:w-[220px] h-auto"
        style={{ display: "block" }}
      />
    </button>
  );
}
