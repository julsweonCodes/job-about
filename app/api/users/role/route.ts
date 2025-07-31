import { errorResponse, HttpError, successResponse } from "@/app/lib/server/commonResponse";
import { updateUserRole } from "@/app/services/user-services";
import { parseBigInt } from "@/lib/utils";
import { getUserIdFromSession } from "@/utils/auth";
import { Role } from "@prisma/client";
import { NextRequest } from "next/server";

export const PATCH = async (
    request: NextRequest
) => {
    const userId = await getUserIdFromSession();
    if (!userId) {
        return errorResponse('User ID was not provided.', 400);
    }

    if (isNaN(userId)) {
        return errorResponse('Invalid User ID format.', 400);
    }

    const { role } = await request.json();
    if (!Object.values(Role).includes(role)) {
        return errorResponse("Invalid role", 400);
    }

    try {
        const user = await updateUserRole(role, userId);
        return successResponse(parseBigInt(user), 200, "User role updated");

    } catch (err: any) {
        if (err instanceof HttpError) {
            return errorResponse(err.message, err.status);
        }

        console.error(err);
        return errorResponse("Internal server error", 500);
    }
};