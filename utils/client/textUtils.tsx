import React from "react";

/**
 * 텍스트의 줄바꿈 문자를 HTML 줄바꿈으로 변환
 */
export const formatDescription = (text: string | number | null | undefined): React.ReactNode => {
  if (!text) return "";

  // 숫자나 다른 타입이 들어올 경우 문자열로 변환
  const textString = String(text);

  // API에서 오는 실제 줄바꿈 문자(\n)와 문자열(\n) 모두 처리
  const lines = textString.replace(/\\n/g, "\n").split("\n");

  return lines.map((line, index, array) => (
    <span key={index}>
      {line}
      {index < array.length - 1 && <br />}
    </span>
  ));
};

/**
 * 텍스트의 줄바꿈 문자를 실제 줄바꿈으로 변환 (CSS white-space: pre-line 사용 시)
 */
export const formatDescriptionForPreLine = (text: string | number | null | undefined): string => {
  if (!text) return "";

  // 숫자나 다른 타입이 들어올 경우 문자열로 변환
  const textString = String(text);

  // API에서 오는 실제 줄바꿈 문자(\n)와 문자열(\n) 모두 처리
  return textString.replace(/\\n/g, "\n");
};

/**
 * 텍스트를 안전하게 렌더링 (XSS 방지)
 */
export const sanitizeText = (text: string): string => {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
};

/**
 * 모바일에서 애매한 줄바꿈을 피하기 위해 개행을 공백으로 정규화
 * - API에서 오는 실제(\n) / 문자열("\\n") 모두 처리
 */
export const formatDescriptionForMobile = (text: string | number | null | undefined): string => {
  if (!text) return "";
  const normalized = String(text).replace(/\\n/g, "\n");
  return normalized.replace(/\n+/g, " ");
};

/**
 * 멀티라인 텍스트를 클램프해 렌더링 (기본 3줄)
 * - isMobile 이 true면 개행을 공백으로 치환 + whitespace-normal
 * - 데스크톱은 개행 보존 + whitespace-pre-line
 */
export const renderClampedText = (params: {
  text: string | number | null | undefined;
  isMobile?: boolean;
  lines?: number;
  className?: string;
}): React.ReactNode => {
  const { text, isMobile = false, lines = 3, className = "" } = params;
  const base = String(text ?? "");
  const normalized = base.replace(/\\n/g, "\n");
  const display = isMobile ? normalized.replace(/\n+/g, " ") : normalized;

  return (
    <span
      className={`${isMobile ? "whitespace-normal" : "whitespace-pre-line"} ${className}`}
      style={{
        display: "-webkit-box",
        WebkitLineClamp: lines,
        WebkitBoxOrient: "vertical" as any,
        overflow: "hidden",
      }}
    >
      {display}
    </span>
  );
};
