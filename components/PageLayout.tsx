import React from "react";

interface PageLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
}

/**
 * 재사용 가능한 레이아웃 컴포넌트 (Header → Main → Footer)
 * - header: 각 페이지에서 전달하는 커스텀 헤더
 * - children: 메인 콘텐츠
 * - footer: 고정 영역
 */
export default function PageLayout({ children, header }: PageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background-primary">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background-primary backdrop-blur-md">
        <div className="max-w-[576px] mx-auto px-5 sm:px-6 lg:px-8">{header}</div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[576px] mx-auto px-5 py-6">{children}</main>

      {/* Footer */}
      <footer className="bg-background-bk text-text-inverse py-16 px-5 sm:px-6 lg:px-8">
        <div className="max-w-[576px] mx-auto">
          <div className="flex justify-between items-center mb-8">
            <span className="text-xl font-bold md:text-2xl">job:about</span>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-text-secondary">
            <p>&copy; 2025 Grit200.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
