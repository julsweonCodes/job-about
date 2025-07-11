import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';

export type ProfileDto = Prisma.applicant_profilesCreateInput & {
    skill_id1: string;
    skill_id2?: string;
    skill_id3?: string;
    work_experiences?: Prisma.work_experiencesCreateWithoutProfileInput[];
};

export function profileDtoToUpdateData(body: ProfileDto): Prisma.applicant_profilesUpdateInput {
    const data: Prisma.applicant_profilesUpdateInput = {
        updated_at: new Date(),
    };

    data.work_type = body.work_type;
    data.job_type1 = body.job_type1;
    data.skills_applicant_profiles_skill_id1Toskills = { connect: { id: BigInt(body.skill_id1) } };
    data.available_day = body.available_day;
    data.available_hour = body.available_hour;
    data.location = body.location;
    data.language_level = body.language_level;
    data.description = body.description;

    //optional
    if (body.job_type2) data.job_type2 = body.job_type2;
    if (body.job_type3) data.job_type3 = body.job_type3;
    if (body.skill_id2)
        data.skills_applicant_profiles_skill_id2Toskills = { connect: { id: BigInt(body.skill_id2) } };
    if (body.skill_id3)
        data.skills_applicant_profiles_skill_id3Toskills = { connect: { id: BigInt(body.skill_id3) } };

    return data;
}

export function profileDtoToCreateData(
    dto: ProfileDto,
    userId: number | string
): Prisma.applicant_profilesCreateInput {
    const {
        skill_id1,
        skill_id2,
        skill_id3,
        work_experiences,
        ...rest
    } = dto;

    return {
        ...rest,
        user: { connect: { id: BigInt(userId) } },
        skills_applicant_profiles_skill_id1Toskills: { connect: { id: BigInt(skill_id1) } },
        ...(skill_id2 && { skills_applicant_profiles_skill_id2Toskills: { connect: { id: BigInt(skill_id2) } } }),
        ...(skill_id3 && { skills_applicant_profiles_skill_id3Toskills: { connect: { id: BigInt(skill_id3) } } }),
        ...(work_experiences && work_experiences.length > 0 ? {
            work_experiences: {
                create: work_experiences.map((exp) => ({
                    ...exp,
                    start_date: exp.start_date,
                    end_date: exp.end_date,
                    created_at: new Date(),
                    updated_at: new Date()

                })),
            },
        } : {}),
        created_at: new Date(),
        updated_at: new Date(),
    };
};