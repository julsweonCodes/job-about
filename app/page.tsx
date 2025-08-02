"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Briefcase,
  ArrowRight,
  Brain,
  Smartphone,
  Target,
  Search,
  CheckCircle,
  Settings,
  UserCheck,
} from "lucide-react";

import { ProfileHeader } from "@/components/common/ProfileHeader";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/useAuthStore";
import BaseDialog from "@/components/common/BaseDialog";
import GoogleLoginButton from "@/components/buttons/GoogleLoginButton";
import { PAGE_URLS } from "@/constants/api";

// 상수 정의
const STEPS = {
  SEEKER: [
    {
      icon: Search,
      title: "Take Quiz",
      description:
        "Answer questions about your skills and preferences to help our AI understand you better.",
    },
    {
      icon: Target,
      title: "Get Matched",
      description:
        "Our AI analyzes job opportunities to find positions that perfectly match your profile.",
    },
    {
      icon: CheckCircle,
      title: "Apply in One Tap",
      description: "Apply to multiple matched positions instantly with your pre-filled profile.",
    },
  ],
  EMPLOYER: [
    {
      icon: Briefcase,
      title: "Post Job",
      description:
        "Create your job posting with our AI-assisted form for better candidate attraction.",
    },
    {
      icon: Settings,
      title: "Set Preferences",
      description: "Define your ideal candidate profile including skills and personality traits.",
    },
    {
      icon: UserCheck,
      title: "Get AI-matched Applicants",
      description: "Receive pre-screened candidates who match your criteria and company culture.",
    },
  ],
} as const;

const FEATURES = [
  {
    icon: Brain,
    title: "AI-Powered Matching",
    description:
      "Advanced algorithms analyze personality traits and skills for perfect job matches.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description: "Seamlessly designed for mobile with an intuitive, easy-to-use interface.",
  },
  {
    icon: Target,
    title: "Precision Matching",
    description: "Higher success rates with matches based on compatibility and cultural fit.",
  },
] as const;

// 타입 정의
type UserRole = "applicant" | "employer";
type TabType = "seekers" | "employers";

interface HeroContent {
  title: string;
  gradientClass: string;
  description: string;
}

interface CTAButton {
  text: string;
  icon: React.ComponentType<any>;
  gradientClass: string;
}

// 유틸리티 함수들
const getHeroContent = (isAuthenticated: boolean, userRole?: UserRole): HeroContent => {
  if (!isAuthenticated || userRole === "applicant") {
    return {
      title: "Find Jobs That Fit You Better",
      gradientClass: "from-purple-600 to-indigo-600",
      description:
        "AI-powered part-time job matching for students, career starters, and small teams.",
    };
  }

  return {
    title: "Find Candidates That Fit Your Team",
    gradientClass: "from-blue-600 to-teal-600",
    description: "AI-powered candidate matching for small businesses and growing teams.",
  };
};

const getCTAButton = (userRole?: UserRole): CTAButton => {
  if (userRole === "applicant") {
    return {
      text: "Get Matched Now",
      icon: Users,
      gradientClass: "from-purple-600 to-indigo-600",
    };
  }

  return {
    text: "Post a Job",
    icon: Briefcase,
    gradientClass: "from-blue-600 to-teal-600",
  };
};

// 컴포넌트들
const HeroSection: React.FC<{
  isAuthenticated: boolean;
  userRole?: UserRole;
  onShowLoginDialog: () => void;
}> = ({ isAuthenticated, userRole, onShowLoginDialog }) => {
  const router = useRouter();
  const heroContent = useMemo(
    () => getHeroContent(isAuthenticated, userRole),
    [isAuthenticated, userRole]
  );
  const ctaButton = useMemo(() => getCTAButton(userRole), [userRole]);
  const Icon = ctaButton.icon;

  const handleCTAClick = () => {
    if (isAuthenticated) {
      if (userRole === "applicant") {
        router.push(PAGE_URLS.SEEKER.ROOT);
      } else {
        router.push(PAGE_URLS.EMPLOYER.ROOT);
      }
    } else {
      // 비인증 사용자는 로그인 다이얼로그 표시
      onShowLoginDialog();
    }
  };

  const handleUnauthenticatedClick = () => {
    onShowLoginDialog();
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-indigo-50 pt-24 pb-20 lg:pt-40 lg:pb-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-100/20 via-transparent to-transparent"></div>

      <div className="relative max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            {heroContent.title.split(" ").map((word, index, array) =>
              index === array.length - 1 ? (
                <span
                  key={index}
                  className={`block text-transparent bg-clip-text bg-gradient-to-r ${heroContent.gradientClass}`}
                >
                  {word}
                </span>
              ) : (
                <span key={index}>{word} </span>
              )
            )}
          </h1>

          <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            {heroContent.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={handleUnauthenticatedClick}
                  className="group w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Users size={20} />
                  Get Matched Now
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>

                <button
                  onClick={handleUnauthenticatedClick}
                  className="group w-full sm:w-auto bg-white text-purple-600 border-2 border-purple-200 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Briefcase size={20} />
                  Post a Job
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </>
            ) : (
              <button
                onClick={handleCTAClick}
                className={`group w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 bg-gradient-to-r ${ctaButton.gradientClass} text-white`}
              >
                <Icon size={20} />
                {ctaButton.text}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection: React.FC<{
  isAuthenticated: boolean;
  userRole?: UserRole;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}> = ({ isAuthenticated, userRole, activeTab, onTabChange }) => {
  const currentSteps = useMemo(
    () => (activeTab === "seekers" ? STEPS.SEEKER : STEPS.EMPLOYER),
    [activeTab]
  );

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI-powered platform makes job matching simple and effective
          </p>
        </div>

        {!isAuthenticated ? (
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 rounded-xl p-2">
              {(["seekers", "employers"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => onTabChange(tab)}
                  className={`flex items-center gap-3  px-6 py-3 rounded-lg font-semibold transition-all duration-300 w-[200px] ${
                    activeTab === tab
                      ? "bg-white text-purple-600 shadow-md"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab === "seekers" ? <Users size={20} /> : <Briefcase size={20} />}
                  {tab === "seekers" ? "For Job Seekers" : "For Employers"}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 rounded-xl p-2">
              <button className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 w-[200px] bg-white text-purple-600 shadow-md">
                {userRole === "applicant" ? (
                  <>
                    <Users size={20} />
                    For Job Seekers
                  </>
                ) : (
                  <>
                    <Briefcase size={20} />
                    For Employers
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {currentSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <div className="bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="text-white" size={24} />
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                  </div>

                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>

                {index < currentSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const FeaturesSection: React.FC = () => (
  <section id="features" className="py-20 bg-gray-50">
    <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Choose job:about?</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Experience the future of job matching with features designed for success
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {FEATURES.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Icon className="text-white" size={24} />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl p-8 px-6 shadow-lg border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Built for Modern Job Matching</h3>
            <div className="space-y-4">
              {[
                {
                  title: "Personality-Based Matching",
                  description: "Find jobs that align with your work style and preferences",
                },
                {
                  title: "Flexible Scheduling",
                  description: "Perfect for students and those seeking work-life balance",
                },
                {
                  title: "Quality Connections",
                  description: "Connect with employers who value cultural fit",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-600 aspect-square rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl p-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="text-white" size={32} />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Intelligence</h4>
              <p className="text-gray-600">
                Our advanced algorithms learn from successful matches to improve recommendations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const CTASection: React.FC<{
  isAuthenticated: boolean;
  userRole?: UserRole;
  onShowLoginDialog: () => void;
}> = ({ isAuthenticated, userRole, onShowLoginDialog }) => {
  const router = useRouter();
  const ctaButton = useMemo(() => getCTAButton(userRole), [userRole]);
  const Icon = ctaButton.icon;

  const handleCTAClick = () => {
    if (isAuthenticated) {
      if (userRole === "applicant") {
        router.push(PAGE_URLS.SEEKER.ROOT);
      } else {
        router.push(PAGE_URLS.EMPLOYER.ROOT);
      }
    } else {
      // 비인증 사용자는 로그인 다이얼로그 표시
      onShowLoginDialog();
    }
  };

  const handleUnauthenticatedClick = () => {
    onShowLoginDialog();
  };

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're seeking opportunities or looking to hire, our AI-powered platform is here
            to help you succeed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {!isAuthenticated ? (
            <>
              <div className="bg-white rounded-2xl p-8 px-5 shadow-xl border border-purple-100 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">For Job Seekers</h3>
                <p className="text-gray-600 mb-6">
                  Find part-time opportunities that match your skills, schedule, and career goals
                </p>
                <button
                  onClick={handleUnauthenticatedClick}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Get Matched Now
                </button>
              </div>

              <div className="bg-white rounded-2xl p-8 px-5 shadow-xl border border-purple-100 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">For Employers</h3>
                <p className="text-gray-600 mb-6">
                  Connect with pre-screened candidates who are the right fit for your team
                </p>
                <button
                  onClick={handleUnauthenticatedClick}
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Post Your Job
                </button>
              </div>
            </>
          ) : (
            <div className="col-span-1 md:col-span-2 flex justify-center">
              <div className="bg-white rounded-2xl p-8 px-5 shadow-xl border border-purple-100 text-center max-w-md">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-gradient-to-br ${
                    userRole === "applicant"
                      ? "from-purple-500 to-indigo-500"
                      : "from-blue-500 to-teal-500"
                  }`}
                >
                  <Icon className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {userRole === "applicant" ? "Ready to Get Matched?" : "Ready to Post a Job?"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {userRole === "applicant"
                    ? "Find your perfect part-time opportunity with our AI-powered matching system."
                    : "Connect with pre-screened candidates who are the right fit for your team."}
                </p>
                <button
                  onClick={handleCTAClick}
                  className={`w-full px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r ${ctaButton.gradientClass} text-white`}
                >
                  {ctaButton.text}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-gray-900 text-white py-12">
    <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-bold">job:about</span>
          </div>
          <p className="text-gray-400 max-w-md">
            AI-powered job matching platform connecting talented individuals with opportunities that
            fit their skills and personality.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {["How It Works", "Features", "Contact Us"].map((link) => (
              <li key={link}>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-8 pt-8 text-center">
        <p className="text-gray-400 text-sm">© 2025 job:about. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

// 메인 컴포넌트
function App() {
  const { isAuthenticated, appUser, isLoading } = useAuth();
  const { isEmployer, isApplicant } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>("seekers");
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  // 인증 상태와 사용자 데이터가 변경될 때 activeTab 업데이트
  useEffect(() => {
    const employerResult = isEmployer();
    const applicantResult = isApplicant();

    // 로딩 중이거나 데이터가 아직 없는 경우 기본값 유지
    if (isLoading || !appUser) {
      return;
    }

    if (isAuthenticated && employerResult) {
      setActiveTab("employers");
    } else if (isAuthenticated && applicantResult) {
      setActiveTab("seekers");
    } else if (!isAuthenticated) {
      setActiveTab("seekers");
    } else {
      setActiveTab("seekers");
    }
  }, [isAuthenticated, appUser, isLoading, isEmployer, isApplicant]);

  const handleShowLoginDialog = () => {
    setShowLoginDialog(true);
  };

  // 로딩 중일 때 스켈레톤 UI 표시
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <ProfileHeader />
        <main>
          <div className="animate-pulse">
            {/* Hero Section Skeleton */}
            <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-indigo-50 pt-24 pb-20 lg:pt-40 lg:pb-28">
              <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
                <div className="text-center">
                  <div className="h-16 bg-gray-200 rounded-lg mb-6 max-w-4xl mx-auto"></div>
                  <div className="h-8 bg-gray-200 rounded mb-12 max-w-2xl mx-auto"></div>
                  <div className="flex justify-center gap-4">
                    <div className="h-12 bg-gray-200 rounded-xl w-48"></div>
                    <div className="h-12 bg-gray-200 rounded-xl w-48"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* How It Works Section Skeleton */}
            <section className="py-20 bg-white">
              <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <div className="h-8 bg-gray-200 rounded mb-4 max-w-xs mx-auto"></div>
                  <div className="h-6 bg-gray-200 rounded max-w-2xl mx-auto"></div>
                </div>

                {/* Tab Skeleton */}
                <div className="flex justify-center mb-12">
                  <div className="bg-gray-100 rounded-xl p-2">
                    <div className="h-12 bg-gray-200 rounded-lg w-48"></div>
                  </div>
                </div>

                {/* Steps Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[1, 2, 3].map((index) => (
                    <div key={index} className="bg-gray-50 rounded-2xl p-8">
                      <div className="w-16 h-16 bg-gray-200 rounded-2xl mb-6"></div>
                      <div className="h-6 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Features Section Skeleton */}
            <section className="py-20 bg-gray-50">
              <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <div className="h-8 bg-gray-200 rounded mb-4 max-w-xs mx-auto"></div>
                  <div className="h-6 bg-gray-200 rounded max-w-2xl mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                  {[1, 2, 3].map((index) => (
                    <div key={index} className="text-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-2xl mx-auto mb-6"></div>
                      <div className="h-6 bg-gray-200 rounded mb-4 max-w-xs mx-auto"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA Section Skeleton */}
            <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-indigo-50">
              <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <div className="h-8 bg-gray-200 rounded mb-4 max-w-xs mx-auto"></div>
                  <div className="h-6 bg-gray-200 rounded max-w-2xl mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  <div className="bg-white rounded-2xl p-8 shadow-xl border border-purple-100">
                    <div className="w-16 h-16 bg-gray-200 rounded-2xl mx-auto mb-6"></div>
                    <div className="h-6 bg-gray-200 rounded mb-4 max-w-xs mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-6"></div>
                    <div className="h-12 bg-gray-200 rounded-xl"></div>
                  </div>
                  <div className="bg-white rounded-2xl p-8 shadow-xl border border-purple-100">
                    <div className="w-16 h-16 bg-gray-200 rounded-2xl mx-auto mb-6"></div>
                    <div className="h-6 bg-gray-200 rounded mb-4 max-w-xs mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-6"></div>
                    <div className="h-12 bg-gray-200 rounded-xl"></div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    );
  }

  // userRole 계산 - 간단한 방식으로 변경
  const userRole = (() => {
    if (isEmployer()) return "employer";
    if (isApplicant()) return "applicant";
    return undefined;
  })();

  return (
    <div className="min-h-screen bg-white">
      <ProfileHeader />
      <main>
        <HeroSection
          isAuthenticated={isAuthenticated}
          userRole={userRole}
          onShowLoginDialog={handleShowLoginDialog}
        />
        <HowItWorksSection
          isAuthenticated={isAuthenticated}
          userRole={userRole}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <FeaturesSection />
        <CTASection
          isAuthenticated={isAuthenticated}
          userRole={userRole}
          onShowLoginDialog={handleShowLoginDialog}
        />
      </main>
      <Footer />

      {/* 공통 로그인 다이얼로그 */}
      <BaseDialog
        open={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
        title=""
        size="md"
        className="max-w-md"
        type="bottomSheet"
      >
        <div className="relative">
          {/* 배경 그라데이션 */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-indigo-50 rounded-3xl"></div>

          {/* 컨텐츠 */}
          <div className="relative z-10 p-8 flex flex-col items-center">
            {/* 헤더 */}
            <div className="text-center mb-8">
              {/* 로고/아이콘 */}
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Users className="text-white" size={32} />
              </div>

              {/* 제목 */}
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900  tracking-tight">
                Welcome to job:about
              </h3>
            </div>

            {/* 구글 로그인 버튼 */}
            <div className="flex justify-center mb-4">
              <GoogleLoginButton size="lg" />
            </div>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-sm mx-auto text-center">
              Join our AI-powered job matching platform and discover opportunities that fit your
              skills and personality
            </p>
          </div>
        </div>
      </BaseDialog>
    </div>
  );
}

export default App;
