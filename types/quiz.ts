export interface QuizChoice {
  id: string;
  question_id: string;
  label: string;
  content_ko: string;
  content_en: string;
  emoji?: string; // 이모지 필드 추가
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  question_code: string;
  quiz_set_id: string;
  dimension_id: string;
  content_ko: string;
  content_en: string;
  img_url?: string; // 이미지 URL 필드 추가
  created_at: string;
  choices: QuizChoice[];
}

export interface QuizResponse {
  question_code: string;
  choice_label: string;
}

export interface QuizProfile {
  id: string;
  name_ko: string;
  name_en: string;
  description_ko: string;
  description_en: string;
  created_at?: string;
  updated_at?: string;
}

export interface QuizDimension {
  id: string;
  name: string;
  description_ko?: string;
  description_en?: string;
}

export enum QuizLabel {
  A = "A",
  B = "B",
  // 필요시 C, D 등 추가
}

// API 응답 타입들
export interface QuizApiResponse<T> {
  status: "success" | "error";
  code: number;
  message: string;
  data: T | null;
}

export interface QuizSubmissionData {
  userId: string;
  profileId: string;
}

// 퀴즈 분석 결과 타입
export interface QuizAnalysisResult {
  profileType: PersonalityType;
  profileId: number;
  aCount: number;
  bCount: number;
  analysis: {
    isDecisive: boolean; // A>=4 또는 B>=4인 경우
    specialCombination?: "empathetic_coordinator" | "independent_solver"; // 특별한 조합
  };
}

// 5가지 성향 타입
export enum PersonalityType {
  ACTION_HERO = "action_hero",
  STEADY_SPECIALIST = "steady_specialist",
  EMPATHETIC_COORDINATOR = "empathetic_coordinator",
  INDEPENDENT_SOLVER = "independent_solver",
  FLEXIBLE_ALL_ROUNDER = "flexible_all_rounder",
}

// 성향 타입별 정보
export interface PersonalityTypeInfo {
  id: number;
  type: PersonalityType;
  name_ko: string;
  name_en: string;
  description_ko: string;
  description_en: string;
  characteristics: string[];
  recommendedJobs: string[];
}

// 퀴즈 차원 정보 (6가지 질문 영역)
export interface QuizDimensionInfo {
  questionNumber: number;
  dimension: string;
  description_ko: string;
  description_en: string;
  choice_a_meaning: string;
  choice_b_meaning: string;
}

// 퀴즈 진행 상태
export interface QuizProgress {
  currentQuestion: number;
  totalQuestions: number;
  responses: QuizResponse[];
  isCompleted: boolean;
}

// 성향 프로필 매핑 (ID와 타입 연결)
export const PERSONALITY_PROFILE_MAPPING = {
  1: PersonalityType.ACTION_HERO,
  2: PersonalityType.STEADY_SPECIALIST,
  3: PersonalityType.EMPATHETIC_COORDINATOR,
  4: PersonalityType.INDEPENDENT_SOLVER,
  5: PersonalityType.FLEXIBLE_ALL_ROUNDER,
} as const;

// 프로필 ID 타입
export type ProfileId = keyof typeof PERSONALITY_PROFILE_MAPPING;

// 확장된 퀴즈 결과 (상세 정보 포함)
export interface ExtendedQuizResult extends QuizAnalysisResult {
  profile: QuizProfile;
  detailedAnalysis: {
    strengths: string[];
    workStyle: string[];
    idealEnvironment: string[];
    developmentAreas: string[];
  };
}
