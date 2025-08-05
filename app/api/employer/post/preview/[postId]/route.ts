import { errorResponse, successResponse } from "@/app/lib/server/commonResponse";
import { NextRequest } from "next/server";
import { getUserIdFromSession } from "@/utils/auth";
import { parseBigInt } from "@/lib/utils";
import { getBusinessLocId, getJobPostView, updateJobDesc } from "@/app/services/job-post-services";
import { JobStatus } from "@/constants/enums";
import { getCache } from "@/utils/cache";
import { throws } from "node:assert";

/**
 * GET Preview
 *
 */

export async function GET(_req: NextRequest, { params }: { params: { postId: string } }) {
  const userId = await getUserIdFromSession();
  try {
    console.log("This is cache - 1:", getCache(`gemini:${params.postId}`));
    console.log("This is cahce - 2:", getCache(`desc:${params.postId}`));
    const previewJobPost = await getJobPostView(params.postId, JobStatus.DRAFT);
    if (previewJobPost) {
      // console.log(bizLocRes, jobPostRes);
      return successResponse(
        { postData: parseBigInt(previewJobPost), geminiRes: getCache(`gemini:${params.postId}`) },
        200,
        "success"
      );
    } else {
      return successResponse("no data", 200);
    }
  } catch (e) {
    console.error(e);
    return errorResponse("error", 500);
  }
}

export async function PATCH(_req: NextRequest) {
  const userId = await getUserIdFromSession();
  const body = await _req.json();

  if (!userId) {
    errorResponse("no userId", 500);
  }
  try {
    const updateJobDescRes = await updateJobDesc(userId, body.postId, body.newJobDesc);

    if (updateJobDescRes) {
      return successResponse(updateJobDescRes, 200);
    } else {
      console.error("no data");
      return errorResponse("No data updated", 500);
    }
  } catch (e) {
    return errorResponse("Failed to update job description", 500);
  }
}
