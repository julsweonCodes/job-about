import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma/prisma-singleton";
import { getSkills } from "@/utils";

export async function GET() {
  try {
    console.log("start");
    const skills = await getSkills();
    console.log(skills);
    return NextResponse.json({skills}, {status: 200});
  } catch(e) {
    console.error("Failed to fetch skills", e);
    return NextResponse.json( { error: "Failed to fetch skills"}, {status: 500});
  }
}