import React from "react";
import GoogleLoginButton from "@/components/buttons/GoogleLoginButton";
import Typography from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import { Bot, Briefcase, CircleDollarSign, ConciergeBell } from "lucide-react";
import HeaderLoginButton from "@/components/buttons/HeaderLoginButton";
import LogoHeader from "@/components/common/LogoHeader";
import Footer from "@/components/common/Footer";

function JobCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="flex flex-col justify-center items-center p-6 w-full gap-2 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-[#3B82F6] cursor-pointer">
      {icon}
      <span className="text-center text-[14px] sm:text-[20px] font-medium">{title}</span>
      <span className="text-center text-gray-500 text-xs md:text-base">{description}</span>
    </Card>
  );
}

export default function HomePage() {
  const recommendedJobs = [
    {
      icon: <Briefcase className="w-6 h-6 md:w-8 md:h-8 text-text-primary" />,
      title: "Sales Associate",
      description: "Help customers and manage sales.",
    },
    {
      icon: <CircleDollarSign className="w-6 h-6 md:w-8 md:h-8 text-text-primary" />,
      title: "Cashier",
      description: "Handle payments and assist shoppers.",
    },
    {
      icon: <ConciergeBell className="w-6 h-6 md:w-8 md:h-8 text-text-primary" />,
      title: "Restaurant Server",
      description: "Serve food and provide customer service.",
    },
  ];

  return (
    <div className="min-h-screen bg-background-primary flex flex-col">
      {/* 헤더 */}
      <LogoHeader className="bg-background-primary">
        <HeaderLoginButton />
      </LogoHeader>

      {/* 메인 섹션 */}
      <main className="flex-1 flex flex-col items-center">
        {/* 그라데이션 배경 */}
        <section className="w-full flex flex-col items-center justify-center py-12 md:py-24 bg-gradient-to-br from-[#3B82F6] to-[#9333EA] px-4 md:px-0 gap-6">
          <div>
            <Bot className="w-16 h-16 md:w-24 md:h-24 text-white" />
          </div>
          <Typography
            as="h1"
            variant="headlineLg"
            className="text-white text-center text-3xl md:text-5xl font-semibold md:mb-5"
          >
            Find your perfect
            <br />
            part-time job
          </Typography>
          <Typography
            as="p"
            variant="titleRegular"
            className="text-white text-center text-lg md:text-2xl"
          >
            AI-powered part-time opportunities
            <br /> for international students & workers
          </Typography>
          <div className="md:hidden w-full px-5">
            <GoogleLoginButton />
          </div>
        </section>

        {/* 추천 섹션 */}
        <section className="w-full max-w-2xl md:max-w-4xl mx-auto px-4 md:px-0 py-10 md:py-16 flex flex-col items-center gap-8">
          <Typography as="h2" variant="headlineMd" className="text-center text-2xl md:text-4xl">
            Let AI help you discover
            <br /> the best opportunities
          </Typography>
          <Typography
            as="p"
            variant="bodyMd"
            className="text-gray-500 text-center text-base md:text-lg"
          >
            Get personalized job recommendations <br /> based on your language skills, location, and
            availability. <br />
            All employers are verified and trustworthy.
          </Typography>

          <div className="flex flex-col items-center gap-8">
            <Typography as="h3" variant="titleBold" className="text-lg md:text-2xl">
              Recommended for you
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full justify-center">
              {recommendedJobs.map((job) => (
                <JobCard
                  key={job.title}
                  icon={job.icon}
                  title={job.title}
                  description={job.description}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
