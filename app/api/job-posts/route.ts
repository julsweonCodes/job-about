import { errorResponse, HttpError, successResponse } from "@/app/lib/server/commonResponse";
import { getJobPosts } from "@/app/services/job-post-services";
import { parseBigInt } from "@/lib/utils";
import { toWorkType, toLocation } from "@/types/enumMapper";
import { Location, WorkType } from "@prisma/client";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
    try {
        const searchParams = request.nextUrl.searchParams;
        const workType = toWorkType(searchParams.get("work_type"));
        const location = toLocation(searchParams.get("location"));

        const page = parseInt(searchParams.get("page") ?? "1");
        const limit = parseInt(searchParams.get("limit") ?? "10");

        const jobPosts = await getJobPosts({
            workType: workType as any,
            location: location as any,
            page,
            limit
        });
        return successResponse(parseBigInt(jobPosts), 200, "Job post list fetched");

    } catch (err: any) {
        if (err instanceof HttpError) {
            return errorResponse(err.message, err.status);
        }
        console.error(err);
        return errorResponse("Internal server error", 500);
    }
}

