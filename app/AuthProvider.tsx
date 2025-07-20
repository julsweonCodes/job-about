"use client";
import { useEffect, useRef } from "react";
import { createSupabaseBrowserClient } from "@/lib/client/supabase";
import { useAuthStore } from "@/stores/useAuthStore";
import { API_URLS } from "@/constants/api";

export default function AuthProvider() {
  const { setIsLoggedIn, setUser } = useAuthStore();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const supabase = createSupabaseBrowserClient();

    // 초기 로그인 상태 확인
    const checkAuthStatus = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error("Error fetching user:", error);
          setIsLoggedIn(false);
          setUser(null);
          return;
        }

        if (user) {
          // 우리 서비스 DB에서 사용자 확인
          const response = await fetch(API_URLS.USER.ME, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            // 사용자가 데이터베이스에 존재함
            setIsLoggedIn(true);
            setUser(user);
          } else {
            // 사용자가 데이터베이스에 없음
            console.log("User not found in database, setting logged out");
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
      console.log("Auth state change event:", event);

      // INITIAL_SESSION 이벤트는 무시 (무한 루프 방지)
      if (event === "INITIAL_SESSION") {
        console.log("Initial session event, skipping...");
        return;
      }

      if (event === "SIGNED_IN" && session?.user) {
        console.log("User signed in:", session.user.email);

        // 우리 서비스 DB에서 사용자 확인
        try {
          const response = await fetch(API_URLS.USER.ME, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            // 사용자가 데이터베이스에 존재함
            setIsLoggedIn(true);
            setUser(session.user);
          } else {
            // 사용자가 데이터베이스에 없음
            console.log("User not found in database after sign in");
            setIsLoggedIn(false);
            setUser(null);
          }
        } catch (error) {
          console.error("User check error after sign in:", error);
          setIsLoggedIn(false);
          setUser(null);
        }
      }

      if (event === "SIGNED_OUT") {
        console.log("User signed out");
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
