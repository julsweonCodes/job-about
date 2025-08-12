"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import ProgressHeader from "@/components/common/ProgressHeader";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/common/LoadingScreen";
import { showErrorToast } from "@/utils/client/toastUtils";
import { PAGE_URLS } from "@/constants/api";
import { formatDescriptionForPreLine } from "@/utils/client/textUtils";

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
  emoji: string;
}

export interface Question {
  id: number;
  question_code: string;
  dimension: string;
  is_core: boolean;
  status: string;
  content: {
    ko: string;
    en: string;
  };
  img_url: string;
  choices: QuestionChoice[];
}

// 질문 데이터는 API에서 가져올 예정

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
          <span className="text-sm md:text-2xl">{choice.emoji}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold text-sm sm:text-lg mb-2 transition-colors ${
              selected ? "text-blue-700" : "text-gray-800 group-hover:text-blue-600"
            }`}
          >
            {choice.title.en}
          </h3>
          <p className="text-gray-700 leading-relaxed text-sm md:text-lg group-hover:text-gray-900 transition-colors">
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
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  // API에서 퀴즈 질문 가져오기
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        console.log("퀴즈 질문 로딩 시작");
        const response = await fetch("/api/quiz");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("퀴즈 질문 로딩 완료:", data);

        if (data.status === "success" && data.data) {
          setQuestions(data.data);
        } else {
          throw new Error(data.message || "퀴즈 질문을 불러오는데 실패했습니다.");
        }
      } catch (error) {
        console.error("퀴즈 질문 로딩 실패:", error);
        setError(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (isComplete && questions.length > 0) {
      // 퀴즈 답변 제출
      const submitQuiz = async () => {
        try {
          console.log("퀴즈 답변 제출 시작");
          const responses = questions.map((q) => ({
            questionId: q.id,
            answer: answers[q.question_code] === "A" ? 1 : 2,
          }));

          console.log("제출할 응답 데이터:", responses);

          const response = await fetch("/api/quiz", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ responses }),
          });

          const data = await response.json();
          console.log("퀴즈 제출 응답:", data);

          if (data.status === "success") {
            // 성공적으로 제출되면 결과 페이지로 이동
            console.log("퀴즈 제출 성공, 결과 페이지로 이동 중...");
            if (typeof window !== "undefined") {
              sessionStorage.setItem("quizSubmitted", "true");
              sessionStorage.setItem("profileId", data.data.profileId);
              console.log("세션 스토리지에 데이터 저장 완료:", {
                quizSubmitted: "true",
                profileId: data.data.profileId,
              });
            }
            console.log("라우터로 결과 페이지 이동:", PAGE_URLS.ONBOARDING.SEEKER.QUIZ_RESULT);
            router.push(PAGE_URLS.ONBOARDING.SEEKER.QUIZ_RESULT);
          } else {
            console.error("퀴즈 제출 실패:", data.message);
            showErrorToast(data.message || "Failed to submit quiz");
          }
        } catch (error) {
          console.error("퀴즈 제출 중 오류:", error);
          showErrorToast("Failed to submit quiz");
        }
      };

      submitQuiz();
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

  // 로딩 상태
  if (loading) {
    return <LoadingScreen message="Loading quiz questions..." />;
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to load quiz questions
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg"
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  // 질문이 없는 경우
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No quiz questions found.</p>
        </div>
      </div>
    );
  }

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
            {/* 질문별   시각적 요소 */}
            <div className="w-full aspect-[16/9] bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
              <img
                src={question.img_url}
                alt="Question Image"
                className="w-full h-full object-cover"
              />
            </div>
            <blockquote className="text-gray-700 leading-relaxed text-sm sm:text-xl font-medium italic whitespace-pre-line">
              "{formatDescriptionForPreLine(question.content.en)}"
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
