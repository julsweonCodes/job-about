import { errorResponse, HttpError, successResponse } from '@/app/lib/server/commonResponse';
import { parseBigInt } from '@/app/lib/server/utils';
import { NextRequest } from 'next/server';
import { createSeekerProfile, deleteSeekerProfile, getSeekerProfile, updateSeekerProfile } from '@/app/services/seeker-services';
import { getUserIdFromSession } from '@/utils/auth';
import { applicantProfile, updateApplicantProfile } from '@/types/profile';

export const GET = async (request: NextRequest) => {
    try {
        const userId = await getUserIdFromSession();
        if (!userId) {
            return errorResponse('User ID was not provided.', 400);
        }

        if (isNaN(userId)) {
            return errorResponse('Invalid User ID format.', 400);
        }

        const profile = await getSeekerProfile(userId);
        return successResponse(parseBigInt(profile), 201, 'Profile fetched');
    }
    catch (err: any) {
        if (err instanceof HttpError) {
            return errorResponse(err.message, err.status);
        }
        console.error(err);
        return errorResponse("Internal server error", 500);
    }
};

export const POST = async (
    request: NextRequest) => {
    try {
        const userId = await getUserIdFromSession();
        if (!userId) {
            return errorResponse('User ID was not provided.', 400);
        }

        if (isNaN(userId)) {
            return errorResponse('Invalid User ID format.', 400);
        }

        const body: applicantProfile = await request.json();
        const profile = await createSeekerProfile(userId, body);

        return successResponse(parseBigInt(profile), 200, "Profile created");

    } catch (err: any) {
        if (err instanceof HttpError) {
            return errorResponse(err.message, err.status);
        }

        console.error(err);
        return errorResponse("Internal server error", 500);
    }
};

export const PATCH = async (
    request: NextRequest) => {
    try {
        const userId = await getUserIdFromSession();
        if (!userId) {
            return errorResponse('User ID was not provided.', 400);
        }

        if (isNaN(userId)) {
            return errorResponse('Invalid User ID format.', 400);
        }

        const body: updateApplicantProfile = await request.json();
        const profile = await updateSeekerProfile(userId, body);

        return successResponse(parseBigInt(profile), 200, "Profile updated");

    } catch (err: any) {
        if (err instanceof HttpError) {
            return errorResponse(err.message, err.status);
        }

        console.error(err);
        return errorResponse("Internal server error", 500);
    }
};

export const DELETE = async (
    request: NextRequest
) => {
    try {
        const userId = await getUserIdFromSession();
        if (!userId) {
            return errorResponse('User ID was not provided.', 400);
        }

        if (isNaN(userId)) {
            return errorResponse('Invalid User ID format.', 400);
        }

        const deletedProfile = await deleteSeekerProfile(userId);
        return successResponse(parseBigInt(deletedProfile), 200, "Profile deleted");
    } catch (err: any) {
        if (err instanceof HttpError) {
            return errorResponse(err.message, err.status);
        }

        console.error(err);
        return errorResponse("Internal server error", 500);
    }
};