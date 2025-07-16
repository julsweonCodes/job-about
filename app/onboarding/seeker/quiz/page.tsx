"use client";
import React, { useState } from "react";
import ProgressBar from "@/components/common/ProgressBar";
import BottomButtons from "@/components/common/BottomButtons";
import { Button } from "@/components/ui/Button";
import { ProfileHeader } from "@/components/common/ProfileHeader";

const questions = [
  {
    question: "You're working a weekend café shift. Which suits you better?",
    options: [
      {
        icon: <span className="text-3xl mb-2">🗣️</span>,
        headline: "I like talking to people!",
        description: "I enjoy communicating with customers while working.",
        value: "talking",
      },
      {
        icon: <span className="text-3xl mb-2">🤫</span>,
        headline: "I prefer quiet tasks!",
        description: "I feel more comfortable working quietly.",
        value: "quiet",
      },
    ],
  },
  {
    question:
      "You're on the closing shift at a retail store like Canadian Tire. The credit card machine suddenly freezes and won't process payments. A customer is waiting, and your manager is on an important call in the back office.",
    options: [
      {
        icon: <span className="text-3xl mb-2">⚡️</span>,
        headline: "직접 해결 시도",
        description: "내 판단으로 먼저 처리해요. (예: 터미널 재부팅)",
        value: "try",
      },
      {
        icon: <span className="text-3xl mb-2">📖</span>,
        headline: "매뉴얼/매니저 기다림",
        description: "매뉴얼을 찾거나 매니저를 기다려요.",
        value: "wait",
      },
    ],
  },
  {
    question:
      "You're working at a popular downtown café like Tim Hortons. It was quiet, but suddenly the lunch crowd rushes in. The line is out the door, online order alerts are pinging nonstop, and your coworker is calling for help from the milk-steaming station.",
    options: [
      {
        icon: <span className="text-3xl mb-2">🔥</span>,
        headline: "에너지가 솟아요!",
        description: "빠르게 움직이며 상황을 해결해요.",
        value: "rush",
      },
      {
        icon: <span className="text-3xl mb-2">🧘‍♂️</span>,
        headline: "차분하게 정리",
        description: "심호흡 후, 하나씩 차근차근 처리해요.",
        value: "calm",
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

  function OptionCard({
    icon,
    headline,
    description,
    selected,
    onClick,
  }: {
    icon: React.ReactNode;
    headline: string;
    description: string;
    selected: boolean;
    onClick: () => void;
  }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`aspect-[3/4] h-full w-full flex flex-col items-center justify-start rounded-2xl px-2 py-6 transition-all duration-200 transition-transform active:scale-95 relative overflow-hidden
          ${selected ? "bg-indigo-500 text-white ring-2 ring-indigo-300" : "bg-white text-gray-400"}`}
      >
        <div className="mb-2">{icon}</div>
        <span
          className={`mb-1 text-[16px] sm:text-[22px] font-bold ${selected ? "text-white" : "text-gray-900"}`}
        >
          {headline}
        </span>
        <span
          className={`text-center text-[14px] sm:text-[16px] font-medium ${selected ? "text-white/80" : "text-gray-500"}`}
        >
          {description}
        </span>
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ProfileHeader />
      <main className="flex-1 flex p-5 md:p-0 md:items-center justify-center">
        <section className="w-full max-w-2xl flex flex-col items-center">
          {/* 진행률 바 */}
          <div className="w-full mb-4 md:mb-6">
            <h1 className="text-center mb-5 text-[22px] sm:text-[28px] font-bold">
              Tell us about yourself
            </h1>
            <ProgressBar value={((step + 1) / totalSteps) * 100} className="mb-4" />
          </div>
          {/* 질문 */}
          <p className="text-center text-[14px] sm:text-[20px] font-normal text-gray-600 mb-8">
            {current.question}
          </p>
          {/* 옵션 */}
          <div className="w-full grid gap-4 grid-cols-2 mb-8 items-stretch">
            {current.options.map((opt) => (
              <OptionCard
                key={opt.value}
                icon={opt.icon}
                headline={opt.headline}
                description={opt.description}
                selected={selected === opt.value}
                onClick={() => setSelected(opt.value)}
              />
            ))}
          </div>
          {/* 데스크탑(즉, md 이상)에서만 보이는 Prev/Next 버튼 */}
          <div className="hidden md:flex gap-2 w-full mt-4">
            {step > 0 && (
              <Button
                className="flex-1"
                size="lg"
                variant="secondary"
                onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
              >
                Prev
              </Button>
            )}
            <Button
              className="flex-1"
              size="lg"
              disabled={!selected}
              onClick={() => {
                setSelected(null);
                setStep((prev) => Math.min(prev + 1, totalSteps - 1));
              }}
            >
              Next
            </Button>
          </div>
        </section>
      </main>

      {/* 모바일 버전 버튼 */}
      <BottomButtons className="block md:hidden">
        {step > 0 && (
          <Button
            className="flex-1"
            size="lg"
            variant="secondary"
            onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
          >
            Prev
          </Button>
        )}
        <Button
          className="flex-1"
          size="lg"
          disabled={!selected}
          onClick={() => {
            setSelected(null);
            setStep((prev) => Math.min(prev + 1, totalSteps - 1));
          }}
        >
          Next
        </Button>
      </BottomButtons>
    </div>
  );
}
