import React from "react";
import Typography from "@/components/ui/Typography";
import Link from "next/link";

interface LogoHeaderProps {
  children?: React.ReactNode;
  className?: string;
  borderless?: boolean;
  shadowless?: boolean;
}

export default function LogoHeader({
  children,
  className,
  borderless = false,
  shadowless = false,
}: LogoHeaderProps) {
  return (
    <header
      className={[
        "sticky top-0 z-30 bg-white",
        borderless ? "" : "border-b border-gray-100",
        shadowless ? "" : "shadow-sm",
        className || "",
      ].join(" ")}
    >
      <div
        className={
          "max-w-6xl mx-auto flex items-center justify-between h-14 px-4 sm:px-8 " +
          (className || "")
        }
      >
        <Link
          href="/"
          className="flex items-center gap-2 cursor-pointer group"
          aria-label="Go to main page"
        >
          <Typography
            as="h1"
            variant="headlineLg"
            className="group-hover:text-[#7A73F1] transition-colors"
          >
            job:about
          </Typography>
        </Link>
        {children}
      </div>
    </header>
  );
}
