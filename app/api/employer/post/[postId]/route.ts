import { successResponse, errorResponse } from "@/app/lib/server/commonResponse";
import { NextRequest } from "next/server";
import { getJobPostView } from "@/app/services/job-post-services";
import { JobStatus } from "@/constants/enums";
import { getUserIdFromSession } from "@/utils/auth";

/**
 * GET : Preview, View 화면에서 상태에 따른 Job Post 조회
 */
export async function GET(req: NextRequest, { params }: { params: { postId: string } }) {
  const userId = await getUserIdFromSession();

  if (!userId) {
    return errorResponse("Unauthorized", 401);
  }

  try {
    const status = req.nextUrl.searchParams.get("status");
    console.log("API called with postId:", params.postId, "status:", status);

    let check;

    if (status) {
      // status 파라미터가 있으면 해당 상태로 조회
      let jobStatus: JobStatus;
      switch (status) {
        case "draft":
          jobStatus = JobStatus.DRAFT;
          break;
        case "published":
        case "active":
          jobStatus = JobStatus.PUBLISHED;
          break;
        default:
          return errorResponse("Invalid status parameter", 400);
      }

      console.log("Looking for job post with status:", jobStatus);
      check = await getJobPostView(params.postId, jobStatus, userId);
    } else {
      // status 파라미터가 없으면 PUBLISHED와 DRAFT 모두 시도
      console.log("No status provided, trying PUBLISHED first");
      check = await getJobPostView(params.postId, JobStatus.PUBLISHED, userId);

      if (!check) {
        console.log("Not found in PUBLISHED, trying DRAFT");
        check = await getJobPostView(params.postId, JobStatus.DRAFT, userId);
      }
    }

    console.log("Final result:", check ? "Found" : "Not found");
    return successResponse(check, 200, "success");
  } catch (e) {
    console.error("check failed", e);
    return errorResponse("error", 500);
  }
}
