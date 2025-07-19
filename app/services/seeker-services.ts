import { errorResponse, HttpError, successResponse } from "../lib/server/commonResponse";
import { prisma } from "@/app/lib/prisma/prisma-singleton";
import { ProfileDto, profileDtoToCreateData, profileDtoToUpdateData } from "@/types/profile";

export async function getSeekerProfile(userId: number) {
    const user = await prisma.users.findUnique({
        where: { id: userId }
    });
    if (!user) {
        throw new HttpError("User not found", 404);
    }

    const profile = await prisma.applicant_profiles.findFirst({
        where: {
            user_id: userId
            , deleted_at: null
        }, include: {
            skills_applicant_profiles_skill_id1Toskills: true,
            skills_applicant_profiles_skill_id2Toskills: true,
            skills_applicant_profiles_skill_id3Toskills: true
        }
    });
    if (!profile) {
        throw new HttpError("Seeker profile not found", 404);
    }

    return profile;
}

export async function upsertSeekerProfile(userId: number, body: ProfileDto) {
    const user = await prisma.users.findUnique({
        where: { id: userId }
    });

    if (!user) {
        throw new HttpError("User not found", 404);
    }

    const profile = await prisma.applicant_profiles.findFirst({
        where: { user_id: userId, deleted_at: null },
    });

    if (profile) {
        const updated = await prisma.applicant_profiles.update({
            where: { id: profile.id },
            data: profileDtoToUpdateData(body),
        });
        return { profile: updated, created: false };
    } else {
        const created = await prisma.applicant_profiles.create({
            data: {
                ...profileDtoToCreateData(body, userId.toString()),
            },
        });
        return { profile: created, created: true };
    }
}

export async function deleteSeekerProfile(userId: number) {
    const user = await prisma.users.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new HttpError("User not found", 404);
    }

    const profile = await prisma.applicant_profiles.findFirst({
        where: {
            user_id: userId,
            deleted_at: null,
        },
    });

    if (!profile) {
        throw new HttpError("Profile not found", 404);
    }

    const updated = await prisma.applicant_profiles.update({
        where: { id: profile.id },
        data: {
            deleted_at: new Date(),
        },
    });

    return updated;
}