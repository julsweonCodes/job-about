import { errorResponse, HttpError, successResponse } from "@/app/lib/server/commonResponse";
import { updateUser, uploadUserImage } from "@/app/services/user-services";
import { parseBigInt } from "@/lib/utils";
import { UpdateUser } from "@/types/user";
import { NextRequest } from "next/server";

export const PUT = async (
    request: NextRequest,
    { params }: { params: { userId: string } }
) => {
    if (!params.userId) {
        return errorResponse('User ID was not provided.', 400);
    }

    const userId = Number(params.userId);
    if (isNaN(userId)) {
        return errorResponse('Invalid User ID format.', 400);
    }

    const formData = await request.formData();
    console.log(formData);

    const file = formData.get('img') as File;
    const body: UpdateUser = {
        name: formData.get('name')?.toString() || '',
        phone_number: formData.get('phone_number')?.toString() || '',
        description: formData.get('description')?.toString() || '',

    }
    try {
        if (file && file.size > 0) {
            const img_url = await uploadUserImage(file, userId);
            body.img_url = img_url;
        }

        const user = await updateUser(body, userId);
        return successResponse(parseBigInt(user), 200, "User updated");

    } catch (err: any) {
        if (err instanceof HttpError) {
            return errorResponse(err.message, err.status);
        }

        console.error(err);
        return errorResponse("Internal server error", 500);
    }
};