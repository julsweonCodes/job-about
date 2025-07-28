import { prisma } from "@/app/lib/prisma/prisma-singleton";
import { errorResponse, HttpError, successResponse } from "@/app/lib/server/commonResponse";
import { getJobPostById } from "@/app/services/job-post-services";
import { getSeekerProfile } from "@/app/services/seeker-services";
import { parseBigInt } from "@/lib/utils";
import { getUserIdFromSession } from "@/utils/auth";
import { ApplicationStatus } from "@prisma/client";
import { NextRequest } from "next/server";

export const POST = async (
    request: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const jobPostId = parseInt(params.id);

        const userId = await getUserIdFromSession();
        if (!userId) {
            return errorResponse('User ID was not provided.', 400);
        }

        if (isNaN(userId)) {
            return errorResponse('Invalid User ID format.', 400);
        }

        const profile = await getSeekerProfile(userId);

        const jobPost = await getJobPostById(jobPostId);
        if (!jobPost) {
            return errorResponse('Job post not found', 404);
        }

        // 이미 지원한 상태인지 확인
        const existing = await prisma.applications.findFirst({
            where: {
                job_post_id: jobPostId,
                profile_id: profile.id,
                deleted_at: null,
            },
        });

        if (existing) {
            return errorResponse("You have already applied for this job.", 400);
        }

        const newApp = await prisma.applications.create({
            data: {
                job_post_id: jobPostId,
                profile_id: profile.id,
                status: ApplicationStatus.APPLIED,
                created_at: new Date(),
                updated_at: new Date(),
            },
            include: {
                job_post: true
            }
        });

        return successResponse(parseBigInt(newApp), 201, "Application submitted successfully.");

    } catch (err: any) {
        if (err instanceof HttpError) {
            return errorResponse(err.message, err.status);
        }

        console.error(err);
        return errorResponse("Internal server error", 500);
    }
};
