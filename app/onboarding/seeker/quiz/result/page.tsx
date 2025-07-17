"use client";
import React, { useState } from "react";
import {
  RotateCcw,
  ArrowRight,
  User,
  Globe,
  Heart,
  Users,
  MessageCircle,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

interface PersonalityResult {
  name_en: string;
  name_ko: string;
  description_en: string;
  description_ko: string;
}

// Mock API result
const mockPersonalityResult: PersonalityResult = {
  name_en: "Empathetic Coordinator",
  name_ko: "공감형 코디네이터",
  description_en:
    "Gains energy from collaboration and communication. Excellent at understanding customer emotions and building positive relationships.",
  description_ko:
    "사람들과의 협업과 소통에서 에너지를 얻습니다. 특히 고객의 감정을 잘 파악하고 긍정적인 관계를 맺는 데 강점이 있습니다.",
};

const personalityIcons: Record<string, { icon: string; color: string }> = {
  "Empathetic Coordinator": { icon: "🤝", color: "from-pink-500 to-rose-500" },
  "공감형 코디네이터": { icon: "🤝", color: "from-pink-500 to-rose-500" },
};

const keyStrengths = [
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
];

const matchingRoles = [
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
];

function App() {
  const router = useRouter();
  const result = mockPersonalityResult;
  const personalityIcon = personalityIcons[result.name_en] || {
    icon: "🤝",
    color: "from-pink-500 to-rose-500",
  };

  const handleSeeJobs = () => {
    router.push("/seeker/");
  };

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
                    {result.name_en}
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
                      {result.description_en}
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
                size="lg"
                className={`group flex items-center justify-center space-x-2 px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl sm:rounded-2xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl text-sm sm:text-base`}
              >
                <span>See Recommended Jobs</span>
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
