"use client";

// 클라이언트 전용 폼 유틸리티

/**
 * 폼 데이터를 FormData 객체로 변환
 */
export const createFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((item) => formData.append(key, item));
      } else {
        formData.append(key, String(value));
      }
    }
  });

  return formData;
};

/**
 * 폼 데이터를 JSON으로 변환
 */
export const createJsonData = (data: Record<string, any>): string => {
  return JSON.stringify(data);
};

/**
 * 폼 유효성 검사
 */
export const validateForm = (
  data: Record<string, any>,
  rules: Record<string, any>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  Object.entries(rules).forEach(([field, rule]) => {
    const value = data[field];

    // 필수 필드 검사
    if (rule.required && (!value || (typeof value === "string" && value.trim() === ""))) {
      errors[field] = rule.message || `${field} is required`;
      return;
    }

    // 최소 길이 검사
    if (rule.minLength && typeof value === "string" && value.length < rule.minLength) {
      errors[field] = rule.message || `${field} must be at least ${rule.minLength} characters`;
      return;
    }

    // 최대 길이 검사
    if (rule.maxLength && typeof value === "string" && value.length > rule.maxLength) {
      errors[field] = rule.message || `${field} must be at most ${rule.maxLength} characters`;
      return;
    }

    // 패턴 검사
    if (rule.pattern && typeof value === "string" && !rule.pattern.test(value)) {
      errors[field] = rule.message || `${field} format is invalid`;
      return;
    }
  });

  return errors;
};

/**
 * 폼 필드 포커스
 */
export const focusFormField = (fieldName: string): void => {
  const element = document.querySelector(`[name="${fieldName}"]`) as HTMLElement;
  if (element) {
    element.focus();
  }
};

/**
 * 폼 리셋
 */
export const resetForm = (formRef: React.RefObject<HTMLFormElement>): void => {
  if (formRef.current) {
    formRef.current.reset();
  }
};

/**
 * 폼 데이터 디바운스
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
