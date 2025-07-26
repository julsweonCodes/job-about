"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Users, Check, ChevronRight } from "lucide-react";
import { API_URLS, PAGE_URLS } from "@/constants/api";
import { ProfileHeader } from "@/components/common/ProfileHeader";
import { Role } from "@prisma/client";
import LoadingScreen from "@/components/common/LoadingScreen";
import { useAuthStore } from "@/stores/useAuthStore";

export default function OnboardingPage() {
  const [selectedType, setSelectedType] = useState<Role | null>(null);
  const router = useRouter();
  const { profileStatus, isLoggedIn } = useAuthStore();

  // 프로필이 완성되었으면 해당 페이지로 리다이렉트
  useEffect(() => {
    console.log("isLoggedIn", isLoggedIn);
    console.log("profileStatus", profileStatus);
    if (isLoggedIn && profileStatus) {
      if (profileStatus.hasRole && profileStatus.isProfileCompleted) {
        if (profileStatus.role === "APPLICANT") {
          router.replace(PAGE_URLS.SEEKER.ROOT);
        } else if (profileStatus.role === "EMPLOYER") {
          router.replace(PAGE_URLS.EMPLOYER.ROOT);
        }
      }
    }
  }, [profileStatus, isLoggedIn, router]);

  // 로딩 중이면 로딩 화면 표시
  if (!isLoggedIn || !profileStatus) {
    return <LoadingScreen />;
  }

  const handleSelection = (type: Role) => {
    setSelectedType(type);
  };

  const handleConfirm = async () => {
    if (!selectedType) return;

    try {
      const res = await fetch(API_URLS.USER.ROLE, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selectedType }),
      });

      const result = await res.json();

      if (res.ok) {
        // role에 따라 페이지 이동
        if (selectedType === Role.APPLICANT) {
          // APPLICANT는 quiz 페이지로 이동
          router.push("/onboarding/seeker/quiz");
        } else {
          // EMPLOYER는 employer 대시보드로 이동
          router.push(PAGE_URLS.EMPLOYER.ROOT);
        }
      } else {
        alert(result.message || "Error update user role");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Failed to update user role. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col">
      {/* ProfileHeader 추가 */}
      <ProfileHeader onClickLogo={() => router.replace("/")} />

      {/* 메인 콘텐츠를 화면 중앙에 배치 */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-lg sm:max-w-2xl lg:max-w-4xl mx-auto">
          {/* Cards Container */}
          <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
            {/* Job Seeker Card */}
            <div
              onClick={() => handleSelection(Role.APPLICANT)}
              className={`relative group cursor-pointer transition-all duration-300 ease-out transform active:scale-95 ${
                selectedType === Role.APPLICANT
                  ? "scale-[1.02] sm:scale-105"
                  : "hover:scale-[1.01] sm:hover:scale-105"
              }`}
            >
              <div
                className={`relative p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 ease-out ${
                  selectedType === Role.APPLICANT
                    ? "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-xl shadow-blue-200/50"
                    : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg shadow-sm"
                }`}
              >
                {/* Selection Indicator */}
                <div
                  className={`absolute -top-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                    selectedType === Role.APPLICANT
                      ? "bg-blue-500 scale-100 opacity-100"
                      : "bg-gray-300 scale-0 opacity-0"
                  }`}
                >
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>

                <div className="text-center">
                  {/* Icon Container */}
                  <div
                    className={`inline-flex p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 transition-all duration-300 ${
                      selectedType === Role.APPLICANT
                        ? "bg-blue-100 shadow-inner"
                        : "bg-gray-100 group-hover:bg-blue-50"
                    }`}
                  >
                    <Briefcase
                      className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 transition-colors duration-300 ${
                        selectedType === Role.APPLICANT
                          ? "text-blue-600"
                          : "text-gray-600 group-hover:text-blue-500"
                      }`}
                    />
                  </div>

                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                    Job Seeker
                  </h3>

                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    Find flexible jobs that match your skills and personality.
                  </p>
                </div>
              </div>
            </div>

            {/* Employer Card */}
            <div
              onClick={() => handleSelection(Role.EMPLOYER)}
              className={`relative group cursor-pointer transition-all duration-300 ease-out transform active:scale-95 ${
                selectedType === Role.EMPLOYER
                  ? "scale-[1.02] sm:scale-105"
                  : "hover:scale-[1.01] sm:hover:scale-105"
              }`}
            >
              <div
                className={`relative p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 ease-out ${
                  selectedType === Role.EMPLOYER
                    ? "border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 shadow-xl shadow-purple-200/50"
                    : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-lg shadow-sm"
                }`}
              >
                {/* Selection Indicator */}
                <div
                  className={`absolute -top-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                    selectedType === Role.EMPLOYER
                      ? "bg-purple-500 scale-100 opacity-100"
                      : "bg-gray-300 scale-0 opacity-0"
                  }`}
                >
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>

                <div className="text-center">
                  {/* Icon Container */}
                  <div
                    className={`inline-flex p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 transition-all duration-300 ${
                      selectedType === Role.EMPLOYER
                        ? "bg-purple-100 shadow-inner"
                        : "bg-gray-100 group-hover:bg-purple-50"
                    }`}
                  >
                    <Users
                      className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 transition-colors duration-300 ${
                        selectedType === Role.EMPLOYER
                          ? "text-purple-600"
                          : "text-gray-600 group-hover:text-purple-500"
                      }`}
                    />
                  </div>

                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                    Employer
                  </h3>

                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                    Post jobs and discover applicants with the right traits and availability.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Button Section */}
          <div className="text-center px-4">
            <button
              onClick={handleConfirm}
              disabled={!selectedType}
              className={`group inline-flex items-center justify-center w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 rounded-xl sm:rounded-2xl text-lg sm:text-xl font-semibold transition-all duration-300 ease-out transform active:scale-95 ${
                selectedType
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105 shadow-lg"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-sm"
              }`}
            >
              Continue
              <ChevronRight
                className={`ml-2 w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 ${
                  selectedType ? "group-hover:translate-x-1" : ""
                }`}
              />
            </button>

            {!selectedType && (
              <p className="text-gray-500 text-sm sm:text-base mt-4 sm:mt-6 animate-pulse">
                Please select your role to continue
              </p>
            )}
          </div>

          {/* Bottom Spacing for Mobile */}
          <div className="h-8 sm:h-0"></div>
        </div>
      </div>
    </div>
  );
}
