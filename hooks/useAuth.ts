import { useCallback, useEffect, useRef } from "react";
import { useAuthStore, AuthState } from "@/stores/useAuthStore";
import { supabaseClient } from "@/utils/supabase/client";
import { API_URLS } from "@/constants/api";
import { SupabaseUserMapper } from "@/types/user";
import { isAuthSupported, getBrowserRecommendations } from "@/utils/browser-compatibility";

export function useAuth() {
  const {
    authState,
    retryCount,
    lastError,
    setAuthState,
    setRetryCount,
    setLastError,
    login,
    logout,
    retryAuth,
    canRetry,
    getRetryDelay,
    isInitialized,
    hasError,
  } = useAuthStore();

  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);

  // 인증 상태 확인
  const checkAuthStatus = useCallback(async () => {
    try {
      setAuthState("initializing");
      setLastError(null);

      // 브라우저 호환성 체크
      if (!isAuthSupported()) {
        const recommendations = getBrowserRecommendations();
        console.warn("Browser compatibility issues detected:", recommendations);
        setAuthState("error");
        setLastError("브라우저 설정을 확인해주세요. 쿠키와 로컬 스토리지가 활성화되어야 합니다.");
        return;
      }

      const {
        data: { user },
        error,
      } = await supabaseClient.auth.getUser();

      if (error) {
        // 시크릿 모드에서 발생하는 특정 에러들 처리
        if (
          error.message.includes("AuthSessionMissingError") ||
          error.message.includes("Auth session missing") ||
          error.message.includes("No session") ||
          error.message.includes("Session not found") ||
          error.message.includes("Invalid session")
        ) {
          console.info(
            "Auth session missing (likely incognito mode or storage disabled), treating as logged out"
          );
          setAuthState("unauthenticated");
          return;
        }

        // 네트워크 관련 에러들
        if (
          error.message.includes("Network") ||
          error.message.includes("fetch") ||
          error.message.includes("timeout") ||
          error.message.includes("Failed to fetch")
        ) {
          console.warn("Network error during auth check:", error.message);
          // 네트워크 에러는 재시도 대상
          if (canRetry()) {
            const delay = getRetryDelay();
            console.log(`Network error, retrying in ${delay}ms (attempt ${retryCount + 1})`);

            retryTimeoutRef.current = setTimeout(() => {
              retryAuth();
              checkAuthStatus();
            }, delay);
            return;
          }
        }

        // CORS 또는 보안 관련 에러들
        if (
          error.message.includes("CORS") ||
          error.message.includes("cross-origin") ||
          error.message.includes("Forbidden") ||
          error.message.includes("Unauthorized")
        ) {
          console.warn("Security/CORS error during auth check:", error.message);
          setAuthState("error");
          setLastError("Authentication service temporarily unavailable");
          return;
        }

        console.error("Error fetching user:", error);

        // 재시도 가능한 경우 재시도
        if (canRetry()) {
          const delay = getRetryDelay();
          console.log(`Auth failed, retrying in ${delay}ms (attempt ${retryCount + 1})`);

          retryTimeoutRef.current = setTimeout(() => {
            retryAuth();
            checkAuthStatus();
          }, delay);
          return;
        }

        // 재시도 불가능한 경우 에러 상태로 설정
        setAuthState("error");
        setLastError("Failed to fetch user authentication status");
        return;
      }

      if (user) {
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
            const userData = await response.json();
            const supabaseUser = SupabaseUserMapper.fromSupabaseUser(user);
            login(supabaseUser, userData.data.user, userData.data.profileStatus);

            console.log("set logged in user data", userData);
          } else {
            // 사용자가 데이터베이스에 없음
            console.log("User not found in database, setting logged out");
            setAuthState("unauthenticated");
            setLastError("User not found in database");
          }
        } catch (apiError) {
          console.error("API error:", apiError);
          setAuthState("error");
          setLastError("Failed to verify user in database");
        }
      } else {
        setAuthState("unauthenticated");
      }
    } catch (error) {
      console.error("Auth status check error:", error);
      setAuthState("error");
      setLastError("Authentication check failed");
    }
  }, [setAuthState, setLastError, canRetry, retryCount, getRetryDelay, retryAuth, login]);

  // 인증 초기화
  const initializeAuth = useCallback(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    checkAuthStatus();

    // 인증 상태 변경 리스너
    const { data: listener } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
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

          console.log("response", response);

          if (response.ok) {
            // 사용자가 데이터베이스에 존재함
            const userData = await response.json();
            const supabaseUser = SupabaseUserMapper.fromSupabaseUser(session.user);
            login(supabaseUser, userData.data.user, userData.data.profileStatus);

            console.log("set logged in user data", userData);
          } else {
            // 사용자가 데이터베이스에 없음
            console.log("User not found in database after sign in");
            logout();
          }
        } catch (error) {
          console.error("User check error after sign in:", error);
          logout();
        }
      }

      if (event === "SIGNED_OUT") {
        console.log("User signed out");
        logout();
      }
    });

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      listener.subscription.unsubscribe();
    };
  }, [checkAuthStatus, login, logout]);

  // 로그아웃 처리
  const handleLogout = useCallback(async () => {
    try {
      await supabaseClient.auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
      setLastError("Logout failed");
    }
  }, [setLastError]);

  // 재시도 처리
  const handleRetry = useCallback(() => {
    if (canRetry()) {
      retryAuth();
      checkAuthStatus();
    }
  }, [canRetry, retryAuth, checkAuthStatus]);

  // 인증 상태에 따른 헬퍼 함수들
  const isAuthenticated = authState === "authenticated";
  const isUnauthenticated = authState === "unauthenticated";
  const isError = authState === "error";
  const isLoading = authState === "initializing";

  return {
    // 상태
    authState,
    retryCount,
    lastError,
    isAuthenticated,
    isUnauthenticated,
    isError,
    isLoading,
    isInitialized: isInitialized(),
    hasError: hasError(),
    canRetry: canRetry(),

    // 액션
    initializeAuth,
    handleLogout,
    handleRetry,
    checkAuthStatus,
  };
}
