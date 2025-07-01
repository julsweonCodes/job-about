import { create } from "zustand";

interface AuthState {
  isLoggedIn: boolean;
  user: any;
  loginTried: boolean;
  setIsLoggedIn: (v: boolean) => void;
  setUser: (u: any) => void;
  setLoginTried: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  loginTried: false,
  setIsLoggedIn: (v) => set({ isLoggedIn: v }),
  setUser: (u) => set({ user: u }),
  setLoginTried: (v) => set({ loginTried: v }),
}));
