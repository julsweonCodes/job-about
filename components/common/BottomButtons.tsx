import React from "react";

interface BottomButtonsProps {
  children: [React.ReactNode, React.ReactNode];
  direction?: "horizon" | "vertical";
  className?: string;
}

export default function BottomButtons({
  children,
  direction = "horizon",
  className = "",
}: BottomButtonsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-30 md:static md:p-0 md:bg-transparent">
      <div
        className={`${direction === "horizon" ? "flex-row gap-2" : "flex-col gap-2"} flex w-full ${className}`}
      >
        {children[0]}
        {children[1]}
      </div>
    </div>
  );
}
