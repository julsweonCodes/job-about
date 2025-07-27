import { errorResponse, successResponse } from "@/app/lib/server/commonResponse";
import { NextRequest } from "next/server";
import { getUserIdFromSession } from "@/utils/auth";
import { parseBigInt } from "@/lib/utils";
import { getJobPostView } from "@/app/services/job-post-services";
import { JobStatus } from "@/constants/enums";

/**
 * GET Preview
 *
 */

export async function GET(_req: NextRequest, { params }: {params: {postId: string}}) {
  const userId = await getUserIdFromSession();
  try {
    const previewJobPost  = await getJobPostView(params.postId, JobStatus.DRAFT);
    if (previewJobPost) {
      // console.log(bizLocRes, jobPostRes);
      return successResponse(parseBigInt(previewJobPost), 200, "success");
    } else {
      return successResponse("no data", 200);
    }
  } catch(e) {
    console.error(e);
    return errorResponse("error", 500);
  }
}