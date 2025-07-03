"use client";

import React from "react";
import { Briefcase, Building, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            job:about
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            구직자와 고용주를 연결하는 새로운 플랫폼입니다. 당신의 역할을 선택하고 시작해보세요.
          </p>
        </div>

        {/* User Type Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Job Seeker Card */}
          <Link href="/onboarding/seeker">
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-100">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">구직자</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                프로필을 작성하고 원하는 직무를 찾아보세요. 스킬과 경험을 등록하여 최적의 매칭을
                받을 수 있습니다.
              </p>
              <div className="flex items-center text-indigo-600 font-semibold group-hover:text-indigo-700 transition-colors">
                <span>시작하기</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Employer Card */}
          <Link href="/onboarding/employer">
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-100">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">고용주</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                채용 공고를 등록하고 적합한 인재를 찾아보세요. 지원자 관리와 매칭을 한 곳에서 해결할
                수 있습니다.
              </p>
              <div className="flex items-center text-green-600 font-semibold group-hover:text-green-700 transition-colors">
                <span>시작하기</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">주요 기능</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">스마트 매칭</h4>
              <p className="text-gray-600 text-sm">AI 기반 추천으로 최적의 매칭을 제공합니다</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Building className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">간편한 관리</h4>
              <p className="text-gray-600 text-sm">직관적인 인터페이스로 쉽게 관리할 수 있습니다</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">빠른 연결</h4>
              <p className="text-gray-600 text-sm">실시간으로 구직자와 고용주를 연결합니다</p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            메인 페이지로 돌아가기
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-20 text-center text-gray-500 text-sm">
          <p>&copy; 2024 job:about. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
