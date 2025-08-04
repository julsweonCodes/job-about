// Data fetching
export { useSeekerProfileData } from "./useSeekerProfileData";
export type { LoadingStates as DataLoadingStates } from "./useSeekerProfileData";

// Types from useSeekerProfileQueries
export type { UserInfo, ApplicantProfile } from "@/hooks/seeker/useSeekerProfileQueries";

// State management
export { useSeekerProfileState } from "./useSeekerProfileState";
export type {
  EditingStates,
  DialogStates,
  DeleteConfirmDialogState,
  LoadingStates as StateLoadingStates,
} from "./useSeekerProfileState";

// Actions
export { useSeekerProfileActions } from "./useSeekerProfileActions";

// Main hook (improved version)
export { useSeekerMypageProfileImproved as useSeekerMypageProfile } from "./useSeekerMypageProfile";
export type { UseSeekerMypageProfileImprovedReturn as UseSeekerMypageProfileReturn } from "./useSeekerMypageProfile";
