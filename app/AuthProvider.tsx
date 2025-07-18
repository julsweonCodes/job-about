"use client";
import { useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/client/supabase";
import { useAuthStore } from "@/stores/useAuthStore";

export default function AuthProvider() {
  const { setIsLoggedIn, setUser } = useAuthStore();

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setIsLoggedIn(true);
        setUser(data.user);
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setIsLoggedIn(true);
        setUser(session?.user ?? null);
      }
      if (event === "SIGNED_OUT") {
        setIsLoggedIn(false);
        setUser(null);
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [setIsLoggedIn, setUser]);

  return null;
}
