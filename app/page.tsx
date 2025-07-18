"use client";
import React, { useState } from "react";
import {
  Users,
  Briefcase,
  ArrowRight,
  Brain,
  Smartphone,
  Target,
  Search,
  CheckCircle,
  Settings,
  UserCheck,
} from "lucide-react";
import GoogleLoginButton from "@/components/buttons/GoogleLoginButton";
import { useAuthStore } from "@/stores/useAuthStore";
import { createSupabaseBrowserClient } from "@/lib/client/supabase";

function App() {
  const [activeTab, setActiveTab] = useState("seekers");
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const supabase = createSupabaseBrowserClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // 상태 초기화는 AuthProvider에서 자동 처리됨
  };

  const seekerSteps = [
    {
      icon: Search,
      title: "Take Quiz",
      description:
        "Answer questions about your skills and preferences to help our AI understand you better.",
    },
    {
      icon: Target,
      title: "Get Matched",
      description:
        "Our AI analyzes job opportunities to find positions that perfectly match your profile.",
    },
    {
      icon: CheckCircle,
      title: "Apply in One Tap",
      description: "Apply to multiple matched positions instantly with your pre-filled profile.",
    },
  ];

  const employerSteps = [
    {
      icon: Briefcase,
      title: "Post Job",
      description:
        "Create your job posting with our AI-assisted form for better candidate attraction.",
    },
    {
      icon: Settings,
      title: "Set Preferences",
      description: "Define your ideal candidate profile including skills and personality traits.",
    },
    {
      icon: UserCheck,
      title: "Get AI-matched Applicants",
      description: "Receive pre-screened candidates who match your criteria and company culture.",
    },
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Matching",
      description:
        "Advanced algorithms analyze personality traits and skills for perfect job matches.",
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Seamlessly designed for mobile with an intuitive, easy-to-use interface.",
    },
    {
      icon: Target,
      title: "Precision Matching",
      description: "Higher success rates with matches based on compatibility and cultural fit.",
    },
  ];

  const currentSteps = activeTab === "seekers" ? seekerSteps : employerSteps;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-200 z-50 ">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between  h-16 lg:h-20">
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-bold text-gray-900">job:about</span>
            </div>

            {!isLoggedIn ? (
              // Logged-out view
              <>
                <div className="flex items-center gap-3">
                  <div className="min-w-[180px]">
                    <GoogleLoginButton />
                  </div>
                </div>
              </>
            ) : (
              // Logged-in view
              <div className="flex items-center gap-6">
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 transition-colors font-medium text-sm md:text-lg"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-indigo-50 pt-24 pb-20 lg:pt-40 lg:pb-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-100/20 via-transparent to-transparent"></div>

          <div className="relative max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                Find Jobs That
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                  Fit You Better
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                AI-powered part-time job matching for students, career starters, and small teams.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
                <button className="group w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                  <Users size={20} />
                  Get Matched Now
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>

                <button className="group w-full sm:w-auto bg-white text-purple-600 border-2 border-purple-200 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                  <Briefcase size={20} />
                  Post a Job
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our AI-powered platform makes job matching simple and effective
              </p>
            </div>

            <div className="flex justify-center mb-12">
              <div className="bg-gray-100 rounded-xl p-2">
                <button
                  onClick={() => setActiveTab("seekers")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    activeTab === "seekers"
                      ? "bg-white text-purple-600 shadow-md"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Users size={20} />
                  For Job Seekers
                </button>
                <button
                  onClick={() => setActiveTab("employers")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    activeTab === "employers"
                      ? "bg-white text-purple-600 shadow-md"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Briefcase size={20} />
                  For Employers
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {currentSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="relative">
                    <div className="bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-100">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6">
                        <Icon className="text-white" size={24} />
                      </div>

                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                      </div>

                      <p className="text-gray-600 leading-relaxed">{step.description}</p>
                    </div>

                    {index < currentSteps.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Why Choose job:about?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the future of job matching with features designed for success
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Icon className="text-white" size={24} />
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-3xl p-8 px-6 shadow-lg border border-gray-200">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Built for Modern Job Matching
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-600 aspect-square rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Personality-Based Matching</h4>
                        <p className="text-gray-600">
                          Find jobs that align with your work style and preferences
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-600 aspect-square rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Flexible Scheduling</h4>
                        <p className="text-gray-600">
                          Perfect for students and those seeking work-life balance
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-600 aspect-square rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Quality Connections</h4>
                        <p className="text-gray-600">
                          Connect with employers who value cultural fit
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl p-8 text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Brain className="text-white" size={32} />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      AI-Powered Intelligence
                    </h4>
                    <p className="text-gray-600">
                      Our advanced algorithms learn from successful matches to improve
                      recommendations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-indigo-50">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Whether you're seeking opportunities or looking to hire, our AI-powered platform is
                here to help you succeed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-8 px-5 shadow-xl border border-purple-100 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">For Job Seekers</h3>
                <p className="text-gray-600 mb-6">
                  Find part-time opportunities that match your skills, schedule, and career goals
                </p>
                <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Get Matched Now
                </button>
              </div>

              <div className="bg-white rounded-2xl p-8 px-5 shadow-xl border border-purple-100 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">For Employers</h3>
                <p className="text-gray-600 mb-6">
                  Connect with pre-screened candidates who are the right fit for your team
                </p>
                <button className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Post Your Job
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl font-bold">job:about</span>
              </div>
              <p className="text-gray-400 max-w-md">
                AI-powered job matching platform connecting talented individuals with opportunities
                that fit their skills and personality.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">© 2025 job:about. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
