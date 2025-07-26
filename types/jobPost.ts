import { JobStatus, LanguageLevel } from "@/constants/enums";
import { JobType } from "@/constants/jobTypes";

export interface JobPostData {
  id: string;
  title: string;
  jobType: JobType;
  status: JobStatus;
  business: {
    id: string;
    name: string;
    description: string;
    photos: string[];
    location: string;
    tags: string[];
  };
  deadline: string;
  schedule: string;
  requiredSkills: string[];
  requiredPersonality: string[];
  languageLevel: LanguageLevel;
  hourlyWage: string;
  description: string;
}
