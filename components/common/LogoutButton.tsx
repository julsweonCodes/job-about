"use client";
import { useAuthStore } from "@/stores/useAuthStore";
import { supabaseClient } from "@/utils/supabase/client";

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function LogoutButton({ className = "", children }: LogoutButtonProps) {
  const { logout } = useAuthStore();
  const supabase = supabaseClient;

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      logout();
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
