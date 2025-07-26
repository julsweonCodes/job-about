import React from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AuthProvider from "@/app/AuthProvider";
import { Toaster } from "sonner";
import { CheckIcon, XIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "job:about",
  description: "AI-powered part-time opportunities for international students & workers",
};

const pretendard = localFont({
  src: "../static/fonts/PretendardVariable.woff2",
  display: "swap",
  variable: "--font-pretendard",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={pretendard.className}>
      <body className="flex flex-col min-h-screen">
        <AuthProvider />
        {children}
        <Toaster
          position="bottom-center"
          className="toast-container"
          icons={{
            success: <CheckIcon className="sm:w-6 sm:h-6 w-5 h-5 text-green-500" />,
            error: <XIcon className="sm:w-6 sm:h-6 w-5 h-5 text-red-500" />,
          }}
        />
      </body>
    </html>
  );
}
