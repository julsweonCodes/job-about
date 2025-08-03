import React from "react";

/**
 * 텍스트의 줄바꿈 문자를 HTML 줄바꿈으로 변환
 */
export const formatDescription = (text: string): React.ReactNode => {
  if (!text) return "";

  return text.split("\\n").map((line, index, array) => (
    <span key={index}>
      {line}
      {index < array.length - 1 && <br />}
    </span>
  ));
};

/**
 * 텍스트의 줄바꿈 문자를 실제 줄바꿈으로 변환 (CSS white-space: pre-line 사용 시)
 */
export const formatDescriptionForPreLine = (text: string): string => {
  if (!text) return "";
  return text.split("\\n").join("\n");
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
