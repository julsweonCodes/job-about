"use client";
import React from "react";

export default function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center border-2 bg-background-primary border-gray-300 text-gray-700 px-5 py-3 md:px-5 md:py-4 text-lg font-semibold md:text-xl hover:shadow-xl transform transition-all duration-300 rounded-[16px]"
    >
      <img src="/icons/icon-google.svg" alt="Google" className="w-6 h-6 md:w-8 md:h-8" />
      <span className="ml-2">Continue with Google</span>
    </button>
  );
}
