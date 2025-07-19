import { errorResponse, HttpError, successResponse } from "@/app/lib/server/commonResponse";
import { getEnumValues } from "@/app/services/enum-services";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {

    const { searchParams } = new URL(request.url);
    const enumName = searchParams.get('name');

    if (!enumName) {
        return errorResponse('typeName was not provided.', 400);
    }

    try {
        const values = await getEnumValues(enumName);
        return successResponse(values, 201, 'Enum fetched');
    }
    catch (err: any) {
        if (err instanceof HttpError) {
            return errorResponse(err.message, err.status);
        }
        console.error(err);
        return errorResponse("Internal server error", 500);
    }
};