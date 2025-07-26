import { ReactNode } from "react";
import { FormSectionHeader } from "./FormSectionHeader";
import { FormSectionCard } from "./FormSectionCard";

interface FormSectionProps {
  icon: ReactNode;
  title: string;
  description: string;
  iconColor?: "blue" | "green" | "orange" | "purple" | "emerald" | "red";
  children: ReactNode;
  className?: string;
}

export function FormSection({
  icon,
  title,
  description,
  iconColor = "blue",
  children,
  className = "",
}: FormSectionProps) {
  return (
    <FormSectionCard className={className}>
      <FormSectionHeader
        icon={icon}
        title={title}
        description={description}
        iconColor={iconColor}
      />
      {children}
    </FormSectionCard>
  );
}
