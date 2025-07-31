import { HttpError } from "../lib/server/commonResponse";
import { prisma } from "@/app/lib/prisma/prisma-singleton";
import {
  applicantProfile,
  toApplicantProfileCreate,
  updateApplicantProfile,
} from "@/types/profile";

export async function getSeekerProfile(userId: string | number) {
  const userIdBigInt = BigInt(userId);

  const user = await prisma.users.findUnique({
    where: { id: userIdBigInt },
  });
  if (!user) {
    throw new HttpError("User not found", 404);
  }

  const profile = await prisma.applicant_profiles.findFirst({
    where: {
      user_id: userIdBigInt,
      deleted_at: null,
    },
    include: {
      work_experiences: true,
      profile_practical_skills: true,
    },
  });
  if (!profile) {
    throw new HttpError("Seeker profile not found", 404);
  }

  return profile;
}

export async function createSeekerProfile(userId: number, body: applicantProfile) {
  const user = await prisma.users.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new HttpError("User not found", 404);
  }

  const profile = await prisma.applicant_profiles.findFirst({
    where: { user_id: userId, deleted_at: null },
  });

  if (profile) {
    throw new HttpError("Seeker profile already exists", 409);
  } else {
    const created = await prisma.applicant_profiles.create({
      data: {
        ...toApplicantProfileCreate(body, userId.toString()),
      },
      include: {
        profile_practical_skills: {
          include: {
            practical_skill: true,
          },
        },
        work_experiences: true,
      },
    });
    return created;
  }
}

export async function updateSeekerProfile(userId: number, body: updateApplicantProfile) {
  const user = await prisma.users.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new HttpError("User not found", 404);
  }

  const profile = await prisma.applicant_profiles.findFirst({
    where: { user_id: userId, deleted_at: null },
  });

  if (profile) {
    const { profile_practical_skills, work_experiences } = body;
    let updated;

    // 조인 속성의 경우
    if (profile_practical_skills) {
      const [, updatedProfile] = await prisma.$transaction([
        prisma.profile_practical_skills.deleteMany({
          where: { profile_id: profile.id },
        }), prisma.applicant_profiles.update({
          where: { id: profile.id, deleted_at: null },
          data: {
            profile_practical_skills: {
              create: profile_practical_skills.map((skill) => ({
                practical_skill_id: Number(skill.practical_skill_id),
                created_at: new Date(),
              })),
            },
          },
          include: {
            profile_practical_skills: {
              include: {
                practical_skill: true,
              },
            },
            work_experiences: true,
          },
        }),
      ]);

      updated = updatedProfile;
    } else if (work_experiences) {
      const [, updatedProfile] = await prisma.$transaction([
        prisma.work_experiences.deleteMany({
          where: { profile_id: profile.id },
        }),
        prisma.applicant_profiles.update({
          where: { id: profile.id, deleted_at: null },
          data: {
            work_experiences: {
              create: work_experiences.map(
                (exp) =>
                  ({
                    ...exp,
                    start_year: exp.start_year,
                    work_period: exp.work_period,
                    created_at: new Date(),
                    updated_at: new Date(),
                  }) as any
              ),
            },
          },
          include: {
            profile_practical_skills: {
              include: {
                practical_skill: true,
              },
            },
            work_experiences: true,
          },
        }),
      ]);
      updated = updatedProfile
    } else {
      // 비조인 속성인 경우
      const filtered = Object.fromEntries(
        Object.entries(body).filter(([_, value]) => value !== undefined)
      );

      updated = await prisma.applicant_profiles.update({
        where: { id: profile.id, deleted_at: null },
        data: filtered,
        include: {
          profile_practical_skills: {
            include: {
              practical_skill: true,
            },
          },
          work_experiences: true,
        },
      });
    }

    return updated;
  } else {
    throw new HttpError("Seeker profile not found", 404);
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
    where: { id: profile.id, deleted_at: null },
    data: {
      deleted_at: new Date(),
    },
  });

  return updated;
}
