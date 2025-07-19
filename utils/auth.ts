import { createClient } from "@/utils/supabase/server";
import {prisma} from "@/app/lib/prisma/prisma-singleton";
import { cookies } from "next/headers";

export async function getUserIdFromSession(): Promise<number> {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session) {
    if (error) {
      console.log("error: ", error);
    } else {
      console.log("no data session");
    }
    throw new Error("Unauthorized or session retrieval failed");
  }

  const uid = data.session.user?.id;

  const user = await prisma.users.findFirst({
    where: { user_id: uid },
    select: { id: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return Number(user.id);
}