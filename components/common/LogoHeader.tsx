import React from "react";
import Typography from "@/components/ui/Typography";
import Link from "next/link";

interface LogoHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

export default function LogoHeader({ children, className }: LogoHeaderProps) {
  return (
    <header className={"sticky top-0 z-30"}>
      <div
        className={
          "max-w-6xl mx-auto flex items-center justify-between h-14 px-4 " + (className || "")
        }
      >
        <Link
          href="/"
          className="flex items-center gap-2 cursor-pointer group"
          aria-label="Go to main page"
        >
          <Typography
            as="span"
            variant="headlineMd"
            className="text-xl md:text-2xl font-bold group-hover:text-[#7A73F1] transition-colors"
          >
            job:about
          </Typography>
        </Link>
        {children}
      </div>
    </header>
  );
}
