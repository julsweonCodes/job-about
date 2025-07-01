import React from "react";
import Typography from "@/components/ui/Typography";

interface JobCardProps {
  icon: React.ReactNode;
  title: string;
}

export default function JobCard({ icon, title }: JobCardProps) {
  return (
    <div className="flex flex-col justify-center items-center border rounded-2xl p-6 w-full md:w-1/3 bg-background-primary gap-2 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-[#3B82F6] cursor-pointer">
      {icon}
      <Typography as="span" variant="bodySm" className="text-center">
        {title}
      </Typography>
    </div>
  );
}
