import { create } from "zustand";
import type { AppUser } from "@/types/user";

interface AuthState {
  isLoggedIn: boolean;
  user: any; // supabase user
  appUser: AppUser | null; // 서비스 유저
  loginTried: boolean;
  setIsLoggedIn: (v: boolean) => void;
  setUser: (u: any) => void;
  setAppUser: (u: AppUser | null) => void;
  setLoginTried: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  appUser: null,
  loginTried: false,
  setIsLoggedIn: (v) => set({ isLoggedIn: v }),
  setUser: (u) => set({ user: u }),
  setAppUser: (u) => set({ appUser: u }),
  setLoginTried: (v) => set({ loginTried: v }),
}));
