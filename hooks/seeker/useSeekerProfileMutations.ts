import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPatchData } from "@/utils/client/API";
import { API_URLS } from "@/constants/api";
import { showSuccessToast, showErrorToast } from "@/utils/client/toastUtils";

// Mutation hooks for profile updates
export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: any) => {
      const response = await apiPatchData(API_URLS.SEEKER.PROFILES, profileData);
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ["seeker-profile"] });
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      showErrorToast("Failed to update profile");
    },
  });
};

export const useUpdateUserInfoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: any) => {
      const response = await apiPatchData(API_URLS.USER.ME, userData);
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch user info
      queryClient.invalidateQueries({ queryKey: ["user-info"] });
    },
    onError: (error) => {
      console.error("Error updating user info:", error);
      showErrorToast("Failed to update user information");
    },
  });
};

export const useUpdateSkillsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (skillsData: any) => {
      const response = await apiPatchData(API_URLS.SEEKER.PROFILES, skillsData);
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ["seeker-profile"] });
    },
    onError: (error) => {
      console.error("Error updating skills:", error);
      showErrorToast("Failed to update skills");
    },
  });
};

export const useUpdateJobTypesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobTypesData: any) => {
      const response = await apiPatchData(API_URLS.SEEKER.PROFILES, jobTypesData);
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ["seeker-profile"] });
    },
    onError: (error) => {
      console.error("Error updating job types:", error);
      showErrorToast("Failed to update job types");
    },
  });
};

export const useUpdateExperiencesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (experiencesData: any) => {
      const response = await apiPatchData(API_URLS.SEEKER.PROFILES, experiencesData);
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ["seeker-profile"] });
    },
    onError: (error) => {
      console.error("Error updating experiences:", error);
      showErrorToast("Failed to update work experience");
    },
  });
};

// Combined mutation hook
export const useSeekerProfileMutations = () => {
  const updateProfile = useUpdateProfileMutation();
  const updateUserInfo = useUpdateUserInfoMutation();
  const updateSkills = useUpdateSkillsMutation();
  const updateJobTypes = useUpdateJobTypesMutation();
  const updateExperiences = useUpdateExperiencesMutation();

  return {
    updateProfile,
    updateUserInfo,
    updateSkills,
    updateJobTypes,
    updateExperiences,
  };
};
