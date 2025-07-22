import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/app/lib/prisma/prisma-singleton";
import { cookies } from "next/headers";

export async function getUserUuidFromSession(): Promise<string> {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);
  const { data, error } = await supabase.auth.getUser(); // getUser()로 변경

  if (error || !data.user) {
    throw new Error("Unauthorized or session retrieval failed");
  }

  return data.user.id;
}

export async function getUserIdFromSession(): Promise<number> {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase.auth.getUser(); // getUser()로 변경

  if (error || !data.user) {
    if (error) {
      console.log("error: ", error);
    } else {
      console.log("no data user");
    }
    throw new Error("Unauthorized or session retrieval failed");
  }

  const uid = data.user.id;

  const user = await prisma.users.findFirst({
    where: { user_id: uid },
    select: { id: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return Number(user.id);
}
