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

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

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

            // role이 없으면 온보딩 페이지로 리다이렉트
            if (!userData.data.profileStatus.hasRole) {
              if (window.location.pathname !== PAGE_URLS.ONBOARDING) {
                console.log("redirecting to onboarding");
                router.replace(PAGE_URLS.ONBOARDING);
                return; // 라우팅 후 조기 종료
              }
            } else if (
              userData.data.profileStatus.hasRole &&
              !userData.data.profileStatus.isProfileCompleted
            ) {
              // role은 있지만 프로필이 완성되지 않았으면 해당 role의 프로필 페이지로
              if (userData.data.profileStatus.role === "APPLICANT") {
                if (!userData.data.profileStatus.hasPersonalityProfile) {
                  if (window.location.pathname !== API_URLS.ONBOARDING.SEEKER_QUIZ) {
                    console.log("redirecting to seeker quiz");
                    router.replace(API_URLS.ONBOARDING.SEEKER_QUIZ);
                    return;
                  }
                } else if (!userData.data.profileStatus.hasApplicantProfile) {
                  if (window.location.pathname !== API_URLS.ONBOARDING.SEEKER_PROFILE) {
                    console.log("redirecting to seeker profile");
                    router.replace(API_URLS.ONBOARDING.SEEKER_PROFILE);
                    return;
                  }
                }
              } else if (userData.data.profileStatus.role === "EMPLOYER") {
                if (window.location.pathname !== API_URLS.ONBOARDING.EMPLOYER_PROFILE) {
                  console.log("redirecting to employer profile");
                  router.replace(API_URLS.ONBOARDING.EMPLOYER_PROFILE);
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

            // role이 없으면 온보딩 페이지로 리다이렉트
            if (!userData.data.profileStatus.hasRole) {
              console.log("User has no role, redirecting to onboarding");
              router.replace(PAGE_URLS.ONBOARDING);
            } else if (
              userData.data.profileStatus.hasRole &&
              !userData.data.profileStatus.isProfileCompleted
            ) {
              // role은 있지만 프로필이 완성되지 않았으면 해당 role의 프로필 페이지로
              console.log("User has role but profile not completed, redirecting to profile page");
              console.log("Profile status:", userData.data.profileStatus);
              if (userData.data.profileStatus.role === "APPLICANT") {
                console.log("Redirecting to:", API_URLS.ONBOARDING.SEEKER_PROFILE);
                router.replace(API_URLS.ONBOARDING.SEEKER_PROFILE);
              } else if (userData.data.profileStatus.role === "EMPLOYER") {
                console.log("Redirecting to:", API_URLS.ONBOARDING.EMPLOYER_PROFILE);
                router.replace(API_URLS.ONBOARDING.EMPLOYER_PROFILE);
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
    if (!isLoggedIn || !profileStatus) return;

    // seeker 온보딩 분기
    if (profileStatus.role === "APPLICANT" && !profileStatus.isProfileCompleted) {
      if (!profileStatus.hasPersonalityProfile) {
        if (window.location.pathname !== API_URLS.ONBOARDING.SEEKER_QUIZ) {
          router.replace(API_URLS.ONBOARDING.SEEKER_QUIZ);
        }
        return;
      } else if (!profileStatus.hasApplicantProfile) {
        if (window.location.pathname !== API_URLS.ONBOARDING.SEEKER_PROFILE) {
          router.replace(API_URLS.ONBOARDING.SEEKER_PROFILE);
        }
        return;
      }
    } else if (profileStatus.role === "EMPLOYER" && !profileStatus.isProfileCompleted) {
      if (window.location.pathname !== API_URLS.ONBOARDING.EMPLOYER_PROFILE) {
        router.replace(API_URLS.ONBOARDING.EMPLOYER_PROFILE);
      }
      return;
    } else if (!profileStatus.hasRole) {
      if (window.location.pathname !== PAGE_URLS.ONBOARDING) {
        router.replace(PAGE_URLS.ONBOARDING);
      }
      return;
    }
    // 온보딩이 모두 끝난 경우에는 추가 라우팅 없음
  }, [isLoggedIn, profileStatus, router]);

  return null;
}
