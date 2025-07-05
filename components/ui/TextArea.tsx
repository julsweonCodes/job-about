import React from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export default function TextArea({
  label,
  error,
  required,
  value,
  onChange,
  className = "",
  ...props
}: TextAreaProps) {
  return (
    <div className={`w-full mb-2 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:outline-none transition-all duration-300 resize-none ${
          error ? "border-red-400" : ""
        }`}
        {...props}
      />
      {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
    </div>
  );
}
