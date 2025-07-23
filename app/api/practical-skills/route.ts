import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma/prisma-singleton";
import { successResponse, errorResponse } from "@/app/lib/server/commonResponse";

/**
 * GET: 모든 실무능력 목록을 가져오는 API
 * @description 구직자/사장님이 선택할 수 있는 실무능력 목록 제공
 * @usage 클라이언트에서 fetch('/api/practical-skills')로 호출
 */
export async function GET() {
  try {
    console.log("실무능력 목록 조회 API 호출");
    
    const practicalSkills = await prisma.practical_skills.findMany({
      select: {
        id: true,
        category_ko: true,
        category_en: true,
        name_ko: true,
        name_en: true
      },
      orderBy: [
        { category_ko: 'asc' },
        { name_ko: 'asc' }
      ]
    });

    // BigInt를 Number로 변환
    const serializedSkills = practicalSkills.map((practicalSkill: any) => ({
      id: Number(practicalSkill.id),
      category_ko: practicalSkill.category_ko,
      category_en: practicalSkill.category_en,
      name_ko: practicalSkill.name_ko,
      name_en: practicalSkill.name_en
    }));

    if (!serializedSkills || serializedSkills.length === 0) {
      console.error("실무능력 데이터가 없음");
      return errorResponse("Practical skills not found.", 404);
    }

    console.log(`실무능력 ${serializedSkills.length}개 조회 성공`);
    
    return successResponse(serializedSkills, 200, "Practical skills fetched successfully.");
  } catch (error) {
    console.error("API Error GET /api/practical-skills:", error);
    return errorResponse("An internal server error occurred.", 500);
  }
}