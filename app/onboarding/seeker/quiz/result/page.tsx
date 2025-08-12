"use client";
import React, { useState, useEffect } from "react";
import { User, Heart, Users, MessageCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/common/LoadingScreen";

interface PersonalityResult {
  name_en: string;
  name_ko: string;
  description_en: string;
  description_ko: string;
}

// API에서 성향 프로필 결과를 가져올 예정

const personalityIcons: Record<string, { icon: string; color: string }> = {
  "Action Hero": { icon: "⚡", color: "from-orange-500 to-red-500" },
  "Steady Specialist": { icon: "🎯", color: "from-blue-500 to-indigo-500" },
  "Empathetic Coordinator": { icon: "🤝", color: "from-pink-500 to-rose-500" },
  "Independent Problem-Solver": { icon: "🔧", color: "from-green-500 to-emerald-500" },
  "Flexible All-Rounder": { icon: "🌈", color: "from-purple-500 to-violet-500" },
};

// 성향별 핵심 강점 데이터
const personalityStrengths: Record<
  string,
  Array<{
    title_en: string;
    title_ko: string;
    description_en: string;
    description_ko: string;
    icon: any;
    color: string;
    iconColor: string;
  }>
> = {
  "Action Hero": [
    {
      title_en: "Quick Action",
      title_ko: "신속한 실행",
      description_en: "Fast decision making and execution",
      description_ko: "빠른 의사결정과 실행",
      icon: User,
      color: "from-orange-100 to-red-100",
      iconColor: "text-orange-600",
    },
    {
      title_en: "Multitasking",
      title_ko: "멀티태스킹",
      description_en: "Handling multiple tasks efficiently",
      description_ko: "여러 작업을 효율적으로 처리",
      icon: Users,
      color: "from-blue-100 to-indigo-100",
      iconColor: "text-blue-600",
    },
    {
      title_en: "Adaptability",
      title_ko: "적응력",
      description_en: "Quick adaptation to changes",
      description_ko: "변화에 빠른 적응",
      icon: Star,
      color: "from-green-100 to-emerald-100",
      iconColor: "text-green-600",
    },
  ],
  "Steady Specialist": [
    {
      title_en: "Focus",
      title_ko: "집중력",
      description_en: "Deep concentration on tasks",
      description_ko: "작업에 깊은 집중",
      icon: User,
      color: "from-blue-100 to-indigo-100",
      iconColor: "text-blue-600",
    },
    {
      title_en: "Quality",
      title_ko: "품질",
      description_en: "Pursuing high quality results",
      description_ko: "높은 품질의 결과 추구",
      icon: Star,
      color: "from-purple-100 to-violet-100",
      iconColor: "text-purple-600",
    },
    {
      title_en: "Reliability",
      title_ko: "신뢰성",
      description_en: "Consistent and dependable work",
      description_ko: "일관되고 신뢰할 수 있는 작업",
      icon: Heart,
      color: "from-green-100 to-emerald-100",
      iconColor: "text-green-600",
    },
  ],
  "Empathetic Coordinator": [
    {
      title_en: "Empathy",
      title_ko: "공감 능력",
      description_en: "Understanding others naturally",
      description_ko: "타인을 자연스럽게 이해",
      icon: Heart,
      color: "from-pink-100 to-rose-100",
      iconColor: "text-pink-600",
    },
    {
      title_en: "Collaboration",
      title_ko: "협업",
      description_en: "Working well with teams",
      description_ko: "팀과 잘 협력",
      icon: Users,
      color: "from-blue-100 to-indigo-100",
      iconColor: "text-blue-600",
    },
    {
      title_en: "Communication",
      title_ko: "소통",
      description_en: "Clear and effective messaging",
      description_ko: "명확하고 효과적인 소통",
      icon: MessageCircle,
      color: "from-green-100 to-emerald-100",
      iconColor: "text-green-600",
    },
  ],
  "Independent Problem-Solver": [
    {
      title_en: "Problem Solving",
      title_ko: "문제 해결",
      description_en: "Analyzing and solving complex issues",
      description_ko: "복잡한 문제 분석 및 해결",
      icon: User,
      color: "from-green-100 to-emerald-100",
      iconColor: "text-green-600",
    },
    {
      title_en: "Independence",
      title_ko: "독립성",
      description_en: "Working efficiently alone",
      description_ko: "혼자서 효율적으로 작업",
      icon: Star,
      color: "from-blue-100 to-indigo-100",
      iconColor: "text-blue-600",
    },
    {
      title_en: "Initiative",
      title_ko: "주도성",
      description_en: "Taking initiative in tasks",
      description_ko: "작업에서 주도적 역할",
      icon: Heart,
      color: "from-orange-100 to-red-100",
      iconColor: "text-orange-600",
    },
  ],
  "Flexible All-Rounder": [
    {
      title_en: "Adaptability",
      title_ko: "적응력",
      description_en: "Flexible response to situations",
      description_ko: "상황에 유연한 대응",
      icon: User,
      color: "from-purple-100 to-violet-100",
      iconColor: "text-purple-600",
    },
    {
      title_en: "Versatility",
      title_ko: "다재다능",
      description_en: "Handling various tasks well",
      description_ko: "다양한 작업을 잘 처리",
      icon: Star,
      color: "from-pink-100 to-rose-100",
      iconColor: "text-pink-600",
    },
    {
      title_en: "Balance",
      title_ko: "균형감",
      description_en: "Maintaining work-life balance",
      description_ko: "업무와 삶의 균형 유지",
      icon: Heart,
      color: "from-green-100 to-emerald-100",
      iconColor: "text-green-600",
    },
  ],
};

// 성향별 완벽한 역할 데이터
const personalityRoles: Record<
  string,
  Array<{
    title_en: string;
    title_ko: string;
    description_en: string;
    description_ko: string;
    icon: string;
  }>
> = {
  "Action Hero": [
    {
      title_en: "Fast-Paced Service Manager",
      title_ko: "빠른 템포 서비스 매니저",
      description_en: "Lead dynamic service operations with speed",
      description_ko: "빠른 속도로 역동적인 서비스 운영 주도",
      icon: "⚡",
    },
    {
      title_en: "Multi-Task Coordinator",
      title_ko: "멀티태스크 코디네이터",
      description_en: "Handle multiple tasks and projects efficiently",
      description_ko: "여러 작업과 프로젝트를 효율적으로 처리",
      icon: "🎯",
    },
    {
      title_en: "Dynamic Team Leader",
      title_ko: "역동적 팀 리더",
      description_en: "Lead teams in fast-changing environments",
      description_ko: "빠르게 변화하는 환경에서 팀을 이끌어",
      icon: "👥",
    },
    {
      title_en: "Adaptive Operations Specialist",
      title_ko: "적응형 운영 전문가",
      description_en: "Quickly adapt to changing business needs",
      description_ko: "변화하는 비즈니스 요구에 빠르게 적응",
      icon: "🔄",
    },
  ],
  "Steady Specialist": [
    {
      title_en: "Quality Control Specialist",
      title_ko: "품질 관리 전문가",
      description_en: "Ensure high standards in all operations",
      description_ko: "모든 운영에서 높은 기준 보장",
      icon: "🎯",
    },
    {
      title_en: "Process Improvement Lead",
      title_ko: "프로세스 개선 리더",
      description_en: "Optimize workflows and procedures",
      description_ko: "워크플로우와 절차 최적화",
      icon: "📊",
    },
    {
      title_en: "Reliability Manager",
      title_ko: "신뢰성 매니저",
      description_en: "Maintain consistent service quality",
      description_ko: "일관된 서비스 품질 유지",
      icon: "⭐",
    },
    {
      title_en: "Detail-Oriented Coordinator",
      title_ko: "세부사항 중심 코디네이터",
      description_en: "Focus on precision and accuracy",
      description_ko: "정밀도와 정확성에 집중",
      icon: "🔍",
    },
  ],
  "Empathetic Coordinator": [
    {
      title_en: "Customer Relations Specialist",
      title_ko: "고객 관계 전문가",
      description_en: "Build lasting relationships with customers",
      description_ko: "고객과의 지속적인 관계 구축",
      icon: "💬",
    },
    {
      title_en: "Front-of-House Coordinator",
      title_ko: "프론트 오브 하우스 코디네이터",
      description_en: "Manage customer experience and team coordination",
      description_ko: "고객 경험 및 팀 조정 관리",
      icon: "🎯",
    },
    {
      title_en: "Team Communication Lead",
      title_ko: "팀 커뮤니케이션 리더",
      description_en: "Facilitate team collaboration and communication",
      description_ko: "팀 협업 및 커뮤니케이션 촉진",
      icon: "👥",
    },
    {
      title_en: "Customer Experience Manager",
      title_ko: "고객 경험 매니저",
      description_en: "Oversee and enhance customer satisfaction",
      description_ko: "고객 만족도 관리 및 향상",
      icon: "⭐",
    },
  ],
  "Independent Problem-Solver": [
    {
      title_en: "Technical Problem Solver",
      title_ko: "기술적 문제 해결사",
      description_en: "Solve complex technical challenges independently",
      description_ko: "복잡한 기술적 도전을 독립적으로 해결",
      icon: "🔧",
    },
    {
      title_en: "Analytical Specialist",
      title_ko: "분석 전문가",
      description_en: "Analyze data and provide insights",
      description_ko: "데이터 분석 및 인사이트 제공",
      icon: "📊",
    },
    {
      title_en: "Independent Project Manager",
      title_ko: "독립적 프로젝트 매니저",
      description_en: "Manage projects with minimal supervision",
      description_ko: "최소한의 감독으로 프로젝트 관리",
      icon: "📋",
    },
    {
      title_en: "Innovation Lead",
      title_ko: "혁신 리더",
      description_en: "Drive creative solutions and improvements",
      description_ko: "창의적인 솔루션과 개선 주도",
      icon: "💡",
    },
  ],
  "Flexible All-Rounder": [
    {
      title_en: "Versatile Service Coordinator",
      title_ko: "다재다능 서비스 코디네이터",
      description_en: "Adapt to various service roles and needs",
      description_ko: "다양한 서비스 역할과 요구에 적응",
      icon: "🔄",
    },
    {
      title_en: "Adaptive Team Member",
      title_ko: "적응형 팀 멤버",
      description_en: "Fill various roles as team needs change",
      description_ko: "팀 요구 변화에 따라 다양한 역할 수행",
      icon: "👥",
    },
    {
      title_en: "Multi-Skill Specialist",
      title_ko: "다기능 전문가",
      description_en: "Handle diverse tasks and responsibilities",
      description_ko: "다양한 작업과 책임 처리",
      icon: "🎯",
    },
    {
      title_en: "Balanced Operations Manager",
      title_ko: "균형잡힌 운영 매니저",
      description_en: "Maintain work-life balance while delivering results",
      description_ko: "결과를 제공하면서 업무-생활 균형 유지",
      icon: "⚖️",
    },
  ],
};

function App() {
  const router = useRouter();
  const [personalityResult, setPersonalityResult] = useState<PersonalityResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API에서 사용자의 성향 프로필 가져오기
  useEffect(() => {
    const fetchPersonalityProfile = async () => {
      try {
        console.log("사용자 성향 프로필 로딩 시작");
        const sessionData = {
          quizSubmitted: sessionStorage.getItem("quizSubmitted"),
          profileId: sessionStorage.getItem("profileId"),
        };
        console.log("세션 스토리지 데이터:", sessionData);

        let response: Response | null = null;
        let data: any = null;
        let retryCount = 0;
        const maxRetries = 3;

        // 퀴즈를 방금 완료한 경우 재시도 로직 적용
        while (retryCount < maxRetries) {
          response = await fetch("/api/quiz/my-profile");

          if (response.ok) {
            data = await response.json();
            console.log(`재시도 ${retryCount + 1}회차 응답:`, data);

            // 데이터가 있거나 퀴즈를 완료하지 않은 상태라면 중단
            if (data.data || sessionData.quizSubmitted !== "true") {
              break;
            }
          }

          retryCount++;
          if (retryCount < maxRetries) {
            console.log(
              `프로필 데이터 없음, ${retryCount + 1}초 후 재시도... (${retryCount}/${maxRetries})`
            );
            await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount));
          }
        }

        if (!response || !response.ok) {
          if (response && response.status === 401) {
            // 401 Unauthorized인 경우 바로 퀴즈 페이지로 리다이렉션
            console.log("인증되지 않은 사용자, 퀴즈 페이지로 이동합니다.");
            router.replace("/onboarding/seeker/quiz");
            return;
          }
          console.error(`API 요청 실패: HTTP ${response?.status || "unknown"}`);
          throw new Error(`HTTP error! status: ${response?.status || "unknown"}`);
        }

        console.log("성향 프로필 로딩 완료:", data);

        if (data.status === "success") {
          if (data.data) {
            console.log("성향 프로필 데이터 설정:", data.data);
            setPersonalityResult({
              name_en: data.data.name_en,
              name_ko: data.data.name_ko,
              description_en: data.data.description_en,
              description_ko: data.data.description_ko,
            });
          } else {
            // 아직 퀴즈를 완료하지 않은 경우 -> 퀴즈 페이지로 리다이렉션
            console.log("퀴즈 결과가 없어 퀴즈 페이지로 이동합니다.");
            console.log("API 응답 데이터:", data);
            router.replace("/onboarding/seeker/quiz");
            return;
          }
        } else {
          console.error("API 응답 실패:", data);
          throw new Error(data.message || "성향 프로필을 불러오는데 실패했습니다.");
        }
      } catch (error) {
        console.error("성향 프로필 로딩 실패:", error);

        // 로그인이 필요하거나 퀴즈를 완료하지 않은 경우 퀴즈 페이지로 리다이렉션
        if (
          error instanceof Error &&
          (error.message.includes("로그인이 필요") ||
            error.message.includes("퀴즈를 완료하지 않았"))
        ) {
          console.log("로그인 또는 퀴즈 미완료로 인해 퀴즈 페이지로 이동합니다.");
          router.replace("/onboarding/seeker/quiz");
          return;
        }

        setError(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalityProfile();
  }, []);

  // 성향별 아이콘과 색상
  const personalityIcon = personalityResult
    ? personalityIcons[personalityResult.name_en] || {
        icon: "🤝",
        color: "from-pink-500 to-rose-500",
      }
    : {
        icon: "🤝",
        color: "from-pink-500 to-rose-500",
      };

  // 성향별 핵심 강점
  const keyStrengths = personalityResult
    ? personalityStrengths[personalityResult.name_en] ||
      personalityStrengths["Empathetic Coordinator"]
    : personalityStrengths["Empathetic Coordinator"];

  // 성향별 완벽한 역할
  const matchingRoles = personalityResult
    ? personalityRoles[personalityResult.name_en] || personalityRoles["Empathetic Coordinator"]
    : personalityRoles["Empathetic Coordinator"];

  const handleSeeJobs = () => {
    router.push("/onboarding/seeker/profile");
  };

  // 로딩 상태
  if (loading) {
    return (
      <LoadingScreen
        overlay={true}
        message="Loading your personality profile..."
        opacity="light"
      ></LoadingScreen>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to load results</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            onClick={() => router.push("/onboarding/seeker/quiz")}
            className="bg-purple-500 text-white px-6 py-2 rounded-lg"
          >
            Retake Quiz
          </Button>
        </div>
      </div>
    );
  }

  // 결과가 없는 경우
  if (!personalityResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No personality profile found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 sm:w-80 sm:h-80 sm:-top-40 sm:-right-40 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-20 -left-20 w-40 h-40 sm:w-80 sm:h-80 sm:-bottom-40 sm:-left-40 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-br from-rose-200/20 to-orange-200/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto sm:py-8 md:py-16">
        <div className="bg-white/80 backdrop-blur-sm sm:rounded-3xl shadow-2xl overflow-hidden sm:border sm:border-white/20 animate-fade-in">
          {/* Header Section */}
          <div
            className={`bg-gradient-to-r ${personalityIcon.color} px-4 py-8 sm:px-8 sm:py-16 text-center text-white relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600"></div>

            <div className="relative z-10">
              {/* Floating Icon */}
              <div className="flex justify-center mb-4 sm:mb-8">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 animate-float shadow-2xl">
                  <span className="text-4xl sm:text-6xl">{personalityIcon.icon}</span>
                </div>
              </div>

              {/* Title and Subtitle */}
              <div className="space-y-2 sm:space-y-4">
                <div className="animate-slide-up">
                  <p className="text-base sm:text-xl opacity-90 font-medium">
                    Your Work Personality
                  </p>
                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight mb-1 sm:mb-2 px-2">
                    {personalityResult.name_en}
                  </h1>
                </div>

                {/* Star Rating */}
                <div className="flex items-center justify-center space-x-1 mt-4 sm:mt-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 sm:w-6 sm:h-6 fill-current text-yellow-300 animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-8 md:p-12">
            {/* Personality Description Block */}
            <div className="mb-8 sm:mb-12">
              <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-gray-100/50 shadow-sm">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                      Your Personality Profile
                    </h3>
                    <p className="text-sm sm:text-lg text-gray-700 leading-relaxed">
                      {personalityResult.description_en}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Strengths Cards */}
            <div className="mb-8 sm:mb-12">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center px-2">
                Your Key Strengths
              </h3>

              <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4">
                {keyStrengths.map((strength, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100/50 text-center group hover:shadow-xl transition-all duration-300"
                  >
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${strength.color} rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <strength.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${strength.iconColor}`} />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
                      {strength.title_en}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600">{strength.description_en}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Job Roles */}
            <div className="mb-8 sm:mb-12">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center px-2">
                Perfect Roles for You
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {matchingRoles.map((role, index) => (
                  <div
                    key={index}
                    className="group bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:border-blue-200 animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-lg sm:text-xl">{role.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 group-hover:text-blue-600 transition-colors text-sm sm:text-base leading-tight">
                          {role.title_en}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-700 transition-colors leading-relaxed">
                          {role.description_en}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:space-x-4 justify-center">
              <Button
                onClick={handleSeeJobs}
                size="xl"
                className={`group flex items-center justify-center space-x-2 px-6 py-3 sm:px-8 sm:py-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl sm:rounded-2xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl text-sm sm:text-lg`}
              >
                <span>Continue to Profile Setup</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out 0.2s both;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default App;
