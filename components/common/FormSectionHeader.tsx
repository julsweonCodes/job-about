import { ReactNode } from "react";
import Typography from "@/components/ui/Typography";

interface FormSectionHeaderProps {
  icon: ReactNode;
  title: string;
  description: string;
  iconColor?:
    | "blue"
    | "green"
    | "orange"
    | "purple"
    | "emerald"
    | "red"
    | "indigo"
    | "teal"
    | "pink";
  className?: string;
}

export function FormSectionHeader({
  icon,
  title,
  description,
  iconColor = "blue",
  className = "",
}: FormSectionHeaderProps) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 shadow-blue-200",
    green: "from-green-500 to-green-600 shadow-green-200",
    orange: "from-orange-500 to-orange-600 shadow-orange-200",
    purple: "from-purple-500 to-purple-600 shadow-purple-200",
    emerald: "from-emerald-500 to-emerald-600 shadow-emerald-200",
    red: "from-red-500 to-red-600 shadow-red-200",
    indigo: "from-indigo-500 to-indigo-600 shadow-indigo-200",
    teal: "from-teal-500 to-teal-600 shadow-teal-200",
    pink: "from-pink-500 to-pink-600 shadow-pink-200",
  };

  return (
    <div className={`mb-6 ${className}`}>
      <div
        className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${colorClasses[iconColor]} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}
      >
        <div className="w-5 h-5 md:w-6 md:h-6 text-white">{icon}</div>
      </div>
      <Typography variant="headlineMd" as="h2" className="mb-2 tracking-tight">
        {title}
      </Typography>
      <Typography variant="bodySm" as="p" className="text-gray-500 text-sm font-medium">
        {description}
      </Typography>
    </div>
  );
}
