import React from "react";
import AuthUI from "@/components/auth";
import GoogleLoginButton from "@/components/buttons/GoogleLoginButton";
import Typography from "@/components/ui/Typography";
import JobCard from "@/components/cards/JobCard";
import { Bot, Briefcase, CircleDollarSign, ConciergeBell } from "lucide-react";
import HeaderLoginButton from "@/components/buttons/HeaderLoginButton";

function Header() {
  // const logoImage = (
  //   <Image
  //     src="/images/img-logo.png"
  //     alt="job about logo"
  //     width={100}
  //     height={20}
  //     className="w-[100px] h-[20px] md:w-[120px] md:h-[23px]"
  //     style={{ height: "auto" }}
  //   />
  // );
  return (
    <header>
      <div className="max-w-4xl mx-auto flex items-center justify-between h-14 px-4">
        <span className="text-xl font-bold md:text-2xl">job:about</span>
        <HeaderLoginButton />
      </div>
    </header>
  );
}

function Body() {
  return (
    <div>
      <main className="flex-1 pt-20 text-center pb-32 px-5 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center px-5 py-2 bg-purple-100 rounded-full text-purple-700 text-sm font-medium mb-8">
            One-Click Apply Service
          </div>
          <Typography as="h1" variant="headlineLg" className="text-gray-900 mb-6 leading-tight">
            Your Personal
            <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Job Find Helper
            </span>
          </Typography>
          <Typography
            as="p"
            variant="bodySm"
            className="text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Get personalized job recommendations.
          </Typography>
          <div className="mt-4">
            <AuthUI />
          </div>
        </div>
      </main>
    </div>
  );
}

function Footer() {
  return (
    <div>
      <footer className="bg-gray-900 text-white py-16 px-5 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <span className="text-xl font-bold md:text-2xl">job:about</span>
          </div>
          <div className="border-t border-gray-800 pt-8 text-gray-400">
            <p>&copy; 2025 Grit200.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background-primary flex flex-col">
      {/* 헤더 */}
      <Header />

      {/* 메인 섹션 */}
      <main className="flex-1 flex flex-col items-center">
        {/* 그라데이션 배경 */}
        <section className="w-full flex flex-col items-center justify-center py-12 md:py-24 bg-gradient-to-br from-[#3B82F6] to-[#9333EA]">
          <div className="mb-6">
            <Bot className="w-16 h-16 text-white" />
          </div>
          <Typography as="h1" variant="headlineLg" className="text-white text-center mb-4">
            Find your perfect
            <br />
            part-time job
          </Typography>
          <Typography as="p" variant="titleMd" className="text-white text-center mb-8">
            AI-powered part-time opportunities
            <br className="md:hidden" /> for international students & workers
          </Typography>
          <div className="md:hidden w-full px-5">
            <GoogleLoginButton />
          </div>
        </section>

        {/* 추천 섹션 */}
        <section className="w-full max-w-2xl mx-auto px-4 py-10 flex flex-col items-center">
          <Typography as="h2" variant="headlineMd" className="text-center mb-2">
            Let AI help you discover
            <br className="md:hidden" /> the best opportunities
          </Typography>
          <Typography as="p" variant="bodySm" className="text-gray-500 text-center mb-8">
            Get personalized job recommendations based on your language skills, location, and
            availability. All employers are verified and trustworthy.
          </Typography>
          <Typography as="h3" variant="titleBold" className="mb-4">
            Recommended for you
          </Typography>
          <div className="flex flex-row gap-4 w-full justify-center">
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
