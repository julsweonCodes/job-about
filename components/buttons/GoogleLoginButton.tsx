"use client";
import React, { useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/client/supabase";
import { useAuthStore } from "@/stores/useAuthStore";

export default function GoogleLoginButton() {
  const { setIsLoggedIn, setUser, loginTried, setLoginTried, isLoggedIn, user } = useAuthStore();

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    // 최초 로그인 상태 확인
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setIsLoggedIn(true);
        setUser(data.user);
      }
    });
    // 로그인 이벤트 구독
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setIsLoggedIn(true);
        setUser(session?.user ?? null);
      }
      if (event === "SIGNED_OUT") {
        setIsLoggedIn(false);
        setUser(null);
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [loginTried, setIsLoggedIn, setUser]);

  const handleGoogleLogin = async () => {
    setLoginTried(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (error) {
      alert("Login Failed");
      return;
    }
  };

  if (isLoggedIn && user) {
    return null;
  }

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center border-2 bg-background-primary border-gray-300 text-gray-700 px-5 py-3 md:px-5 md:py-4 text-lg font-semibold md:text-xl hover:shadow-xl transform transition-all duration-300 rounded-[16px]"
    >
      <img src="/icons/icon-google.svg" alt="Google" className="w-6 h-6 md:w-8 md:h-8" />
      <span className="ml-2">Continue with Google</span>
    </button>
  );
}
