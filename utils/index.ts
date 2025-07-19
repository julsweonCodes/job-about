import { prisma} from "@/app/lib/prisma/prisma-singleton";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";


export async function getSkills() {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);
  console.log("getskills start");
  const { data, error } = await supabase
    .from("skills")
    .select("id, name")
    .order("name", { ascending: true });
  if (error) throw error;

  return data.map((skill) => ({
    id: Number(skill.id), // 👈 여기서 변환
    name: skill.name,
  }));
}