import { successResponse, errorResponse } from "@/app/lib/server/commonResponse";
import { NextRequest } from "next/server";
import { getJobPostView } from "@/app/services/job-post-services";
import {JobStatus} from "@/constants/enums";

/**
 * GET : Preview, View 화면에서 상태에 따른 Job Post 조회
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { postId: string} }
) {
  try {
    const check = await getJobPostView(params.postId, JobStatus.PUBLISHED);
    return successResponse(check, 200, "success");
  } catch (e) {
    console.error("check failed", e);
    return errorResponse("error", 500);
  }

}