import React from "react";
import GoogleLoginButton from "@/components/buttons/GoogleLoginButton";

function Header() {
  return (
    <div className="flex justify-between items-center h-14 px-5 sm:px-6 lg:px-8">
      <div className="flex items-center space-x-2">
        <span className="text-xl font-bold bg-clip-text md:text-2xl">job:about</span>
      </div>
    </div>
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
          <h1 className="text-3xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Your Personal
            <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Job Find Helper
            </span>
          </h1>
          <p className="text-lg  md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Get personalized job recommendations.
          </p>
          <div className="mt-4">
            <GoogleLoginButton></GoogleLoginButton>
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
        <div className="max-w-[576px] mx-auto">
          <div className="flex justify-between items-center mb-8">
            <span className="text-xl font-bold md:text-2xl">job:about</span>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Grit200.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-[576px] mx-auto px-5 sm:px-6 lg:px-8">
          <Header />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[576px] mx-auto px-5 py-6">
        <Body />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
