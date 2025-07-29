import {
  AvailableDay,
  AvailableHour,
  JobType,
  LanguageLevel,
  Location,
  Prisma,
  WorkType,
} from "@prisma/client";
import {
  toPrismaJobType,
  toPrismaWorkType,
  toPrismaAvailableDay,
  toPrismaAvailableHour,
  toPrismaLocation,
  toPrismaLanguageLevel,
  fromPrismaJobType,
  fromPrismaWorkType,
  fromPrismaAvailableDay,
  fromPrismaAvailableHour,
  fromPrismaLocation,
  fromPrismaLanguageLevel,
  fromPrismaWorkPeriod,
  toPrismaWorkPeriod,
} from "@/types/enumMapper";
import { JobType as ClientJobType } from "@/constants/jobTypes";
import {
  WorkType as ClientWorkType,
  AvailableDay as ClientAvailableDay,
  AvailableHour as ClientAvailableHour,
  LanguageLevel as ClientLanguageLevel,
  WorkPeriod as ClientWorkPeriod,
} from "@/constants/enums";
import { Location as ClientLocation } from "@/constants/location";

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
  profile_practical_skills: profile_practical_skill[];
  work_experiences: workExperience[];
}

export interface updateApplicantProfile {
  job_type1?: JobType;
  job_type2?: JobType;
  job_type3?: JobType;
  work_type?: WorkType;
  available_day?: AvailableDay;
  available_hour?: AvailableHour;
  location?: Location;
  language_level?: LanguageLevel;
  description?: string;
  profile_practical_skills?: profile_practical_skill[];
  work_experiences?: workExperience[];
}
export interface profile_practical_skill {
  practical_skill_id: number;
}

export interface workExperience {
  company_name: string;
  job_type: JobType;
  start_year: string;
  work_period: ClientWorkPeriod;
  work_type: WorkType;
  description: string;
}

// 클라이언트 폼 타입
export interface ApplicantProfileFormDataType {
  preferredJobTypes: ClientJobType[];
  workType: ClientWorkType;
  availableDay: ClientAvailableDay;
  availableHour: ClientAvailableHour;
  location: ClientLocation;
  englishLevel: ClientLanguageLevel;
  description: string;
  skillIds: number[];
  experiences: {
    company: string;
    jobType: ClientJobType;
    startYear: string;
    workPeriod: ClientWorkPeriod;
    workType: ClientWorkType;
    description: string;
  }[];
}

// 매퍼 클래스 패턴
export class ApplicantProfileMapper {
  /**
   * 클라이언트 폼 데이터를 API 요청 데이터로 변환
   */
  static toApi(formData: ApplicantProfileFormDataType): applicantProfile {
    return {
      job_type1: toPrismaJobType(formData.preferredJobTypes[0] as any),
      job_type2: formData.preferredJobTypes[1]
        ? toPrismaJobType(formData.preferredJobTypes[1] as any)
        : undefined,
      job_type3: formData.preferredJobTypes[2]
        ? toPrismaJobType(formData.preferredJobTypes[2] as any)
        : undefined,
      work_type: toPrismaWorkType(formData.workType as any),
      available_day: toPrismaAvailableDay(formData.availableDay as any),
      available_hour: toPrismaAvailableHour(formData.availableHour as any),
      location: toPrismaLocation((formData.location as any) ?? "") as Location,
      language_level: toPrismaLanguageLevel(formData.englishLevel as any),
      description: formData.description,
      profile_practical_skills: formData.skillIds.map((skillId) => ({
        practical_skill_id: skillId,
      })),
      work_experiences: formData.experiences.map((exp) => ({
        company_name: exp.company,
        job_type: toPrismaJobType(exp.jobType as any),
        start_year: exp.startYear,
        start_date: new Date(exp.startYear + "-01-01"), // 임시로 start_date 추가
        work_period: toPrismaWorkPeriod(exp.workPeriod as any) as ClientWorkPeriod,
        work_type: toPrismaWorkType(exp.workType as any),
        description: exp.description,
      })),
    };
  }

  /**
   * API 응답 데이터를 클라이언트 폼 데이터로 변환
   */
  static fromApi(apiData: applicantProfile): ApplicantProfileFormDataType {
    const preferredJobTypes = [
      fromPrismaJobType(apiData.job_type1) as ClientJobType,
      apiData.job_type2 ? (fromPrismaJobType(apiData.job_type2) as ClientJobType) : undefined,
      apiData.job_type3 ? (fromPrismaJobType(apiData.job_type3) as ClientJobType) : undefined,
    ].filter((jt): jt is ClientJobType => !!jt);

    return {
      preferredJobTypes,
      workType: fromPrismaWorkType(apiData.work_type) as ClientWorkType,
      availableDay: fromPrismaAvailableDay(apiData.available_day) as ClientAvailableDay,
      availableHour: fromPrismaAvailableHour(apiData.available_hour) as ClientAvailableHour,
      location: fromPrismaLocation(apiData.location as any) as ClientLocation,
      englishLevel: fromPrismaLanguageLevel(apiData.language_level) as ClientLanguageLevel,
      description: apiData.description,
      skillIds: apiData.profile_practical_skills?.map((skill) => skill.practical_skill_id) || [],
      experiences:
        apiData.work_experiences?.map((exp) => ({
          company: exp.company_name,
          jobType: fromPrismaJobType(exp.job_type) as ClientJobType,
          startYear: exp.start_year,
          workPeriod: fromPrismaWorkPeriod(exp.work_period) as ClientWorkPeriod,
          workType: fromPrismaWorkType(exp.work_type) as ClientWorkType,
          description: exp.description,
        })) || [],
    };
  }

  /**
   * 데이터 검증
   */
  static validate(formData: ApplicantProfileFormDataType): boolean {
    return (
      formData.preferredJobTypes.length > 0 &&
      !!formData.workType &&
      !!formData.availableDay &&
      !!formData.availableHour &&
      !!formData.location &&
      !!formData.englishLevel &&
      !!formData.description
    );
  }

  /**
   * 기본값으로 초기화
   */
  static createDefault(): ApplicantProfileFormDataType {
    return {
      preferredJobTypes: [],
      workType: "remote" as ClientWorkType,
      availableDay: "weekdays" as ClientAvailableDay,
      availableHour: "am" as ClientAvailableHour,
      location: "toronto" as ClientLocation,
      englishLevel: "beginner" as ClientLanguageLevel,
      description: "",
      skillIds: [],
      experiences: [],
    };
  }
}

export function toApplicantProfileCreate(
  body: applicantProfile,
  userId: string
): Prisma.applicant_profilesCreateInput {
  const { profile_practical_skills, work_experiences, ...rest } = body;

  return {
    ...rest,
    user: { connect: { id: BigInt(userId) } },
    ...(profile_practical_skills && profile_practical_skills.length > 0
      ? {
          profile_practical_skills: {
            create: profile_practical_skills.map((skill) => ({
              practical_skill_id: skill.practical_skill_id,
              created_at: new Date(),
            })),
          },
        }
      : {}),
    ...(work_experiences && work_experiences.length > 0
      ? {
          work_experiences: {
            create: work_experiences.map((exp) => ({
              ...exp,
              start_year: exp.start_year,
              start_date: new Date(exp.start_year + "-01-01"),
              work_period: exp.work_period,
              created_at: new Date(),
              updated_at: new Date(),
            })),
          },
        }
      : {}),
    created_at: new Date(),
    updated_at: new Date(),
  };
}

export interface Skill {
  id: number;
  category_ko: string;
  category_en: string;
  name_ko: string;
  name_en: string;
}

export interface WorkStyle {
  id: number;
  name_ko: string;
  name_en: string;
}
