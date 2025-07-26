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
} from "@/types/enumMapper";
import { JobType as ClientJobType } from "@/constants/jobTypes";
import {
  WorkType as ClientWorkType,
  AvailableDay as ClientAvailableDay,
  AvailableHour as ClientAvailableHour,
  LanguageLevel as ClientLanguageLevel,
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

// 클라이언트 폼 타입
export interface ApplicantProfileFormDataType {
  preferredJobTypes: ClientJobType[];
  workType: ClientWorkType;
  availableDays: ClientAvailableDay[];
  availableHours: ClientAvailableHour[];
  location: ClientLocation;
  englishLevel: ClientLanguageLevel;
  description: string;
  experiences: {
    company: string;
    jobType: ClientJobType;
    startDate: Date;
    endDate: Date;
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
      available_day: toPrismaAvailableDay(formData.availableDays[0] as any),
      available_hour: toPrismaAvailableHour(formData.availableHours[0] as any),
      location: toPrismaLocation((formData.location as any) ?? "") as Location,
      language_level: toPrismaLanguageLevel(formData.englishLevel as any),
      description: formData.description,
      work_experiences: formData.experiences.map((exp) => ({
        company_name: exp.company,
        job_type: toPrismaJobType(exp.jobType as any),
        start_date: exp.startDate,
        end_date: exp.endDate,
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
      availableDays: [fromPrismaAvailableDay(apiData.available_day) as ClientAvailableDay],
      availableHours: [fromPrismaAvailableHour(apiData.available_hour) as ClientAvailableHour],
      location: fromPrismaLocation(apiData.location as any) as ClientLocation,
      englishLevel: fromPrismaLanguageLevel(apiData.language_level) as ClientLanguageLevel,
      description: apiData.description,
      experiences:
        apiData.work_experiences?.map((exp) => ({
          company: exp.company_name,
          jobType: fromPrismaJobType(exp.job_type) as ClientJobType,
          startDate: exp.start_date,
          endDate: exp.end_date,
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
      formData.availableDays.length > 0 &&
      formData.availableHours.length > 0 &&
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
      availableDays: ["weekdays"] as ClientAvailableDay[],
      availableHours: ["am"] as ClientAvailableHour[],
      location: "toronto" as ClientLocation,
      englishLevel: "beginner" as ClientLanguageLevel,
      description: "",
      experiences: [],
    };
  }
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
  const { work_experiences, ...rest } = body;

  return {
    ...rest,
    user: { connect: { id: BigInt(userId) } },
    ...(work_experiences && work_experiences.length > 0
      ? {
          work_experiences: {
            create: work_experiences.map((exp) => ({
              ...exp,
              start_date: exp.start_date,
              end_date: exp.end_date,
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
