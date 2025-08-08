import { useCallback, useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
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
  const networkStatusRef = useRef<boolean>(true);
  const sessionRefreshRef = useRef<NodeJS.Timeout | null>(null);

  // 세션 갱신 로직
  const refreshSession = useCallback(async () => {
    try {
      console.log("Attempting to refresh session...");
      const { data, error } = await supabaseClient.auth.refreshSession();

      if (error) {
        console.warn("Session refresh failed:", error);
        logout();
        return false;
      }

      if (data.session) {
        console.log("Session refreshed successfully");
        // 갱신된 세션으로 사용자 정보 업데이트
        const response = await fetch(API_URLS.USER.ME, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const userData = await response.json();
          const supabaseUser = SupabaseUserMapper.fromSupabaseUser(data.session.user);
          login(supabaseUser, userData.data.user, userData.data.profileStatus);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Session refresh error:", error);
      logout();
      return false;
    }
  }, [login, logout]);

  // 세션 만료 시간 체크 및 갱신 스케줄링
  const scheduleSessionRefresh = useCallback(
    (expiresAt: number) => {
      // 기존 타이머 클리어
      if (sessionRefreshRef.current) {
        clearTimeout(sessionRefreshRef.current);
      }

      const now = Date.now() / 1000;
      const timeUntilExpiry = expiresAt - now;

      // 만료 5분 전에 갱신 시도
      const refreshTime = Math.max(timeUntilExpiry - 300, 0);

      sessionRefreshRef.current = setTimeout(async () => {
        const success = await refreshSession();
        if (!success) {
          console.warn("Session refresh failed, user will be logged out");
        }
      }, refreshTime * 1000);
    },
    [refreshSession]
  );

  // 네트워크 상태 감지
  useEffect(() => {
    const handleOnline = () => {
      networkStatusRef.current = true;
      console.log("Network is online, retrying auth if needed");
      if (authState === "error" && canRetry()) {
        retryAuth();
        checkAuthStatus();
      }
    };

    const handleOffline = () => {
      networkStatusRef.current = false;
      console.log("Network is offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [authState, canRetry, retryAuth]);

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
        setLastError("Check your browser settings. Cookies and local storage must be enabled.");
        return;
      }

      // 네트워크 상태 확인
      if (!navigator.onLine) {
        console.warn("Network is offline, skipping auth check");
        setAuthState("error");
        setLastError("Check your network connection.");
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

        // 토큰 만료 에러 처리
        if (
          error.message.includes("JWT expired") ||
          error.message.includes("Token expired") ||
          error.message.includes("Invalid JWT")
        ) {
          console.warn("Token expired, attempting to refresh session");
          const refreshSuccess = await refreshSession();
          if (!refreshSuccess) {
            logout();
          }
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
        // 세션 만료 시간 확인 및 갱신 스케줄링
        const {
          data: { session },
        } = await supabaseClient.auth.getSession();
        const expiresAt = session?.expires_at;

        if (expiresAt) {
          const now = Date.now() / 1000;
          if (now > expiresAt) {
            console.warn("Session expired, attempting to refresh");
            const refreshSuccess = await refreshSession();
            if (!refreshSuccess) {
              logout();
              return;
            }
          } else {
            // 세션 갱신 스케줄링
            scheduleSessionRefresh(expiresAt);
          }
        }

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
  }, [
    setAuthState,
    setLastError,
    canRetry,
    retryCount,
    getRetryDelay,
    retryAuth,
    login,
    logout,
    refreshSession,
    scheduleSessionRefresh,
  ]);

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

      // TOKEN_REFRESHED 이벤트도 무시 (불필요한 API 호출 방지)
      if (event === "TOKEN_REFRESHED") {
        console.log("Token refreshed event, skipping...");
        return;
      }

      if (event === "SIGNED_IN" && session?.user) {
        console.log("User signed in:", session.user.email);

        // 세션 갱신 스케줄링
        if (session.expires_at) {
          scheduleSessionRefresh(session.expires_at);
        }

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
        // 세션 갱신 타이머 클리어
        if (sessionRefreshRef.current) {
          clearTimeout(sessionRefreshRef.current);
        }
        logout();
      }
    });

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (sessionRefreshRef.current) {
        clearTimeout(sessionRefreshRef.current);
      }
      listener.subscription.unsubscribe();
    };
  }, [checkAuthStatus, login, logout, scheduleSessionRefresh]);

  // 로그아웃 처리
  const handleLogout = useCallback(async () => {
    try {
      // 1. 타이머 정리
      clearSessionTimers();

      // 2. 로컬 상태 초기화
      logout();

      // 3. 서버 로그아웃 처리
      await signOutFromServer();

      // 4. 페이지 새로고침
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
      setLastError("로그아웃 처리 중 오류가 발생했습니다.");
    }
  }, [logout, setLastError]);

  // 세션 타이머 정리
  const clearSessionTimers = useCallback(() => {
    if (sessionRefreshRef.current) {
      clearTimeout(sessionRefreshRef.current);
      sessionRefreshRef.current = null;
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  // 서버 로그아웃 처리
  const signOutFromServer = useCallback(async () => {
    try {
      await supabaseClient.auth.signOut();
    } catch (error) {
      console.warn("Server logout failed, but continuing with local cleanup:", error);
      // 서버 로그아웃 실패해도 로컬 정리는 계속 진행
    }
  }, []);

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

    // 사용자 데이터
    appUser: useAuthStore.getState().appUser,
    profileStatus: useAuthStore.getState().profileStatus,

    // 액션
    initializeAuth,
    handleLogout,
    handleRetry,
    checkAuthStatus,
  };
}
