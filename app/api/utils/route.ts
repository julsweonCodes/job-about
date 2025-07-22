import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma/prisma-singleton";
import { getPracticalSkills, getWorkStyles } from "@/utils";
import { successResponse, errorResponse } from "@/app/lib/server/commonResponse";

export async function GET() {
  try {
    console.log("실무능력 목록 조회 API 호출");
    
    const practicalSkills = await getPracticalSkills();
    const workStyles = await getWorkStyles();
    console.log(`실무능력 ${practicalSkills.length}개 조회 성공\n   업무스타일 ${workStyles.length}개 조회 성공`);

    
    return successResponse({skills: practicalSkills, workStyles: workStyles}, 200, "Practical skills fetched successfully.");
  } catch(e) {
    console.error("실무능력 조회 실패:", e);
    return errorResponse("Failed to fetch practical skills", 500);
  }
}