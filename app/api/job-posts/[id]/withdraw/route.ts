import { prisma } from "@/app/lib/prisma/prisma-singleton";
import { errorResponse, HttpError, successResponse } from "@/app/lib/server/commonResponse";
import { getSeekerProfile } from "@/app/services/seeker-services";
import { JobStatus } from "@/constants/enums";
import { parseBigInt } from "@/lib/utils";
import { toPrismaAppStatus, toPrismaJobStatus } from "@/types/enumMapper";
import { getUserIdFromSession } from "@/utils/auth";
import { $Enums } from "@prisma/client";
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

        const profile = await getSeekerProfile(userId);
        if (!profile) {
            return errorResponse('Profile not exists', 400);
        }

        const application = await prisma.applications.findFirst({
            where: {
                profile_id: profile.id,
                job_post_id: jobPostId,
                deleted_at: null,
                status: {
                    in: [
                        $Enums.ApplicationStatus.APPLIED,
                        $Enums.ApplicationStatus.IN_REVIEW
                    ]
                }
            },
            select: {
                id: true
            }
        });
        if (!application) {
            return errorResponse('Application(APPLIED or IN_REVIEW) not exists', 400);
        }

        const updated = await prisma.applications.update({
            where: {
                id: application.id
            }, data: {
                updated_at: new Date(),
                status: $Enums.ApplicationStatus.WITHDRAWN
            }
        });

        return successResponse(parseBigInt(updated), 200, "Job post withdrawn");
    } catch (err: any) {
        if (err instanceof HttpError) {
            return errorResponse(err.message, err.status);
        }
        console.error(err);
        return errorResponse("Internal server error", 500);
    }
}
