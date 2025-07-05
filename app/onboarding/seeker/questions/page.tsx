"use client";
import React, { useState } from "react";
import LogoHeader from "@/components/common/LogoHeader";
import Typography from "@/components/ui/Typography";
import ProgressBar from "@/components/common/ProgressBar";
import { Sparkles, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";

const questions = [
  {
    question: "You're working a weekend café shift. Which suits you better?",
    options: [
      {
        icon: <Sparkles className="w-8 h-8 mb-2" />,
        label: "I like talking to people",
        value: "talking",
      },
      {
        icon: <BookOpen className="w-8 h-8 mb-2" />,
        label: "I prefer quiet tasks",
        value: "quiet",
      },
    ],
  },
  // 추가 질문은 여기에 배열로 넣으세요
];

export default function SeekerQuestionsPage() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const totalSteps = questions.length;
  const current = questions[step];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white min-h-screen flex flex-col">
        <LogoHeader borderless shadowless />
        {/* 상단 sticky 진행률 바+단계 안내 */}
        <div className="sticky top-0 z-10 bg-white px-4 pt-4 pb-2 border-b border-gray-100">
          <Typography as="h2" variant="headlineMd" className="text-center mb-2">
            Tell us about yourself
          </Typography>
          <Typography as="p" variant="bodySm" className="text-center text-gray-500 mb-2">
            Step {step + 1} of {totalSteps}
          </Typography>
          <ProgressBar value={((step + 1) / totalSteps) * 100} className="mb-0" />
        </div>
        {/* 스크롤 영역 */}
        <div className="flex-1 flex flex-col px-4 py-8 overflow-y-auto">
          <Typography as="h3" variant="titleBold" className="text-center mb-8">
            {current.question}
          </Typography>
          <div className="flex gap-4 mb-8">
            {current.options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelected(opt.value)}
                className={`flex-1 flex flex-col items-center justify-center rounded-2xl px-2 py-6 transition-all duration-200
                  ${selected === opt.value ? "bg-indigo-500 text-white shadow-lg" : "bg-gray-100 text-gray-400"}`}
              >
                {opt.icon}
                <Typography
                  as="span"
                  variant="bodyMd"
                  className={`font-semibold text-center ${selected === opt.value ? "text-white" : "text-gray-500"}`}
                >
                  {opt.label}
                </Typography>
              </button>
            ))}
          </div>
        </div>
        {/* 하단 sticky Next 버튼 */}
        <div className="sticky bottom-0 z-10 bg-white px-4 pb-6 pt-2 border-t border-gray-100">
          <Button
            size="lg"
            className="w-full"
            disabled={!selected}
            onClick={() => {
              setSelected(null);
              setStep((prev) => Math.min(prev + 1, totalSteps - 1));
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
