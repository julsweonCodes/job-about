import { prisma } from '@/app/lib/prisma/prisma-singleton';
import { errorResponse, successResponse } from '@/app/lib/server/commonResponse';
import { parseBigInt } from '@/app/lib/server/utils';
import { ProfileDto, profileDtoToCreateData, profileDtoToUpdateData } from '@/types/profile';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest,
    { params: { userId } }: { params: { userId: string } }) => {
    try {
        const user = await prisma.users.findUnique({
            where: { id: BigInt(userId) }
        });
        if (!user) {
            return errorResponse('User not found', 404);
        }

        const profile = await prisma.applicant_profiles.findFirst({
            where: {
                user_id: BigInt(userId)
                , deleted_at: null
            }
        });

        return successResponse(parseBigInt(profile), 200, 'Profile fetched');
    }
    catch (err) {
        return NextResponse.json({ error: 'Failed to retrieve profiles' }, { status: 500 });
    }
};

export const PUT = async (request: NextRequest,
    { params: { userId } }: { params: { userId: string } }) => {
    const body: ProfileDto = await request.json();

    try {
        const user = await prisma.users.findUnique({
            where: { id: BigInt(userId) }
        });
        if (!user) {
            return errorResponse('User not found', 404);
        }

        const profile = await prisma.applicant_profiles.findFirst({
            where: { user_id: BigInt(userId) },
        });

        if (profile) {
            const updated = await prisma.applicant_profiles.update({
                where: { id: profile.id },
                data: profileDtoToUpdateData(body)
            });
            return successResponse(parseBigInt(updated), 200, 'Profile updated');
        } else {
            const created = await prisma.applicant_profiles.create({
                data: {
                    ...profileDtoToCreateData(body, userId)
                },
            });

            return successResponse(parseBigInt(created), 201, 'Profile created');
        }
    } catch (err) {
        console.log(err);
        return errorResponse('Failed to upsert applicant profile', 500);
    }
};

export const DELETE = async (request: NextRequest,
    { params: { userId } }: { params: { userId: string } }) => {
    try {
        const user = await prisma.users.findUnique({
            where: { id: BigInt(userId) }
        });
        if (!user) {
            return errorResponse('User not found', 404);
        }

        const profile = await prisma.applicant_profiles.findFirst({
            where: {
                user_id: BigInt(userId)
            }
        });
        if (!profile) {
            return errorResponse('Profile not found', 404);
        }

        const updated = await prisma.applicant_profiles.update({
            where: { id: profile.id },
            data: {
                deleted_at: new Date()
            },
        });

        return successResponse(parseBigInt(updated), 200, 'Profile deleted');
    } catch (err) {
        return errorResponse('Failed to delete applicant profile', 500);
    }

}