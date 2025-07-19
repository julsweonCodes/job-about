"use client";
import React from "react";
import { createSupabaseBrowserClient } from "@/lib/client/supabase";
import { useAuthStore } from "@/stores/useAuthStore";

export default function GoogleLoginButton() {
  const { setLoginTried } = useAuthStore();

  const handleGoogleLogin = async () => {
    setLoginTried(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (error) {
      alert("Login Failed");
      return;
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full flex items-end justify-end p-0 bg-transparent border-none shadow-none hover:opacity-90 transition-opacity duration-200 rounded-none"
      style={{ minHeight: 0, minWidth: 0 }}
    >
      <img
        src="/images/img-google-login-button.png"
        alt="Sign in with Google"
        className="w-full h-auto w-[150px] md:w-[220px]"
        style={{ display: "block" }}
      />
    </button>
  );
}
