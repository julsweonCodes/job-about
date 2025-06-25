"use client";
import React from "react";

export default function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    // Implement Google login logic here
    console.log("Google login clicked");
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center border-2 border-gray-300 text-gray-700 px-6 py-3 md:px-8 md:py-4 rounded-full text-lg font-semibold md:text-xl hover:shadow-xl transform transition-all duration-300"
    >
      <img src="/icons/icon-google.svg" alt="Google" className="w-6 h-6 md:w-8 md:h-8" />
      <span className="ml-2">Continue with Google</span>
    </button>
  );
}
