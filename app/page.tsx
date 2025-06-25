import React from "react";
import PageLayout from "../components/PageLayout";
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

export default function HomePage() {
  return (
    <PageLayout header={<Header />}>
      <Body />
    </PageLayout>
  );
}
