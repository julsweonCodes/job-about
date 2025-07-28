import { prisma } from "@/app/lib/prisma/prisma-singleton";
import { errorResponse, HttpError, successResponse } from "@/app/lib/server/commonResponse";
import { parseBigInt } from "@/lib/utils";
import { getUserIdFromSession } from "@/utils/auth";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {

    try {
        const jobPostId = parseInt(params.id);
        if (isNaN(jobPostId)) {
            console.error(`잘못된 job post ID: ${params.id}`);
            return errorResponse("Invalid job post ID.", 400);
        }

        const userId = await getUserIdFromSession();
        if (!userId) {
            return errorResponse('User ID was not provided.', 400);
        }

        if (isNaN(userId)) {
            return errorResponse('Invalid User ID format.', 400);
        }

        const jobPost = await prisma.bookmarked_jobs.create({
            data: {
                user_id: userId,
                job_post_id: jobPostId
            }, include: {
                job_post: true
            }
        });

        return successResponse(parseBigInt(jobPost), 201, "Job post bookmarked");
    } catch (err: any) {
        if (err instanceof HttpError) {
            return errorResponse(err.message, err.status);
        }
        console.error(err);
        return errorResponse("Internal server error", 500);
    }
}


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {

    try {
        const jobPostId = parseInt(params.id);
        if (isNaN(jobPostId)) {
            console.error(`잘못된 job post ID: ${params.id}`);
            return errorResponse("Invalid job post ID.", 400);
        }

        const userId = await getUserIdFromSession();
        if (!userId) {
            return errorResponse('User ID was not provided.', 400);
        }

        if (isNaN(userId)) {
            return errorResponse('Invalid User ID format.', 400);
        }

        const deleted = await prisma.bookmarked_jobs.deleteMany({
            where: {
                user_id: userId,
                job_post_id: jobPostId
            }
        });

        if (deleted.count === 0) {
            return errorResponse("The bookmark job post does not exist.", 404);
        }

        return successResponse({}, 200, "Job post bookmark removed");
    } catch (err: any) {
        if (err instanceof HttpError) {
            return errorResponse(err.message, err.status);
        }
        console.error(err);
        return errorResponse("Internal server error", 500);
    }
}
