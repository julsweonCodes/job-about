import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGetData, apiPatchData } from "@/utils/client/API";
import { API_URLS } from "@/constants/api";
import { showErrorToast, showSuccessToast } from "@/utils/client/toastUtils";
import { useAuthStore } from "@/stores/useAuthStore";

// Types
export interface UserInfo {
  name: string;
  description: string;
  phone_number: string;
  img_url?: string;
  created_at: Date;
}

export interface PersonalityProfile {
  id: number;
  name_ko: string;
  name_en: string;
  description_ko: string;
  description_en: string;
}

export interface ApplicantProfileMain {
  personalityName: string;
  personalityDesc: string;
}

// API Functions
const fetchPersonalityProfile = async (): Promise<PersonalityProfile> => {
  try {
    const profileData = await apiGetData<PersonalityProfile | null>(API_URLS.QUIZ.MY_PROFILE);

    if (profileData) {
      return profileData;
    } else {
      // Fallback to dummy data
      return {
        id: 3,
        name_ko: "공감형 코디네이터",
        name_en: "Empathetic Coordinator",
        description_ko:
          "사람들과의 협업과 소통에서 에너지를 얻습니다. 특히 고객의 감정을 잘 파악하고 긍정적인 관계를 맺는 데 강점이 있습니다.",
        description_en:
          "Gains energy from collaboration and communication. Excellent at understanding customer emotions and building positive relationships.",
      };
    }
  } catch (error) {
    console.error("Error fetching personality profile:", error);
    showErrorToast("Failed to load personality profile");
    // Fallback to dummy data
    return {
      id: 3,
      name_ko: "공감형 코디네이터",
      name_en: "Empathetic Coordinator",
      description_ko:
        "사람들과의 협업과 소통에서 에너지를 얻습니다. 특히 고객의 감정을 잘 파악하고 긍정적인 관계를 맺는 데 강점이 있습니다.",
      description_en:
        "Gains energy from collaboration and communication. Excellent at understanding customer emotions and building positive relationships.",
    };
  }
};

// React Query Hooks
export const usePersonalityProfile = () => {
  return useQuery({
    queryKey: ["personality-profile"],
    queryFn: fetchPersonalityProfile,
    staleTime: 10 * 60 * 1000, // 10분간 신선한 데이터 (성향 데이터는 자주 변경되지 않음)
    gcTime: 30 * 60 * 1000, // 30분간 캐시 유지
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Mutation hooks
export const useUpdateProfileImageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("img", file);
      const result = await apiPatchData(API_URLS.USER.UPDATE_PROFILE_IMAGE, formData);
      return result;
    },
    onSuccess: (result) => {
      if (result && result.img_url !== undefined) {
        // Update auth store
        const { setAppUser } = useAuthStore.getState();
        const currentAppUser = useAuthStore.getState().appUser;
        if (currentAppUser) {
          setAppUser({
            ...currentAppUser,
            img_url: result.img_url,
          });
        }
        showSuccessToast("Profile image updated successfully");
      }
    },
    onError: (error) => {
      console.error("Error updating profile image:", error);
      showErrorToast("Failed to update profile image");
    },
  });
};

export const useUpdateUserProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: { name: string; phone_number: string }) => {
      const response = await apiPatchData(API_URLS.USER.UPDATE, userData);
      return response;
    },
    onSuccess: (result, variables) => {
      // Update auth store
      const { setAppUser } = useAuthStore.getState();
      const currentAppUser = useAuthStore.getState().appUser;
      if (currentAppUser) {
        setAppUser({
          ...currentAppUser,
          name: variables.name,
          phone_number: variables.phone_number,
        });
      }
      showSuccessToast("Profile updated successfully");
    },
    onError: (error) => {
      console.error("Error updating user profile:", error);
      showErrorToast("Failed to update profile");
    },
  });
};

// Combined hook for mypage data
export const useSeekerMypageQueries = () => {
  const { appUser } = useAuthStore();
  const personalityQuery = usePersonalityProfile();
  const updateProfileImage = useUpdateProfileImageMutation();
  const updateUserProfile = useUpdateUserProfileMutation();

  // Transform personality data
  const applicantProfile: ApplicantProfileMain = {
    personalityName: personalityQuery.data?.name_en || "",
    personalityDesc: personalityQuery.data?.description_en || "",
  };

  // User info from auth store
  const userInfo: UserInfo | null = appUser
    ? {
        name: appUser.name || "",
        description: appUser.description || "",
        phone_number: appUser.phone_number || "",
        img_url: appUser.img_url || undefined,
        created_at: appUser.created_at ? new Date(appUser.created_at) : new Date(),
      }
    : null;

  return {
    // Data
    userInfo,
    applicantProfile,
    personalityProfile: personalityQuery.data,

    // Loading states
    isLoading: personalityQuery.isLoading,
    isError: personalityQuery.isError,
    error: personalityQuery.error,

    // Mutations
    updateProfileImage,
    updateUserProfile,
  };
};
