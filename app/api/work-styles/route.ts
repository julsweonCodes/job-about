import "next/server";
import { prisma } from "@/app/lib/prisma/prisma-singleton";
import { successResponse, errorResponse } from "@/app/lib/server/commonResponse";

/**
 * GET: 모든 work style 목록을 가져오는 API
 * @description 사장님이 채용공고에서 선택할 수 있는 work style 목록 제공
 * @usage 클라이언트에서 fetch('/api/work-styles')로 호출
 */
export async function GET() {
  try {
    console.log("work style 목록 조회 API 호출");
    
    const workStyles = await prisma.work_styles.findMany({
      select: {
        id: true,
        name_ko: true,
        name_en: true
      },
      orderBy: {
        id: 'asc'
      }
    });

    if (!workStyles || workStyles.length === 0) {
      console.error("work style 데이터가 없음");
      return errorResponse("Work styles not found.", 404);
    }

    console.log(`work style ${workStyles.length}개 조회 성공`);
    
    return successResponse(workStyles, 200, "Work styles fetched successfully.");
  } catch (error) {
    console.error("API Error GET /api/work-styles:", error);
    return errorResponse("An internal server error occurred.", 500);
  }
}