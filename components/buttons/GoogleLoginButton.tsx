"use client";
import React from "react";
import { createSupabaseBrowserClient } from "@/lib/client/supabase";
import { useAuthStore } from "@/stores/useAuthStore";

export default function GoogleLoginButton() {
  const { setLoginTried } = useAuthStore();

  const handleGoogleLogin = async () => {
    setLoginTried(true);
    const supabase = createSupabaseBrowserClient();

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error("Google login error:", error);
        alert("Login Failed");
        return;
      }

      // OAuth는 리다이렉트 방식이므로 콜백에서 처리됨
      console.log("Google login initiated, redirecting...");
    } catch (error) {
      console.error("Login process error:", error);
      alert("Login process failed");
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
