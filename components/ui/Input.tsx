import React, { useState } from "react";
import Typography from "./Typography";
import { X } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  rightIcon?: React.ReactNode;
  showClearButton?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

export default function Input({
  label,
  error,
  required,
  type = "text",
  value,
  onChange,
  className = "",
  rightIcon,
  showClearButton = true,
  onValidationChange,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  // 유효성 검사 함수
  const validateInput = (val: string): boolean => {
    if (type === "phone") {
      const digits = val.replace(/[^0-9]/g, "");
      return digits.length === 10 || digits.length === 11;
    }
    if (required) {
      return val.trim().length > 0;
    }
    return true;
  };

  // 유효성 상태 업데이트
  React.useEffect(() => {
    if (onValidationChange) {
      const isValid = validateInput(String(value || ""));
      onValidationChange(isValid);
    }
  }, [value, type, required, onValidationChange]);

  // phone formatting for US/Canada format: (555) 123-4567
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (type === "phone") {
      val = val.replace(/[^0-9]/g, "");
      if (val.length === 0) val = "";
      else if (val.length <= 3) val = `(${val}`;
      else if (val.length <= 6) val = `(${val.slice(0, 3)}) ${val.slice(3)}`;
      else val = `(${val.slice(0, 3)}) ${val.slice(3, 6)}-${val.slice(6, 10)}`;
    }
    if (onChange) onChange({ ...e, target: { ...e.target, value: val } });
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (props.onBlur) props.onBlur(e);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onChange) {
      // phone 타입인 경우 포맷팅 적용
      let val = "";
      if (type === "phone") {
        val = "";
      } else {
        val = "";
      }

      // handleChange와 동일한 방식으로 이벤트 생성
      const syntheticEvent = {
        target: { value: val },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange(syntheticEvent);
    }
  };

  return (
    <div className={`w-full mb-2 ${className}`}>
      {label && (
        <Typography as="label" variant="bodySm" className="block font-semibold text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </Typography>
      )}
      {rightIcon ? (
        <div className="flex items-center relative w-full">
          <input
            type={type === "phone" ? "text" : type}
            value={value || ""}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`input-style ${rightIcon ? "pr-10" : ""} ${error ? "border-red-400" : ""} ${className}`}
            {...(type === "time" ? { min: "00:00", max: "23:59", step: 60 } : {})}
            {...props}
          />
          <span className="flex items-center h-full ml-[-2.5rem] text-gray-400">{rightIcon}</span>
        </div>
      ) : (
        <div className="relative w-full">
          <input
            type={type === "phone" ? "text" : type}
            value={value || ""}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`input-style ${error ? "border-red-400" : ""} ${className}`}
            {...(type === "time" ? { min: "00:00", max: "23:59", step: 60 } : {})}
            {...props}
          />
          {showClearButton && isFocused && value && value.toString().length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors z-10"
            >
              <X size={16} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      )}
      {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
    </div>
  );
}
