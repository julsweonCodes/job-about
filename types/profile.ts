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
import { Location as ClientLocation } from "@/constants/location";
import { JobType as ClientJobType } from "@/constants/jobTypes";
import {
  WorkType as ClientWorkType,
  AvailableDay as ClientAvailableDay,
  AvailableHour as ClientAvailableHour,
  LanguageLevel as ClientLanguageLevel,
  WorkPeriod as ClientWorkPeriod,
} from "@/constants/enums";
import { $Enums } from "@prisma/client";

export interface applicantProfile {
  job_type1: string;
  job_type2?: string;
  job_type3?: string;
  work_type: string;
  available_day: string;
  available_hour: string;
  location: string;
  language_level: string;
  description: string;
  profile_practical_skills: profile_practical_skill[];
  work_experiences: workExperience[];
}

export interface updateApplicantProfile {
  job_type1?: ClientJobType;
  job_type2?: ClientJobType;
  job_type3?: ClientJobType;
  work_type?: ClientWorkType;
  available_day?: ClientAvailableDay;
  available_hour?: ClientAvailableHour;
  location?: Location;
  language_level?: ClientLanguageLevel;
  description?: string;
  profile_practical_skills?: profile_practical_skill[];
  work_experiences?: workExperience[];
}
export interface profile_practical_skill {
  practical_skill_id: number;
}

export interface workExperience {
  company_name: string;
  job_type: string;
  start_year: string;
  work_period: string;
  work_type: string;
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
    // JobType 변환을 한 번에 처리
    const jobTypes = formData.preferredJobTypes.map(toPrismaJobType);

    return {
      job_type1: jobTypes[0],
      job_type2: jobTypes[1],
      job_type3: jobTypes[2],
      work_type: toPrismaWorkType(formData.workType),
      available_day: toPrismaAvailableDay(formData.availableDay),
      available_hour: toPrismaAvailableHour(formData.availableHour),
      location: toPrismaLocation(formData.location),
      language_level: toPrismaLanguageLevel(formData.englishLevel),
      description: formData.description,
      profile_practical_skills: formData.skillIds.map((skillId) => ({
        practical_skill_id: skillId,
      })),
      work_experiences: formData.experiences.map((exp) => ({
        company_name: exp.company,
        job_type: toPrismaJobType(exp.jobType),
        start_year: exp.startYear,
        work_period: toPrismaWorkPeriod(exp.workPeriod),
        work_type: toPrismaWorkType(exp.workType),
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
      skillIds: apiData.profile_practical_skills?.map((skill) => Number(skill.practical_skill_id)) || [],
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

export function toApplicantProfileCreate(body: applicantProfile, userId: string): any {
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
              company_name: exp.company_name,
              job_type: exp.job_type,
              start_year: exp.start_year,
              work_period: exp.work_period,
              work_type: exp.work_type,
              description: exp.description,
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
