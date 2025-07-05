import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  rightIcon?: React.ReactNode;
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
  ...props
}: InputProps) {
  // phone formatting
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (type === "phone") {
      val = val.replace(/[^0-9]/g, "");
      if (val.length < 4) val = val;
      else if (val.length < 7) val = val.replace(/(\d{3})(\d{1,3})/, "$1-$2");
      else val = val.replace(/(\d{3})(\d{3,4})(\d{1,4})/, "$1-$2-$3");
    }
    if (onChange) onChange({ ...e, target: { ...e.target, value: val } });
  };

  return (
    <div className={`w-full mb-2 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {rightIcon ? (
        <div className="flex items-center relative w-full">
          <input
            type={type === "phone" ? "text" : type}
            value={value}
            onChange={handleChange}
            className={`input-style ${rightIcon ? "pr-10" : ""} ${error ? "border-red-400" : ""}`}
            {...(type === "time" ? { min: "00:00", max: "23:59", step: 60 } : {})}
            {...props}
          />
          <span className="flex items-center h-full ml-[-2.5rem] text-gray-400">{rightIcon}</span>
        </div>
      ) : (
        <input
          type={type === "phone" ? "text" : type}
          value={value}
          onChange={handleChange}
          className={`input-style ${error ? "border-red-400" : ""}`}
          {...(type === "time" ? { min: "00:00", max: "23:59", step: 60 } : {})}
          {...props}
        />
      )}
      {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
    </div>
  );
}
