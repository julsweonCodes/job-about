import { useCallback, useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { supabaseClient } from "@/utils/supabase/client";
import { API_URLS } from "@/constants/api";
import { SupabaseUserMapper } from "@/types/user";
import { isAuthSupported, getBrowserRecommendations } from "@/utils/browser-compatibility";
import { useRouter } from "next/navigation";

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

  const router = useRouter();
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);
  const networkStatusRef = useRef<boolean>(true);
  const sessionRefreshRef = useRef<NodeJS.Timeout | null>(null);
  const isRedirectingRef = useRef<boolean>(false);

  const clearSupabaseLocalStorage = () => {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (key.startsWith("sb-") || key.startsWith("supabase.")) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (_) {}
    try {
      sessionStorage.removeItem("sb-last-auth-update");
    } catch (_) {}
  };

  const forceSignOutAndRedirect = useCallback(
    async (redirect = "/auth/login?error=invalid_token") => {
      if (isRedirectingRef.current) return;
      isRedirectingRef.current = true;
      try {
        if (sessionRefreshRef.current) {
          clearTimeout(sessionRefreshRef.current);
          sessionRefreshRef.current = null;
        }
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
          retryTimeoutRef.current = null;
        }
        await supabaseClient.auth.signOut();
      } catch (e) {
        console.warn("Sign out failed, continuing cleanup", e);
      }
      try {
        clearSupabaseLocalStorage();
      } catch (_) {}
      try {
        logout();
      } catch (_) {}
      router.replace(redirect);
    },
    [logout, router]
  );

  // 세션 갱신 로직
  const refreshSession = useCallback(async () => {
    try {
      console.log("Attempting to refresh session...");
      const { data, error } = await supabaseClient.auth.refreshSession();

      if (error) {
        console.warn("Session refresh failed:", error);
        await forceSignOutAndRedirect("/auth/login?error=refresh_failed");
        return false;
      }

      if (data.session) {
        console.log("Session refreshed successfully");
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

        if (response.status === 401 || response.status === 403) {
          await forceSignOutAndRedirect("/auth/login?error=unauthorized");
          return false;
        }
      }

      return false;
    } catch (error) {
      console.error("Session refresh error:", error);
      await forceSignOutAndRedirect("/auth/login?error=refresh_exception");
      return false;
    }
  }, [login, forceSignOutAndRedirect]);

  // 세션 만료 시간 체크 및 갱신 스케줄링
  const scheduleSessionRefresh = useCallback(
    (expiresAt: number) => {
      if (sessionRefreshRef.current) {
        clearTimeout(sessionRefreshRef.current);
      }

      const now = Date.now() / 1000;
      const timeUntilExpiry = expiresAt - now;
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

      if (!isAuthSupported()) {
        const recommendations = getBrowserRecommendations();
        console.warn("Browser compatibility issues detected:", recommendations);
        setAuthState("error");
        setLastError("Check your browser settings. Cookies and local storage must be enabled.");
        return;
      }

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
        const message = String(error.message || "");
        const status = (error as any).status as number | undefined;

        if (
          status === 401 ||
          status === 403 ||
          message.includes("sub claim") ||
          message.includes("does not exist")
        ) {
          console.warn("Invalid or unauthorized token detected, forcing sign out");
          await forceSignOutAndRedirect("/auth/login?error=invalid_token");
          return;
        }

        if (
          message.includes("AuthSessionMissingError") ||
          message.includes("Auth session missing") ||
          message.includes("No session") ||
          message.includes("Session not found") ||
          message.includes("Invalid session")
        ) {
          console.info("Auth session missing, treating as logged out");
          setAuthState("unauthenticated");
          return;
        }

        if (
          message.includes("JWT expired") ||
          message.includes("Token expired") ||
          message.includes("Invalid JWT")
        ) {
          console.warn("Token expired, attempting to refresh session");
          const refreshSuccess = await refreshSession();
          if (!refreshSuccess) {
            await forceSignOutAndRedirect("/auth/login?error=expired");
          }
          return;
        }

        if (
          message.includes("Network") ||
          message.includes("fetch") ||
          message.includes("timeout") ||
          message.includes("Failed to fetch")
        ) {
          console.warn("Network error during auth check:", message);
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

        if (
          message.includes("CORS") ||
          message.includes("cross-origin") ||
          message.includes("Forbidden") ||
          message.includes("Unauthorized")
        ) {
          console.warn("Security/CORS error during auth check:", message);
          setAuthState("error");
          setLastError("Authentication service temporarily unavailable");
          return;
        }

        console.error("Error fetching user:", error);

        if (canRetry()) {
          const delay = getRetryDelay();
          console.log(`Auth failed, retrying in ${delay}ms (attempt ${retryCount + 1})`);

          retryTimeoutRef.current = setTimeout(() => {
            retryAuth();
            checkAuthStatus();
          }, delay);
          return;
        }

        setAuthState("error");
        setLastError("Failed to fetch user authentication status");
        return;
      }

      if (user) {
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
              await forceSignOutAndRedirect("/auth/login?error=expired");
              return;
            }
          } else {
            scheduleSessionRefresh(expiresAt);
          }
        }

        try {
          const response = await fetch(API_URLS.USER.ME, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const userData = await response.json();
            const supabaseUser = SupabaseUserMapper.fromSupabaseUser(user);
            login(supabaseUser, userData.data.user, userData.data.profileStatus);
            console.log("set logged in user data", userData);
          } else {
            if (response.status === 401 || response.status === 403) {
              await forceSignOutAndRedirect("/auth/login?error=unauthorized");
              return;
            }
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
    forceSignOutAndRedirect,
  ]);

  // 인증 초기화
  const initializeAuth = useCallback(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    checkAuthStatus();

    const { data: listener } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change event:", event);

      if (event === "INITIAL_SESSION") {
        console.log("Initial session event, skipping...");
        return;
      }

      if (event === "TOKEN_REFRESHED") {
        console.log("Token refreshed event, skipping...");
        return;
      }

      if (event === "SIGNED_IN" && session?.user) {
        console.log("User signed in:", session.user.email);

        if (session.expires_at) {
          scheduleSessionRefresh(session.expires_at);
        }

        try {
          const response = await fetch(API_URLS.USER.ME, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          console.log("response", response);

          if (response.ok) {
            const userData = await response.json();
            const supabaseUser = SupabaseUserMapper.fromSupabaseUser(session.user);
            login(supabaseUser, userData.data.user, userData.data.profileStatus);
            console.log("set logged in user data", userData);
          } else {
            console.log("User not found in database after sign in");
            await forceSignOutAndRedirect("/auth/login?error=user_not_found");
          }
        } catch (error) {
          console.error("User check error after sign in:", error);
          await forceSignOutAndRedirect("/auth/login?error=post_signin_check_failed");
        }
      }

      if (event === "SIGNED_OUT") {
        console.log("User signed out");
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
  }, [checkAuthStatus, login, logout, scheduleSessionRefresh, forceSignOutAndRedirect]);

  const handleLogout = useCallback(async () => {
    try {
      if (sessionRefreshRef.current) {
        clearTimeout(sessionRefreshRef.current);
        sessionRefreshRef.current = null;
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }

      logout();
      await supabaseClient.auth.signOut();
      clearSupabaseLocalStorage();
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
      setLastError("로그아웃 처리 중 오류가 발생했습니다.");
    }
  }, [logout, setLastError]);

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

  const signOutFromServer = useCallback(async () => {
    try {
      await supabaseClient.auth.signOut();
    } catch (error) {
      console.warn("Server logout failed, but continuing with local cleanup:", error);
    }
  }, []);

  const handleRetry = useCallback(() => {
    if (canRetry()) {
      retryAuth();
      checkAuthStatus();
    }
  }, [canRetry, retryAuth, checkAuthStatus]);

  const isAuthenticated = authState === "authenticated";
  const isUnauthenticated = authState === "unauthenticated";
  const isError = authState === "error";
  const isLoading = authState === "initializing";

  return {
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
    appUser: useAuthStore.getState().appUser,
    profileStatus: useAuthStore.getState().profileStatus,
    initializeAuth,
    handleLogout,
    handleRetry,
    checkAuthStatus,
  };
}
