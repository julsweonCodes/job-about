import React from "react";
import GoogleLoginButton from "@/components/buttons/GoogleLoginButton";
import Typography from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import { Bot, Briefcase, CircleDollarSign, ConciergeBell } from "lucide-react";
import HeaderLoginButton from "@/components/buttons/HeaderLoginButton";
import LogoHeader from "@/components/common/LogoHeader";
import Footer from "@/components/common/Footer";

function JobCard({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <Card className="flex flex-col justify-center items-center p-6 w-full gap-2 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-[#3B82F6] cursor-pointer">
      {icon}
      <Typography as="span" variant="bodySm" className="text-center">
        {title}
      </Typography>
    </Card>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background-primary flex flex-col">
      {/* 헤더 */}
      <LogoHeader className="bg-background-primary">
        <HeaderLoginButton />
      </LogoHeader>

      {/* 메인 섹션 */}
      <main className="flex-1 flex flex-col items-center">
        {/* 그라데이션 배경 */}
        <section className="w-full flex flex-col items-center justify-center py-12 md:py-24 bg-gradient-to-br from-[#3B82F6] to-[#9333EA] px-4 md:px-0">
          <div className="mb-6">
            <Bot className="w-16 h-16 md:w-24 md:h-24 text-white" />
          </div>
          <Typography
            as="h1"
            variant="headlineLg"
            className="text-white text-center mb-4 text-3xl md:text-5xl"
          >
            Find your perfect
            <br />
            part-time job
          </Typography>
          <Typography
            as="p"
            variant="titleMd"
            className="text-white text-center mb-8 text-lg md:text-2xl"
          >
            AI-powered part-time opportunities
            <br className="md:hidden" /> for international students & workers
          </Typography>
          <div className="md:hidden w-full px-5">
            <GoogleLoginButton />
          </div>
        </section>

        {/* 추천 섹션 */}
        <section className="w-full max-w-2xl md:max-w-4xl mx-auto px-4 md:px-0 py-10 md:py-16 flex flex-col items-center">
          <Typography
            as="h2"
            variant="headlineMd"
            className="text-center mb-2 text-2xl md:text-4xl"
          >
            Let AI help you discover
            <br className="md:hidden" /> the best opportunities
          </Typography>
          <Typography
            as="p"
            variant="bodySm"
            className="text-gray-500 text-center mb-8 text-base md:text-lg"
          >
            Get personalized job recommendations based on your language skills, location, and
            availability. All employers are verified and trustworthy.
          </Typography>
          <Typography as="h3" variant="titleBold" className="mb-4 text-lg md:text-2xl">
            Recommended for you
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full justify-center">
            <JobCard
              icon={<Briefcase className="w-6 h-6 md:w-8 md:h-8 text-text-primary" />}
              title="Sales Associate"
            />
            <JobCard
              icon={<CircleDollarSign className="w-6 h-6 md:w-8 md:h-8 text-text-primary" />}
              title="Cashier"
            />
            <JobCard
              icon={<ConciergeBell className="w-6 h-6 md:w-8 md:h-8 text-text-primary" />}
              title="Restaurant Server"
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
