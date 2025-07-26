import { ReactNode } from "react";

interface FormSectionCardProps {
  children: ReactNode;
  className?: string;
}

export function FormSectionCard({ children, className = "" }: FormSectionCardProps) {
  return (
    <div
      className={`bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl shadow-gray-200/40 border border-white/50 p-5 mb-6 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 ${className}`}
    >
      {children}
    </div>
  );
}
