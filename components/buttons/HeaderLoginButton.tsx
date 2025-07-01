"use client";
import { useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/client/supabase";
import { useAuthStore } from "@/stores/useAuthStore";

export default function HeaderLoginButton() {
  const { isLoggedIn, user, setIsLoggedIn, setUser, loginTried, setLoginTried } = useAuthStore();

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
        if (loginTried && session?.user?.email) {
          alert(`로그인 성공! 이메일: ${session.user.email}`);
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
  }, [loginTried, setIsLoggedIn, setUser]);

  const handleGoogleLogin = async () => {
    setLoginTried(true);
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUser(null);
  };

  // test 용 버튼
  if (isLoggedIn && user) {
    return (
      <button
        className="px-4 py-2 bg-gray-200 text-gray-900 rounded font-semibold hover:bg-gray-300 transition-all"
        onClick={handleLogout}
      >
        Log out
      </button>
    );
  }

  return (
    <button
      className="hidden md:block bg-black text-white px-6 py-2 rounded-lg font-semibold"
      onClick={handleGoogleLogin}
    >
      Login
    </button>
  );
}
