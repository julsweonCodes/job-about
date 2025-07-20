"use client";
import { createSupabaseBrowserClient } from "@/lib/client/supabase";
import { useAuthStore } from "@/stores/useAuthStore";

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function LogoutButton({ className = "", children }: LogoutButtonProps) {
  const { setIsLoggedIn, setUser } = useAuthStore();
  const supabase = createSupabaseBrowserClient();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // 상태 초기화는 AuthProvider에서 자동 처리됨
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={`text-gray-600 hover:text-red-600 transition-colors font-medium text-sm md:text-lg ${className}`}
    >
      {children || "Log out"}
    </button>
  );
} 