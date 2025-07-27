import { JobStatus, LanguageLevel } from "@/constants/enums";
import { JobType } from "@/constants/jobTypes";
import { $Enums } from "@prisma/client";
import { Skill, WorkStyle } from "@/types/profile";

export interface JobPostData {
  id: string;
  title: string;
  jobType: JobType;
  status: JobStatus;
  businessLocInfo: BizLocInfo;
  deadline: string;
  schedule: string;
  requiredSkills: Skill[];
  requiredWorkStyles: WorkStyle[];
  languageLevel?: LanguageLevel;
  hourlyWage: string;
  jobDescription: string;
}

export interface BizLocInfo {
  bizLocId: string;
  name: string;
  bizDescription: string;
  logoImg: string;
  extraPhotos: string[];
  location: string;
  tags?: string[];
}