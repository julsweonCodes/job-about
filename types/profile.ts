
import { AvailableDay, AvailableHour, JobType, LanguageLevel, Location, Prisma, WorkType } from '@prisma/client';
import { NextResponse } from 'next/server';

export interface applicantProfile {
    job_type1: JobType;
    job_type2?: JobType;
    job_type3?: JobType;
    work_type: WorkType;
    available_day: AvailableDay;
    available_hour: AvailableHour;
    location: Location;
    language_level: LanguageLevel;
    description: string;
    work_experiences: workExperience[];
}

export interface workExperience {
    company_name: string;
    job_type: JobType;
    start_date: Date;
    end_date: Date;
    work_type: WorkType;
    description: string;
}

export function toApplicantProfileUpdate(body: applicantProfile) {
    const data: Prisma.applicant_profilesUpdateInput = {
        updated_at: new Date(),
    };

    data.work_type = body.work_type;
    data.job_type1 = body.job_type1;
    data.available_day = body.available_day;
    data.available_hour = body.available_hour;
    data.location = body.location;
    data.language_level = body.language_level;
    data.description = body.description;

    //optional
    if (body.job_type2) data.job_type2 = body.job_type2;
    if (body.job_type3) data.job_type3 = body.job_type3;

    return data;
}

export function toApplicantProfileCreate(
    body: applicantProfile,
    userId: string
): Prisma.applicant_profilesCreateInput {
    const {
        work_experiences,
        ...rest
    } = body;

    return {
        ...rest,
        user: { connect: { id: BigInt(userId) } },
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

export interface Skill {
    id: number,
    category_ko: string,
    category_en: string,
    name_ko: string,
    name_en: string,
};

export interface WorkStyle {
    id: number,
    name_ko: string,
    name_en: string,
};