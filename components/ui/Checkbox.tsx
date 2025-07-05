import React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  className?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = "", ...props }, ref) => (
    <label className={`flex items-center gap-2 text-sm font-medium ${className}`}>
      <input
        type="checkbox"
        ref={ref}
        className="accent-indigo-500 w-5 h-5 rounded border-gray-300 focus:ring-2 focus:ring-indigo-400 transition"
        {...props}
      />
      {label}
    </label>
  )
);

Checkbox.displayName = "Checkbox";
export default Checkbox;
