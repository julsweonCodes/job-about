"use client";
import React, { useState } from "react";
import LogoHeader from "@/components/common/LogoHeader";
import Typography from "@/components/ui/Typography";
import ProgressBar from "@/components/common/ProgressBar";
import { Sparkles, BookOpen } from "lucide-react";
import BottomButton from "@/components/common/BottomButton";
import { Button } from "@/components/ui/Button";

const questions = [
  {
    question:
      "You're working at a popular downtown café like Tim Hortons. It was quiet, but suddenly the lunch crowd rushes in. The line is out the door, online order alerts are pinging nonstop, and your coworker is calling for help from the milk-steaming station.",
    options: [
      {
        icon: <Sparkles className="w-8 h-8 mb-2" />,
        label:
          "I feel a rush of adrenaline! I get energized by moving quickly and resolving the situation",
        value: "talking",
      },
      {
        icon: <BookOpen className="w-8 h-8 mb-2" />,
        label:
          " I'll take a deep breath first, and then tackle the most important tasks systematically, one by one.",
        value: "quiet",
      },
    ],
  },
  {
    question:
      "You're on the closing shift at a retail store like Canadian Tire. The credit card machine suddenly freezes and won't process payments. A customer is waiting, and your manager is on an important call in the back office.",
    options: [
      {
        icon: <Sparkles className="w-8 h-8 mb-2" />,
        label:
          "I'll first try to solve it based on my own judgment, like rebooting the terminal. It's more efficient.",
        value: "talking",
      },
      {
        icon: <BookOpen className="w-8 h-8 mb-2" />,
        label:
          "I'll look for the manual or ask the customer for a moment of patience and wait until my manager finishes the call.",
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

  function OptionCard({
    icon,
    label,
    selected,
    onClick,
  }: {
    icon: React.ReactNode;
    label: string;
    selected: boolean;
    onClick: () => void;
  }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`aspect-square h-full w-full flex flex-col items-center justify-center rounded-2xl px-2 py-6 transition-all duration-200 transition-transform active:scale-95 relative
          ${selected ? "bg-indigo-500 text-white ring-2 ring-indigo-300" : "bg-gray-100 text-gray-400"}`}
      >
        {icon}
        <Typography
          as="span"
          variant="bodyLg"
          className={`text-center ${selected ? "text-white" : "text-gray-500"}`}
        >
          {label}
        </Typography>
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-6xl min-h-screen bg-white flex flex-col">
        <LogoHeader />
        <main className="flex sm:flex-1 flex-col items-center justify-center">
          <section className="w-full max-w-2xl bg-white rounded-xl p-5 flex flex-col items-center">
            {/* 진행률 바 */}
            <div className="w-full mb-6">
              <Typography as="h1" variant="headlineMd" className="text-center mb-5 md:text-3xl">
                Tell us about yourself
              </Typography>
              <ProgressBar value={((step + 1) / totalSteps) * 100} className="mb-4" />
            </div>
            {/* 질문 */}
            <Typography as="h3" variant="bodyLg" className="text-center mb-8">
              {current.question}
            </Typography>
            {/* 옵션 */}
            <div className="w-full grid gap-4 grid-cols-2 mb-8 items-stretch">
              {current.options.map((opt) => (
                <OptionCard
                  key={opt.value}
                  icon={opt.icon}
                  label={opt.label}
                  selected={selected === opt.value}
                  onClick={() => setSelected(opt.value)}
                />
              ))}
            </div>
            <Button
              type="button"
              size="lg"
              className="shadow-md hidden md:block"
              disabled={!selected}
              onClick={() => {
                setSelected(null);
                setStep((prev) => Math.min(prev + 1, totalSteps - 1));
              }}
            >
              Next
            </Button>
          </section>
        </main>
        <div className="block md:hidden">
          <BottomButton
            className=""
            size="lg"
            disabled={!selected}
            onClick={() => {
              setSelected(null);
              setStep((prev) => Math.min(prev + 1, totalSteps - 1));
            }}
          >
            Next
          </BottomButton>
        </div>
      </div>
    </div>
  );
}
