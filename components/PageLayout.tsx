import React from "react";

interface PageLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
}

/**
 * 재사용 가능한 레이아웃 컴포넌트 (header → main → footer)
 * - header: 각 페이지에서 전달하는 커스텀 헤더
 * - children: 메인 콘텐츠
 * - footer: 고정
 */
export default function PageLayout({ children, header }: PageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header (custom per page) */}
      <div className="w-full max-w-[576px] mx-auto px-4 pt-4">{header}</div>
      {/* Main Content */}
      <main className="flex-1 w-full max-w-[576px] mx-auto px-4 py-6">{children}</main>
      {/* Footer (global) */}
      <footer className="bg-gray-900 text-white py-16 px-5 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto">
          <div className="flex md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-8 md:mb-0">
              <span className="text-xl font-bold md:text-2xl">job:about</span>
            </div>
          </div>
          <div className="border-t border-gray-800 md:mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Grit200.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
