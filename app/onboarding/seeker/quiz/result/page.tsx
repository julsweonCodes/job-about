"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

// 예시 personalityTypes (실제 데이터에 맞게 수정 필요)
const personalityTypes = {
  "The Energetic Collaborator": {
    summary: "빠른 상황 대처와 팀워크에 강점이 있는 타입입니다!",
    traits: ["Work Pace", "Interpersonal Style"],
    jobTypes: ["Barista", "Team Leader"],
    color: "from-blue-500 to-indigo-600",
    icon: "⚡",
  },
  // ...다른 타입들 추가
} as const;

type PersonalityTypeKey = keyof typeof personalityTypes;

function getPersonalityResult(
  responses: { question_code: string; choice_label: string }[]
): PersonalityTypeKey {
  // traitCounts 계산 로직 (간단 예시)
  const traitCounts: Record<string, number> = {};
  responses.forEach(({ question_code, choice_label }) => {
    // 실제 trait 매핑 로직 필요
    // 예시: traitCounts[trait] = (traitCounts[trait] || 0) + 1;
  });
  // personality 결정 로직 (예시)
  // ...
  return "The Energetic Collaborator";
}

export default function QuizResultPage() {
  const [responses, setResponses] = useState<{ question_code: string; choice_label: string }[]>([]);
  const [personality, setPersonality] = useState<
    (typeof personalityTypes)[PersonalityTypeKey] | null
  >(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = sessionStorage.getItem("quizResponses");
      if (raw) {
        const parsed = JSON.parse(raw) as { question_code: string; choice_label: string }[];
        setResponses(parsed);
        const type = getPersonalityResult(parsed);
        setPersonality(personalityTypes[type]);
      }
    }
  }, []);

  if (!personality)
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-xl w-full flex flex-col items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">퀴즈 결과</h1>
        <div className="text-5xl mb-4">{personality.icon}</div>
        <p className="text-lg text-gray-700 mb-6 text-center">{personality.summary}</p>
        <div className="w-full mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">세부 역량 점수</h2>
          <ul className="space-y-2">
            {personality.traits.map((trait: string) => (
              <li
                key={trait}
                className="flex justify-between text-gray-700 bg-gray-50 rounded-xl px-4 py-2"
              >
                <span>{trait}</span>
                {/* 실제 점수 계산 필요 */}
                <span className="font-bold">-</span>
              </li>
            ))}
          </ul>
        </div>
        <Button
          size="lg"
          className="mt-4"
          onClick={() => (window.location.href = "/onboarding/seeker/quiz")}
        >
          다시 풀기
        </Button>
      </div>
    </div>
  );
}
