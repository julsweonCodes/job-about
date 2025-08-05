import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/app/lib/server/commonResponse";
import { getJobPostView } from "@/app/services/job-post-services";
import { JobStatus } from "@/constants/enums";
import { HttpError } from "@/app/lib/server/commonResponse";
import { JobPostData } from "@/types/jobPost";
import { getUserIdFromSession } from "@/utils/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const jobPostId = parseInt(params.id);
    let jobPost: JobPostData | null = null;
    const status = req.nextUrl.searchParams.get("status");

    if (isNaN(jobPostId)) {
      console.error(`Wrong job post ID: ${params.id}`);
      return errorResponse("Invalid job post ID.", 400);
    }

    const userId = await getUserIdFromSession();
    if (!userId) {
      return errorResponse("User ID was not provided.", 400);
    }

    if (isNaN(userId)) {
      return errorResponse("Invalid User ID format.", 400);
    }

    switch (status) {
      case "published":
      case "active":
        jobPost = await getJobPostView(jobPostId.toString(), JobStatus.PUBLISHED, userId);
        break;
      case "draft":
        jobPost = await getJobPostView(jobPostId.toString(), JobStatus.DRAFT);
        break;
      case "closed":
        jobPost = await getJobPostView(jobPostId.toString(), JobStatus.CLOSED);
        break;
      default:
        return errorResponse("Invalid job status parameter.", 400);
    }

    if (!jobPost) {
      return errorResponse("Job post not found.", 404);
    }

    return successResponse(jobPost, 200, "Job post fetched successfully");
  } catch (err: any) {
    if (err instanceof HttpError) {
      return errorResponse(err.message, err.status);
    }
    console.error("Error fetching job post:", err);
    return errorResponse("Internal server error", 500);
  }
}
