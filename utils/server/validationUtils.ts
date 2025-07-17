import { JobType } from "@/constants/enums";

// 서버에서 사용할 데이터 검증 유틸리티

/**
 * JobType enum 값이 유효한지 검증
 */
export const isValidJobType = (jobType: string): jobType is JobType => {
  return Object.values(JobType).includes(jobType as JobType);
};

/**
 * 이메일 형식 검증
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 전화번호 형식 검증
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

/**
 * 필수 필드 검증
 */
export const validateRequiredFields = (
  data: Record<string, any>,
  requiredFields: string[]
): string[] => {
  const missingFields: string[] = [];

  requiredFields.forEach((field) => {
    if (!data[field] || (typeof data[field] === "string" && data[field].trim() === "")) {
      missingFields.push(field);
    }
  });

  return missingFields;
};

/**
 * 문자열 길이 검증
 */
export const validateStringLength = (value: string, min: number, max: number): boolean => {
  return value.length >= min && value.length <= max;
};

/**
 * 숫자 범위 검증
 */
export const validateNumberRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * 날짜 유효성 검증
 */
export const isValidDate = (date: string | Date): boolean => {
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime());
};

/**
 * URL 형식 검증
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
