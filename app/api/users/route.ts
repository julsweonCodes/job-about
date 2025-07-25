import { errorResponse, HttpError, successResponse } from "@/app/lib/server/commonResponse";
import { createUser, updateUser, uploadUserImage } from "@/app/services/user-services";
import { parseBigInt } from "@/lib/utils";
import { SupabaseUser, UpdateUser } from "@/types/user";
import { getUserIdFromSession } from "@/utils/auth";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const supabaseUser: SupabaseUser = await req.json();
    try {
        if (!supabaseUser.uid || !supabaseUser.email || !supabaseUser.displayName) {
            return errorResponse('Missing required fields', 400);
        }

        const user = await createUser(supabaseUser);
        return successResponse(parseBigInt(user), 201, 'User created');
    }
    catch (err: any) {
        if (err instanceof HttpError) {
            return errorResponse(err.message, err.status);
        }
        console.error(err);
        return errorResponse("Internal server error", 500);
    }
}

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
    const body: UpdateUser = {};

    const name = formData.get('name')?.toString();
    if (name) body.name = name;

    const phone = formData.get('phone_number')?.toString();
    if (phone) body.phone_number = phone;

    const description = formData.get('description')?.toString();
    if (description) body.description = description;

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