import { QuizResponse, PersonalityType, QuizAnalysisResult } from "@/types/quiz";

/**
 * 퀴즈 응답을 분석하여 성향 프로필 ID를 결정하는 함수
 * @param {QuizResponse[]} responses - 사용자의 퀴즈 응답 배열
 * @returns {number} 결정된 성향 프로필 ID
 */
export function determineProfileId(responses: QuizResponse[]): number {
  console.log("퀴즈 응답 분석 시작:", responses);
  
  // 응답을 A/B로 분류
  const choices = responses.map(response => response.choice_label);
  const aCount = choices.filter(choice => choice === 'A').length;
  const bCount = choices.filter(choice => choice === 'B').length;
  
  console.log(`A 응답 개수: ${aCount}, B 응답 개수: ${bCount}`);
  
  // 1. 한쪽 성향이 명확할 때 (A 또는 B가 4개 이상)
  if (aCount >= 4) {
    console.log("액션 히어로 프로필로 판정");
    return 1; // 액션 히어로
  }
  
  if (bCount >= 4) {
    console.log("안정적인 전문가 프로필로 판정");
    return 2; // 안정적인 전문가
  }
  
  // 2. 성향이 혼합되었을 때 (A와 B가 각각 3개)
  if (aCount === 3 && bCount === 3) {
    console.log("혼합 성향 분석 시작");
    
    // 응답을 질문별로 매핑
    const responseMap: Record<string, string> = {};
    responses.forEach(response => {
      const questionNum = response.question_code.substring(1, 2); // Q1 -> 1
      responseMap[questionNum] = response.choice_label;
    });
    
    console.log("질문별 응답 매핑:", responseMap);
    
    // 공감형 코디네이터 판정: Q4(대인)=A && Q6(고객)=A
    if (responseMap['4'] === 'A' && responseMap['6'] === 'A') {
      console.log("공감형 코디네이터 프로필로 판정 (Q4=A, Q6=A)");
      return 3; // 공감형 코디네이터
    }
    
    // 독립적인 해결사 판정: Q2(해결)=A && Q4(대인)=B
    if (responseMap['2'] === 'A' && responseMap['4'] === 'B') {
      console.log("독립적인 해결사 프로필로 판정 (Q2=A, Q4=B)");
      return 4; // 독립적인 해결사
    }
    
    // 위 조건에 해당하지 않는 모든 3A/3B 조합
    console.log("유연한 만능형 프로필로 판정");
    return 5; // 유연한 만능형
  }
  
  // 예외 상황 (이론상 발생하지 않음)
  console.log("예외 상황 - 기본값으로 유연한 만능형 반환");
  return 5; // 유연한 만능형
}

/**
 * 응답 데이터 유효성 검사
 * @param {QuizResponse[]} responses - 검사할 응답 배열
 * @returns {boolean} 유효성 여부
 */
export function validateQuizResponses(responses: QuizResponse[]): boolean {
  console.log("퀴즈 응답 유효성 검사 시작");
  
  // 기본 길이 체크 (6문항)
  if (!responses || responses.length !== 6) {
    console.error(`응답 개수 오류: 예상 6개, 실제 ${responses?.length || 0}개`);
    return false;
  }
  
  // 각 응답 형식 체크
  for (const response of responses) {
    if (!response.question_code || !response.choice_label) {
      console.error("응답 형식 오류:", response);
      return false;
    }
    
    if (!['A', 'B'].includes(response.choice_label)) {
      console.error(`선택지 라벨 오류: ${response.choice_label}`);
      return false;
    }
  }
  
  // 필수 질문 체크 (Q1~Q6이 모두 있어야 함)
  const questionNumbers = new Set();
  responses.forEach(response => {
    const questionNum = response.question_code.substring(1, 2); // Q1 -> 1
    questionNumbers.add(questionNum);
  });
  
  const requiredQuestions = ['1', '2', '3', '4', '5', '6'];
  for (const required of requiredQuestions) {
    if (!questionNumbers.has(required)) {
      console.error(`필수 질문 누락: Q${required}`);
      return false;
    }
  }
  
  console.log("퀴즈 응답 유효성 검사 통과");
  return true;
}

/**
 * 프로필 ID에 따른 성향 타입 이름 반환
 * @param {number} profileId - 프로필 ID
 * @returns {string} 성향 타입 이름
 */
export function getProfileTypeName(profileId: number): string {
  const profileNames: Record<number, string> = {
    1: "액션 히어로",
    2: "안정적인 전문가", 
    3: "공감형 코디네이터",
    4: "독립적인 해결사",
    5: "유연한 만능형"
  };
  
  return profileNames[profileId] || "알 수 없는 유형";
}

/**
 * 프로필 ID에 따른 PersonalityType enum 반환
 * @param {number} profileId - 프로필 ID
 * @returns {PersonalityType} 성향 타입 enum
 */
export function getPersonalityType(profileId: number): PersonalityType {
  const typeMapping: Record<number, PersonalityType> = {
    1: PersonalityType.ACTION_HERO,
    2: PersonalityType.STEADY_SPECIALIST,
    3: PersonalityType.EMPATHETIC_COORDINATOR,
    4: PersonalityType.INDEPENDENT_SOLVER,
    5: PersonalityType.FLEXIBLE_ALL_ROUNDER
  };
  
  return typeMapping[profileId] || PersonalityType.FLEXIBLE_ALL_ROUNDER;
}

/**
 * 상세한 퀴즈 분석 결과 반환
 * @param {QuizResponse[]} responses - 사용자의 퀴즈 응답 배열
 * @returns {QuizAnalysisResult} 상세한 분석 결과
 */
export function analyzeQuizDetailed(responses: QuizResponse[]): QuizAnalysisResult {
  console.log("상세 퀴즈 분석 시작:", responses);
  
  const choices = responses.map(response => response.choice_label);
  const aCount = choices.filter(choice => choice === 'A').length;
  const bCount = choices.filter(choice => choice === 'B').length;
  
  const profileId = determineProfileId(responses);
  const profileType = getPersonalityType(profileId);
  
  // 응답을 질문별로 매핑
  const responseMap: Record<string, string> = {};
  responses.forEach(response => {
    const questionNum = response.question_code.substring(1, 2);
    responseMap[questionNum] = response.choice_label;
  });
  
  // 분석 정보 구성
  const isDecisive = aCount >= 4 || bCount >= 4;
  let specialCombination: 'empathetic_coordinator' | 'independent_solver' | undefined;
  
  if (aCount === 3 && bCount === 3) {
    if (responseMap['4'] === 'A' && responseMap['6'] === 'A') {
      specialCombination = 'empathetic_coordinator';
    } else if (responseMap['2'] === 'A' && responseMap['4'] === 'B') {
      specialCombination = 'independent_solver';
    }
  }
  
  const result: QuizAnalysisResult = {
    profileType,
    profileId,
    aCount,
    bCount,
    analysis: {
      isDecisive,
      specialCombination
    }
  };
  
  console.log("상세 분석 결과:", result);
  return result;
}