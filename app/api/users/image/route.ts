import { errorResponse, HttpError, successResponse } from "@/app/lib/server/commonResponse";
import { updateUser, uploadUserImage } from "@/app/services/user-services";
import { parseBigInt } from "@/lib/utils";
import { getUserIdFromSession } from "@/utils/auth";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest) {
    const userId = await getUserIdFromSession();
    if (!userId) {
        return errorResponse('User ID was not provided.', 400);
    }

    if (isNaN(userId)) {
        return errorResponse('Invalid User ID format.', 400);
    }

    const formData = await req.formData();
    const file = formData.get('img') as File;

    try {

        if (file && file.size > 0) {
            const img_url = await uploadUserImage(file, userId);
            const user = await updateUser({ img_url }, userId);
            return successResponse(parseBigInt(user), 200, "User updated");
        } else {
            return errorResponse('File not found', 404);
        }

    } catch (err: any) {
        if (err instanceof HttpError) {
            return errorResponse(err.message, err.status);
        }

        console.error(err);
        return errorResponse("Internal server error", 500);
    }
};