"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Check, Target, Zap, Heart, Award } from "lucide-react";
import ProgressHeader from "@/components/common/ProgressHeader";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export interface QuestionChoice {
  label: "A" | "B";
  title: {
    ko: string;
    en: string;
  };
  content: {
    ko: string;
    en: string;
  };
  imogi: string;
}

export interface Question {
  question_code: string;
  dimension: string;
  is_core: boolean;
  status: string;
  content: {
    ko: string;
    en: string;
  };
  choices: QuestionChoice[];
}

const questions: Question[] = [
  {
    question_code: "A01",
    dimension: "Work Pace",
    is_core: true,
    status: "active",
    content: {
      ko: "당신은 다운타운의 인기 카페 '팀홀튼(Tim Hortons)'에서 일하고 있습니다. 한가하던 매장에 갑자기 점심시간 직장인들이 몰려들기 시작합니다. 주문 줄은 문 밖까지 이어지고, 모바일 주문 알림이 쉴 새 없이 울리며, 동료는 우유 스팀을 만들며 도와달라고 외치고 있습니다.",
      en: "You're working at a popular downtown café like Tim Hortons. It was quiet, but suddenly the lunch crowd rushes in. The line is out the door, online order alerts are pinging nonstop, and your coworker is calling for help from the milk-steaming station.",
    },
    choices: [
      {
        label: "A",
        content: {
          ko: "아드레날린이 솟는 기분이야! 바쁘게 움직이며 상황을 해결하는 데서 활력을 얻어.",
          en: "I feel a rush of adrenaline! I get energized by moving quickly and resolving the situation.",
        },
        title: {
          ko: "빠른 대응",
          en: "Fast-Paced",
        },
        imogi: "⚡",
      },
      {
        label: "B",
        content: {
          ko: "일단 심호흡을 하고, 가장 중요한 일부터 차근차근 순서대로 처리해 나갈 거야.",
          en: "I'll take a deep breath first, and then tackle the most important tasks systematically, one by one.",
        },
        title: {
          ko: "신중한 처리",
          en: "Calm Approach",
        },
        imogi: "🧘",
      },
    ],
  },
  {
    question_code: "A02",
    dimension: "Problem-Solving",
    is_core: true,
    status: "active",
    content: {
      ko: "당신은 '캐네디언 타이어(Canadian Tire)'와 같은 리테일 스토어에서 마감 조로 일하고 있습니다. 갑자기 신용카드 단말기가 멈추며 결제가 되지 않습니다. 고객은 바로 앞에 서서 기다리고 있고, 매니저는 사무실에서 중요한 통화 중입니다.",
      en: "You're on the closing shift at a retail store like Canadian Tire. The credit card machine suddenly freezes and won't process payments. A customer is waiting, and your manager is on an important call in the back office.",
    },
    choices: [
      {
        label: "A",
        content: {
          ko: "우선 내 판단에 따라 단말기를 재부팅하는 등 해결을 시도해 보겠어. 이게 더 효율적이야.",
          en: "I'll first try to solve it based on my own judgment, like rebooting the terminal. It's more efficient.",
        },
        title: {
          ko: "즉각 해결",
          en: "Quick Fix",
        },
        imogi: "💨",
      },
      {
        label: "B",
        content: {
          ko: "매뉴얼을 찾아보거나, 잠시 고객에게 양해를 구하고 매니저의 통화가 끝날 때까지 기다릴 거야.",
          en: "I'll look for the manual or ask the customer for a moment of patience and wait until my manager finishes the call.",
        },
        title: {
          ko: "절차 중시",
          en: "Quick Fix",
        },
        imogi: "⚡",
      },
    ],
  },
  {
    question_code: "A03",
    dimension: "Work Focus",
    is_core: true,
    status: "active",
    content: {
      ko: "당신은 'H&M'이나 'Zara' 같은 의류 매장에서 일하고 있습니다. 오늘 당신의 할 일 목록에는 1) 창고에서 새 옷 상자 풀기, 2) 손님들이 헝클어 놓은 판매대 정리하기, 3) 도움이 필요한 고객 응대하기, 세 가지가 있습니다. 당신은 어떻게 하루 업무를 처리하겠습니까?",
      en: "You're working at a clothing store like H&M or Zara. Your to-do list for today includes: 1) Unpacking a new box of inventory in the backroom, 2) Tidying up the messy sales floor, and 3) Assisting any customers who need help. How do you approach your day?",
    },
    choices: [
      {
        label: "A",
        content: {
          ko: "고객 응대를 하면서 틈틈이 매대를 정리하고, 손님이 없을 때 창고 일을 하는 식으로 동시에 진행할 거야.",
          en: "I'll handle all tasks simultaneously: assisting customers, tidying the sales floor in between, and working in the backroom when it's quiet.",
        },
        title: {
          ko: "멀티태스킹",
          en: "Multitasker",
        },
        imogi: "🔄",
      },
      {
        label: "B",
        content: {
          ko: "일단 창고 정리를 완벽하게 끝내서 공간을 확보한 뒤, 매장으로 나와 다른 업무를 시작할 거야.",
          en: "I'll finish the backroom task completely first to clear the space, then I'll come out to the sales floor to start on the other tasks.",
        },
        title: {
          ko: "단계적 접근",
          en: "Option",
        },
        imogi: "🪜",
      },
    ],
  },
  {
    question_code: "A04",
    dimension: "Interpersonal Style",
    is_core: true,
    status: "active",
    content: {
      ko: "매장에서 대대적인 'Back to School' 프로모션을 시작하게 되어, 팀원들과 함께 매장 입구의 메인 디스플레이를 오늘 안에 완전히 새롭게 바꿔야 합니다. 당신이 선호하는 방식은?",
      en: "The store is launching a big 'Back to School' promotion, and your team's task is to completely redesign the main entrance display by the end of the day. What's your preferred way to work?",
    },
    choices: [
      {
        label: "A",
        content: {
          ko: "다 같이 모여 '어떤 컨셉이 좋을까?' 브레인스토밍을 하고, 함께 물건을 나르고 배치하며 완성하고 싶어.",
          en: "I want to get everyone together to brainstorm concepts, then move and arrange items together to complete the display as a group.",
        },
        title: {
          ko: "팀워크",
          en: "Team-Oriented",
        },
        imogi: "🤝",
      },
      {
        label: "B",
        content: {
          ko: "리더가 컨셉을 정해주면, '너는 포스터, 나는 상품 진열' 이런 식으로 각자 역할을 나눠서 효율적으로 끝내고 싶어.",
          en: "Once a leader sets the concept, I prefer to divide the tasks clearly—like 'you do the posters, I'll arrange the products'—to finish efficiently.",
        },
        title: {
          ko: "즉각 해결",
          en: "Task Divider",
        },
        imogi: "👬",
      },
    ],
  },
  {
    question_code: "A05",
    dimension: "Learning Style",
    is_core: true,
    status: "active",
    content: {
      ko: "당신은 물류 창고에서 일하게 되었습니다. 오늘 처음으로 '제브라 스캐너(Zebra Scanner)'라는 재고 관리용 휴대 단말기 사용법을 배워야 합니다. 트레이너가 당신에게 어떻게 배우고 싶은지 묻습니다. 당신의 선택은?",
      en: "You've started a job at a warehouse. Today, you need to learn how to use a handheld inventory device called a 'Zebra Scanner.' The trainer asks how you'd like to learn. What's your choice?",
    },
    choices: [
      {
        label: "A",
        content: {
          ko: "일단 제 손에 쥐여주세요. 직접 스캔하고 버튼을 눌러보면서 몸으로 익히는 게 빨라요.",
          en: "Just hand it to me. I learn fastest by doing—scanning items and pressing buttons myself.",
        },
        title: {
          ko: "직접 실습",
          en: "Option",
        },
        imogi: "🛠️",
      },
      {
        label: "B",
        content: {
          ko: "먼저 시범을 보여주시겠어요? 어떻게 작동하는지 충분히 보고 순서를 익힌 다음에 해보고 싶어요.",
          en: "Could you show me a demonstration first? I'd like to watch how it works and understand the steps before trying it myself.",
        },
        title: {
          ko: "시범 우선",
          en: "Option",
        },
        imogi: "🧪",
      },
    ],
  },
  {
    question_code: "A06",
    dimension: "Customer Handling",
    is_core: true,
    status: "active",
    content: {
      ko: "당신은 '샤퍼스 드럭 마트(Shoppers Drug Mart)'에서 일하고 있습니다. 한 고객이 화난 표정으로 다가와 어제 산 화장품에 문제가 있다며 환불을 강력하게 요구합니다. 하지만 영수증은 가지고 있지 않은 상황입니다.",
      en: "You're working at Shoppers Drug Mart. An upset customer approaches you, demanding a refund for a cosmetic product they bought yesterday, claiming it's defective. However, they don't have the receipt.",
    },
    choices: [
      {
        label: "A",
        content: {
          ko: "우선 고객의 말을 끝까지 들어주며 불편에 공감하고, 도울 방법을 함께 찾아보겠다고 안심시킬 거야.",
          en: "First, I'll listen to the customer's full story, empathize with their frustration, and reassure them that I'll find a way to help.",
        },
        title: {
          ko: "팀워크",
          en: "Empathetic",
        },
        imogi: "👬",
      },
      {
        label: "B",
        content: {
          ko: "침착하게 영수증이 없을 경우의 환불 규정을 설명하고, 규정 내에서 처리하기 위해 매니저에게 바로 문의할 거야.",
          en: "I'll calmly explain the store's return policy regarding receipts and immediately consult my manager to handle the exception by the book.",
        },
        title: {
          ko: "규정 기반",
          en: "Rule-Based",
        },
        imogi: "🧩",
      },
    ],
  },
];

function QuizChoiceCard({
  choice,
  selected,
  onSelect,
}: {
  choice: QuestionChoice;
  selected: boolean;
  onSelect: (label: "A" | "B") => void;
}) {
  return (
    <button
      onClick={() => onSelect(choice.label)}
      className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 text-left transition-all duration-300 transform hover:scale-[1.02] border ${
        selected
          ? "ring-2 ring-blue-500 shadow-xl shadow-blue-100/50 border-blue-200 bg-white"
          : "shadow-lg hover:shadow-2xl border-gray-100/50 hover:border-gray-200"
      }`}
    >
      <div className="flex items-start space-x-4">
        <div
          className={`flex-shrink-0 w-10 h-10 md:w-14 md:h-14 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300 ${
            selected
              ? "bg-blue-500 text-white shadow-lg"
              : "bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600"
          }`}
        >
          <span className="text-sm md:text-2xl">{choice.imogi}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold text-sm md:text-lg mb-2 transition-colors ${
              selected ? "text-blue-700" : "text-gray-800 group-hover:text-blue-600"
            }`}
          >
            {choice.title.en}
          </h3>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base group-hover:text-gray-900 transition-colors">
            {choice.content.en}
          </p>
        </div>
      </div>

      <div
        className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
          selected
            ? "bg-blue-500 text-white scale-100"
            : "bg-gray-200 text-gray-400 scale-0 group-hover:scale-100"
        }`}
      >
        {selected ? (
          <Check className="w-4 h-4 md:w-5 md:h-5" />
        ) : (
          <span className="font-bold text-xs md:text-sm">{choice.label}</span>
        )}
      </div>

      {/* Subtle gradient overlay on hover */}
      <div
        className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
          selected
            ? `bg-gradient-to-r from-blue-500 to-indigo-500 opacity-5`
            : "opacity-0 group-hover:opacity-5 bg-gradient-to-r from-blue-500 to-indigo-600"
        }`}
      />
    </button>
  );
}

function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, "A" | "B">>({});
  const [selectedChoice, setSelectedChoice] = useState<"A" | "B" | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);
  const router = useRouter();

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressWidth(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  useEffect(() => {
    if (isComplete) {
      const responses = questions.map((q) => ({
        question_code: q.question_code,
        choice_label: answers[q.question_code],
      }));
      if (typeof window !== "undefined") {
        sessionStorage.setItem("quizResponses", JSON.stringify(responses));
      }
      router.push("/onboarding/seeker/quiz/result");
    }
  }, [isComplete, router, questions, answers]);

  const handleChoiceSelect = (choiceId: "A" | "B") => {
    setSelectedChoice(choiceId);
    setAnswers((prev) => ({
      ...prev,
      [questions[currentQuestion].question_code]: choiceId,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedChoice(answers[questions[currentQuestion + 1]?.question_code] || null);
    } else {
      setIsComplete(true);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setSelectedChoice(answers[questions[currentQuestion - 1].question_code] || null);
    }
  };

  const canProceed = selectedChoice !== null;

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
      {/* Progress Bar */}
      <ProgressHeader
        completionPercentage={progress}
        title={`Question ${currentQuestion + 1} of ${questions.length}`}
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-5 py-8 md:py-12">
        {/* Question Block */}
        <div className="mb-8">
          <div
            className={`bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-white/50 backdrop-blur-sm aspect-[4/3] flex flex-col items-center gap-4 md:gap-8`}
          >
            {/* 일러스트 */}
            <img
              src="/images/img-quiz-ex1.png"
              alt="Quiz Illustration"
              className="w-full object-cover rounded-2xl aspect-[16/9] "
            />
            <blockquote className="text-gray-700 leading-relaxed text-sm md:text-lg font-medium italic">
              "{question.content.en}"
            </blockquote>
          </div>
        </div>

        {/* Choice Cards */}
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          {question.choices.map((choice) => (
            <QuizChoiceCard
              key={choice.label}
              choice={choice}
              selected={selectedChoice === choice.label}
              onSelect={handleChoiceSelect}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-5 justify-between">
          <Button
            onClick={handleBack}
            disabled={currentQuestion === 0}
            variant="outline"
            size="lg"
            className={`transition-all duration-200 transform hover:scale-105 ${
              currentQuestion === 0
                ? "text-gray-400 cursor-not-allowed bg-gray-100/50"
                : "text-gray-600 hover:text-gray-900 hover:shadow-md backdrop-blur-sm"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed}
            variant="default"
            size="lg"
            className={`transition-all duration-200 transform ${
              canProceed
                ? "hover:from-blue-600 hover:to-indigo-700 hover:scale-105 shadow-lg hover:shadow-xl backdrop-blur-sm"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <span>{currentQuestion === questions.length - 1 ? "See Results" : "Next"}</span>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default QuizPage;
