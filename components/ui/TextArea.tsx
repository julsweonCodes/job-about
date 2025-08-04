import React from "react";
import Typography from "./Typography";

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
        <Typography as="label" variant="bodySm" className="block font-semibold text-gray-700 mb-2">
          {label}{" "}
          {required && (
            <Typography as="span" variant="bodySm" className="text-red-500">
              *
            </Typography>
          )}
        </Typography>
      )}
      <textarea
        value={value}
        onChange={onChange}
        className={`input-style resize-none scrollbar-hide ${error ? "border-red-400 " : ""} ${className}`}
        {...props}
      />
      {error && <div className="text-sm sm:text-base text-red-500 mt-1">{error}</div>}
    </div>
  );
}
