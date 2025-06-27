"use client";
import { createSupabaseBrowserClient } from "@/lib/client/supabase";
import { Auth } from "@supabase/auth-ui-react";
import React, { useState, useEffect } from "react";

const AuthUI = () => {
  const [user, setUser] = useState();
  const supabase = createSupabaseBrowserClient();

  const getUserInfo = async () => {
    const result = await supabase.auth.getUser();
    console.log(result);

    if (result?.data?.user) setUser(result?.data?.user);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div>
      <div>{user ? `로그인 성공${user?.email}` : "로그아웃"}</div>
      <Auth
        redirectTo={process.env.NEXT_PUBLIC_AUTH_REDIRECT_TO}
        supabaseClient={supabase}
        onlyThirdPartyProviders
        providers={["google"]}
      ></Auth>
    </div>
  );
};

export default AuthUI;
