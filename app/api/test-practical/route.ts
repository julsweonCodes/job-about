import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma/prisma-singleton";

export async function GET() {
  try {
    console.log("=== 테스트 시작 ===");
    
    // 1. Prisma 연결 테스트
    console.log("1. Prisma 연결 테스트...");
    const connectionTest = await prisma.$queryRaw`SELECT 1 as test`;
    console.log("Prisma 연결 성공:", connectionTest);
    
    // 2. practical_skills 테이블 존재 확인
    console.log("2. practical_skills 테이블 확인...");
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'practical_skills'
      );
    `;
    console.log("테이블 존재 여부:", tableExists);
    
    // 3. 데이터 개수 확인
    console.log("3. 데이터 개수 확인...");
    const count = await prisma.practical_skills.count();
    console.log("practical_skills 데이터 개수:", count);
    
    // 4. 실제 데이터 조회 시도
    console.log("4. 데이터 조회 시도...");
    const data = await prisma.practical_skills.findMany({
      take: 3, // 처음 3개만
      select: {
        id: true,
        name_ko: true,
      }
    });
    console.log("조회된 데이터:", data);
    
    return NextResponse.json({
      success: true,
      connection: connectionTest,
      tableExists,
      count,
      sampleData: data
    });
    
  } catch (error) {
    console.error("=== 에러 발생 ===");
    console.error("에러 메시지:", error?.message);
    console.error("에러 상세:", error);
    
    return NextResponse.json({
      success: false,
      error: error?.message || "Unknown error",
      details: error
    }, { status: 500 });
  }
}