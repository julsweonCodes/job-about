import { errorResponse, HttpError, successResponse } from "@/app/lib/server/commonResponse";
import { getJobPostById, getJobPosts } from "@/app/services/job-post-services";
import { parseBigInt } from "@/lib/utils";
import { NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }) {
    try {
        const jobPostId = parseInt(params.id);

        if (isNaN(jobPostId)) {
            console.error(`잘못된 job post ID: ${params.id}`);
            return errorResponse("Invalid job post ID.", 400);
        }

        const jobPost = await getJobPostById(jobPostId);
        return successResponse(parseBigInt(jobPost), 200, "Job post fetched");
    } catch (err: any) {
        if (err instanceof HttpError) {
            return errorResponse(err.message, err.status);
        }
        console.error(err);
        return errorResponse("Internal server error", 500);
    }
}
