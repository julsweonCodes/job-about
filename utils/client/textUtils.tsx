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
