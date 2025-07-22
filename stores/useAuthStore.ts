import { create } from "zustand";
import type { AppUser } from "@/types/user";

interface ProfileStatus {
  hasRole: boolean;
  isProfileCompleted: boolean;
  role: "APPLICANT" | "EMPLOYER" | null;
}

interface AuthState {
  isLoggedIn: boolean;
  user: any; // supabase user
  appUser: AppUser | null; // 서비스 유저
  profileStatus: ProfileStatus | null;
  loginTried: boolean;
  setIsLoggedIn: (v: boolean) => void;
  setUser: (u: any) => void;
  setAppUser: (u: AppUser | null) => void;
  setProfileStatus: (status: ProfileStatus | null) => void;
  setLoginTried: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  appUser: null,
  profileStatus: null,
  loginTried: false,
  setIsLoggedIn: (v) => set({ isLoggedIn: v }),
  setUser: (u) => set({ user: u }),
  setAppUser: (u) => set({ appUser: u }),
  setProfileStatus: (status) => set({ profileStatus: status }),
  setLoginTried: (v) => set({ loginTried: v }),
}));
