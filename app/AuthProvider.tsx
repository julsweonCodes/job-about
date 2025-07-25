"use client";
import { useEffect, useRef } from "react";
import { supabaseClient } from "@/utils/supabase/client";
import { useAuthStore } from "@/stores/useAuthStore";
import { API_URLS, PAGE_URLS } from "@/constants/api";
import { useRouter } from "next/navigation";

export default function AuthProvider() {
  const { setIsLoggedIn, setUser, setProfileStatus, isLoggedIn, profileStatus } = useAuthStore();
  const router = useRouter();
  const isInitialized = useRef(false);

  // 실제 존재하는 경로인지 체크하는 함수
  const isExistingRoute = (pathname: string) => {
    const existingRoutes = [
      PAGE_URLS.HOME,
      PAGE_URLS.ONBOARDING.ROOT,
      PAGE_URLS.ONBOARDING.SEEKER.ROOT,
      PAGE_URLS.ONBOARDING.SEEKER.PROFILE,
      PAGE_URLS.ONBOARDING.SEEKER.QUIZ,
      PAGE_URLS.ONBOARDING.EMPLOYER.ROOT,
      PAGE_URLS.ONBOARDING.EMPLOYER.PROFILE,
      PAGE_URLS.SEEKER.ROOT,
      PAGE_URLS.SEEKER.MYPAGE,
      PAGE_URLS.EMPLOYER.ROOT,
      PAGE_URLS.EMPLOYER.MYPAGE,
      PAGE_URLS.EMPLOYER.POST.CREATE,
      PAGE_URLS.EMPLOYER.POST.DASHBOARD,
      PAGE_URLS.AUTH.CALLBACK,
      PAGE_URLS.AUTH.ERROR,
    ];
    return existingRoutes.some((route) => pathname === route);
  };

  // 404(존재하지 않는 경로)에서는 AuthProvider 자체를 렌더하지 않음
  if (typeof window !== "undefined" && !isExistingRoute(window.location.pathname)) {
    console.log("AuthProvider routing disabled for 404");
    return null;
  }

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    // 개발 중에는 AuthProvider 라우팅 비활성화
    if (process.env.NEXT_PUBLIC_DISABLE_MIDDLEWARE === "true") {
      console.log("AuthProvider routing disabled for development");
      return;
    }

    const supabase = supabaseClient;

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
            const userData = await response.json();
            setIsLoggedIn(true);
            setUser(user);
            setProfileStatus(userData.data.profileStatus);

            console.log("userData", userData);

            const currentPath = window.location.pathname;

            // role이 없으면 온보딩 페이지로 리다이렉트
            if (!userData.data.profileStatus.hasRole) {
              if (currentPath !== PAGE_URLS.ONBOARDING.ROOT) {
                console.log("redirecting to onboarding");
                router.replace(PAGE_URLS.ONBOARDING.ROOT);
                return; // 라우팅 후 조기 종료
              }
            } else if (
              userData.data.profileStatus.hasRole &&
              !userData.data.profileStatus.isProfileCompleted
            ) {
              // role은 있지만 프로필이 완성되지 않았으면 해당 role의 프로필 페이지로
              if (userData.data.profileStatus.role === "APPLICANT") {
                if (!userData.data.profileStatus.hasPersonalityProfile) {
                  if (currentPath !== PAGE_URLS.ONBOARDING.SEEKER.QUIZ) {
                    console.log("redirecting to seeker quiz");
                    router.replace(PAGE_URLS.ONBOARDING.SEEKER.QUIZ);
                    return;
                  }
                } else if (!userData.data.profileStatus.hasApplicantProfile) {
                  if (currentPath !== PAGE_URLS.ONBOARDING.SEEKER.PROFILE) {
                    console.log("redirecting to seeker profile");
                    router.replace(PAGE_URLS.ONBOARDING.SEEKER.PROFILE);
                    return;
                  }
                }
              } else if (userData.data.profileStatus.role === "EMPLOYER") {
                if (currentPath !== PAGE_URLS.ONBOARDING.EMPLOYER.PROFILE) {
                  console.log("redirecting to employer profile");
                  router.replace(PAGE_URLS.ONBOARDING.EMPLOYER.PROFILE);
                  return;
                }
              }
            }
          } else {
            // 사용자가 데이터베이스에 없음
            console.log("User not found in database, setting logged out");
            setIsLoggedIn(false);
            setUser(null);
            setProfileStatus(null);
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

          console.log("response", response);

          if (response.ok) {
            // 사용자가 데이터베이스에 존재함
            const userData = await response.json();
            setIsLoggedIn(true);
            setUser(session.user);
            setProfileStatus(userData.data.profileStatus);

            const currentPath = window.location.pathname;

            // role이 없으면 온보딩 페이지로 리다이렉트
            if (!userData.data.profileStatus.hasRole) {
              console.log("User has no role, redirecting to onboarding");
              router.replace(PAGE_URLS.ONBOARDING.ROOT);
            } else if (
              userData.data.profileStatus.hasRole &&
              !userData.data.profileStatus.isProfileCompleted
            ) {
              // role은 있지만 프로필이 완성되지 않았으면 해당 role의 프로필 페이지로
              console.log("User has role but profile not completed, redirecting to profile page");
              console.log("Profile status:", userData.data.profileStatus);
              if (userData.data.profileStatus.role === "APPLICANT") {
                console.log("Redirecting to:", PAGE_URLS.ONBOARDING.SEEKER.PROFILE);
                router.replace(PAGE_URLS.ONBOARDING.SEEKER.PROFILE);
              } else if (userData.data.profileStatus.role === "EMPLOYER") {
                console.log("Redirecting to:", PAGE_URLS.ONBOARDING.EMPLOYER.PROFILE);
                router.replace(PAGE_URLS.ONBOARDING.EMPLOYER.PROFILE);
              }
            }
          } else {
            // 사용자가 데이터베이스에 없음
            console.log("User not found in database after sign in");
            setIsLoggedIn(false);
            setUser(null);
            setProfileStatus(null);
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
        setProfileStatus(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [setIsLoggedIn, setUser]);

  useEffect(() => {
    // 개발 중에는 AuthProvider 라우팅 비활성화
    if (process.env.NEXT_PUBLIC_DISABLE_MIDDLEWARE === "true") {
      return;
    }

    if (!isLoggedIn || !profileStatus) return;

    const currentPath = window.location.pathname;

    // seeker 온보딩 분기
    if (profileStatus.role === "APPLICANT" && !profileStatus.isProfileCompleted) {
      if (!profileStatus.hasPersonalityProfile) {
        if (currentPath !== PAGE_URLS.ONBOARDING.SEEKER.QUIZ) {
          router.replace(PAGE_URLS.ONBOARDING.SEEKER.QUIZ);
        }
        return;
      } else if (!profileStatus.hasApplicantProfile) {
        if (currentPath !== PAGE_URLS.ONBOARDING.SEEKER.PROFILE) {
          router.replace(PAGE_URLS.ONBOARDING.SEEKER.PROFILE);
        }
        return;
      }
    } else if (profileStatus.role === "EMPLOYER" && !profileStatus.isProfileCompleted) {
      if (currentPath !== PAGE_URLS.ONBOARDING.EMPLOYER.PROFILE) {
        router.replace(PAGE_URLS.ONBOARDING.EMPLOYER.PROFILE);
      }
      return;
    } else if (!profileStatus.hasRole) {
      if (currentPath !== PAGE_URLS.ONBOARDING.ROOT) {
        router.replace(PAGE_URLS.ONBOARDING.ROOT);
      }
      return;
    }
    // 온보딩이 모두 끝난 경우에는 추가 라우팅 없음
  }, [isLoggedIn, profileStatus, router]);

  return null;
}
