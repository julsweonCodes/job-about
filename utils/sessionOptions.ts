import { SessionOptions } from "iron-session";

export interface SessionData {
  geminiRes?: object;
  jobDescTxt: string;
  isLoggedIn: boolean;
};

export const sessionOptions: SessionOptions = {
  cookieName: "jobAbout_employer_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/employer/post/",
  },
  password: process.env.SESSION_PASSWORD as string,
  // ttl: 0,
};

export const defaultSession: SessionData = {
  geminiRes: [],
  jobDescTxt: "",
  isLoggedIn: false,
}