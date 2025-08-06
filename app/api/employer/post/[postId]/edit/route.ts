import { NextRequest, NextResponse } from "next/server";
import { successResponse, errorResponse } from "@/app/lib/server/commonResponse";
import { JobPostPayload } from "@/types/employer";
import { geminiTest } from "@/app/services/gemini-services";
import { setCache } from "@/utils/cache";

/**
 * POST : Call gemini API
 */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as JobPostPayload;
  let geminiRes: any = [];
  try {
    const rawGemini = await geminiTest(body);
    if (rawGemini) {
      const gemTmp = JSON.parse(rawGemini);
      const struct1Combined = [
        "[Main Responsibilities]",
        ...(gemTmp.struct1?.["Main Responsibilities"] ?? []),
        "[Preferred Qualifications and Benefits]",
        ...(gemTmp.struct1?.["Preferred Qualifications and Benefits"] ?? []),
      ].join("\n");

      const struct2 = gemTmp.struct2 ?? "";
      geminiRes = [struct1Combined, struct2];
    }
    return successResponse(geminiRes, 200, "success");
  } catch (e) {
    console.error("❌ error on getting gemini result:", e);
    return NextResponse.json({ error: "Failed to get gemini result" }, { status: 500 });
  }
}
