import { errorResponse, HttpError, successResponse } from "@/app/lib/server/commonResponse";
import { getAppliedJobPosts, getbookmarkedJobPosts, getJobPostById, getJobPosts } from "@/app/services/job-post-services";
import { getSeekerProfile } from "@/app/services/seeker-services";
import { parseBigInt } from "@/lib/utils";
import { getUserIdFromSession } from "@/utils/auth";
import { ApplicationStatus } from "@prisma/client";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(
    req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const jobType = searchParams.get("job_type");
        const status = searchParams.get("status");

        const page = parseInt(searchParams.get("page") ?? "1");
        const limit = parseInt(searchParams.get("limit") ?? "10");

        const userId = await getUserIdFromSession();
        if (!userId) {
            return errorResponse('User ID was not provided.', 400);
        }

        if (isNaN(userId)) {
            return errorResponse('Invalid User ID format.', 400);
        }

        const profile = await getSeekerProfile(userId);

        const appliedList = await getAppliedJobPosts({
            userId,
            profileId: Number(profile.id),
            jobType: jobType as any,
            status: status as any,
            page,
            limit
        });
        return successResponse(parseBigInt(appliedList), 200, "Applied job post list fetched");
    } catch (err: any) {
        if (err instanceof HttpError) {
            return errorResponse(err.message, err.status);
        }
        console.error(err);
        return errorResponse("Internal server error", 500);
    }
}
