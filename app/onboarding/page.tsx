"use client";

import React, { useState } from "react";
import { UserRound, Briefcase } from "lucide-react";
import LogoHeader from "@/components/common/LogoHeader";
import { Card } from "@/components/ui/Card";
import Typography from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import BottomButton from "@/components/common/BottomButton";
import { Role } from "@prisma/client";
import { useRouter } from "next/navigation";

interface RoleCardProps {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}

function RoleCard({ selected, onClick, icon, title, description }: RoleCardProps) {
  return (
    <Card
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      aria-pressed={selected}
      className={`h-full aspect-square flex flex-col items-center justify-center w-full rounded-xl border px-6 py-7 cursor-pointer text-center relative shadow-md bg-white
        transition-all duration-200
        ${selected ? "border-[#7A73F1] ring-2 ring-[#edeafd]" : "border-gray-200 hover:border-[#a59cf7]"}
        focus:outline-none focus:ring-2 focus:ring-[#a59cf7]
      `}
    >
      <div
        className={`flex items-center justify-center rounded-full mb-4 w-14 h-14 transition-colors duration-200 ${selected ? "bg-[#edeafd]" : "bg-gray-100 hover:bg-[#f3f1fd]"}`}
      >
        {icon}
      </div>
      <span
        className={`text-[16px] sm:text-[22px] font-bold mb-1 transition-colors duration-200 ${selected ? "text-[#7A73F1]" : "text-gray-900 hover:text-[#7A73F1]"}`}
      >
        {title}
      </span>
      <span className="text-[16px] sm:text-[18px] font-normal text-gray-500 mb-2 transition-colors duration-200 hidden md:block">
        {description}
      </span>

      <span
        className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${selected ? "border-[#7A73F1] bg-[#7A73F1]" : "border-gray-200 bg-white"}`}
      >
        {selected && (
          <span className="w-2.5 h-2.5 bg-white rounded-full block transition-all duration-200" />
        )}
      </span>
    </Card>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Role>(Role.APPLICANT);

  const handleConfirm = async () => {
    const res = await fetch(`/api/users/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: selected }),
    });

    const result = await res.json();
    if (res.ok) {
      alert("Update user role successfully!");
      // role 설정 후 홈페이지로 이동
      router.push("/");
    } else {
      alert(result.message || "Error update user role");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-6xl min-h-screen bg-white flex flex-col">
        <LogoHeader className="bg-background-primary" />
        <main className="flex sm:flex-1 flex-col items-center justify-center">
          <section className="w-full max-w-2xl bg-white rounded-xl p-5 flex flex-col items-center">
            <Typography as="h1" variant="headlineMd" className="text-center mb-5 md:text-3xl">
              Select your role
            </Typography>
            <p className="text-[14px] sm:text-[20px] font-normal text-gray-500 text-center mb-10 max-w-xs mx-auto">
              A job matching platform for international students
              <br className="hidden md:block" />
              and working holiday participants in{" "}
              <span className="font-bold text-text-primary">Canada</span>.
            </p>

            {/* Role Selection Cards */}
            <div className="w-full grid gap-4 grid-cols-2 mb-8 items-stretch">
              <RoleCard
                selected={selected === Role.APPLICANT}
                onClick={() => setSelected(Role.APPLICANT)}
                icon={
                  <UserRound
                    className={`w-8 h-8 transition-colors duration-200 ${selected === Role.APPLICANT ? "text-[#7A73F1]" : "text-gray-400 hover:text-[#7A73F1]"}`}
                  />
                }
                title={Role.APPLICANT}
                description="Find opportunities that match your skills and work authorization status."
              />
              <RoleCard
                selected={selected === Role.EMPLOYER}
                onClick={() => setSelected(Role.EMPLOYER)}
                icon={
                  <Briefcase
                    className={`w-8 h-8 transition-colors duration-200 ${selected === Role.EMPLOYER}? "text-[#7A73F1]" : "text-gray-400 hover:text-[#7A73F1]"}`}
                  />
                }
                title={Role.EMPLOYER}
                description="Connect with talented international students and working holiday participants."
              />
            </div>
            {/* 데스크탑 확인 버튼 */}
            <Button
              type="button"
              size="lg"
              className="shadow-md hidden md:block"
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </section>
        </main>
        {/* 모바일 확인 버튼 */}
        <div className="block md:hidden">
          <BottomButton type="button" size="lg" className="shadow-md" onClick={handleConfirm}>
            Confirm
          </BottomButton>
        </div>
      </div>
    </div>
  );
}
