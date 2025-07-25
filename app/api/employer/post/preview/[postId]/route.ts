import { successResponse, errorResponse } from "@/app/lib/server/commonResponse";
import { prisma } from "@/app/lib/prisma/prisma-singleton";
import { useSearchParams } from "next/navigation";
import { geminiTest } from "@/app/services/gemini-services";
import { NextRequest } from "next/server";
import { getUserIdFromSession } from "@/utils/auth";
import { getCurrJobPost, getEmployerBizLoc } from "@/app/services/employer-services";
import { business_loc } from "@prisma/client";
import { parseBigInt } from "@/lib/utils";

/**
 *
 *
 */

export async function GET(_req: NextRequest, { params }: {params: {postId: string}}) {
  const userId = await getUserIdFromSession();
  try {
    const result1 = await getEmployerBizLoc(userId);
    const result2 = await getCurrJobPost(Number(params.postId), userId);

    if (result1 && result2) {

      // console.log(bizLocRes, jobPostRes);
      return successResponse(parseBigInt({result1, result2, message: "success"}), 200, "success");
    } else {
      return successResponse("no data", 200);
    }
  } catch(e) {
    console.error(e);
    return errorResponse("error", 500);
  }
}