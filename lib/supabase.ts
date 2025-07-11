import { Database } from "@/types/supabase";
import { createServerClient } from "@supabase/ssr";
import { getCookie, setCookie } from "cookies-next";
import { create } from "domain";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const createServerSideClient = async(serverComponent = false) => {
  const cookieStore = cookies();
  // 서버 클라이언트에서 사용하는 쿠키 세팅
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key) => getCookie(key),
        set: (key, value, options) => {
          if (serverComponent) return;
          setCookie(key, value, options); // 클라이언트에서 쿠키 없으면 설정
        },
        remove: (key, options) => {
          if (serverComponent) return;
          setCookie(key, "", options); // 클라이언트에서 쿠키 제거
        },
      }
    },
  );
};

// RSC (React Server Components)에서 사용할 서버 사이드 클라이언트 생성
export const createServerSideClientRSC = async() => {
  return createServerSideClient(true);
};

// Middleware에서 사용할 서버 사이드 클라이언트 생성
export const createServerSideClientMiddleware = async(req:NextRequest, res: NextResponse) => {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key) => getCookie(key, { req, res }),
        set: (key, value, options) => {
          setCookie(key, value, {
            ...options,
            req,
            res,
          }); // 미들웨어에서 쿠키 설정
        },
        remove: (key, options) => {
          setCookie(key, "", {
            ...options,
            req,
            res,
          }); // 미들웨어에서 쿠키 제거
        },
      }
    },
  );
}