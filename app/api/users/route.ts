import { errorResponse, HttpError, successResponse } from "@/app/lib/server/commonResponse";
import { createUser, updateUser } from "@/app/services/user-services";
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

    const body = await req.json();
    const updateData: UpdateUser = {};

    if (body.name) updateData.name = body.name;
    if (body.phone_number) updateData.phone_number = body.phone_number;

    try {
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