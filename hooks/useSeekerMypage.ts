import { useState, useEffect } from "react";
import { API_URLS } from "@/constants/api";
import { showErrorToast, showSuccessToast } from "@/utils/client/toastUtils";
import { useAuthStore } from "@/stores/useAuthStore";
import { applicantProfile, ApplicantProfileMapper, Skill } from "@/types/profile";
import { convertLocationKeyToValue } from "@/constants/location";
import { apiGet, apiPatch } from "@/utils/client/API";

export interface UserInfo {
  name: string;
  description: string;
  phone_number: string;
  img_url?: string;
  created_at: Date;
}

export interface Personality {
  name_ko: string;
  name_en: string;
  description_ko: string;
  description_en: string;
}

export interface ApplicantProfile {
  name: string;
  description: string;
  joinDate: string;
  personalityName: string;
  personalityDesc: string;
  location: string;
  phone: string;
  skillIds: number[]; // skills를 skillIds로 변경
  workType: string;
  jobTypes: string[];
  availabilityDay: string; // availabilityDays에서 availabilityDay로 변경
  availabilityTime: string; // availabilityTimes에서 availabilityTime으로 변경
  englishLevel: string;
  experiences: {
    company: string;
    jobType: string;
    startYear: string;
    workedPeriod: string;
    workType: string;
    description: string;
  }[];
}

const dummyPersonalityData = {
  id: 3,
  name_ko: "공감형 코디네이터",
  name_en: "Empathetic Coordinator",
  description_ko:
    "사람들과의 협업과 소통에서 에너지를 얻습니다. 특히 고객의 감정을 잘 파악하고 긍정적인 관계를 맺는 데 강점이 있습니다.",
  description_en:
    "Gains energy from collaboration and communication. Excellent at understanding customer emotions and building positive relationships.",
};

interface UseSeekerMypageReturn {
  // 상태
  userInfo: UserInfo | null;
  seekerProfile: applicantProfile | null;
  applicantProfile: ApplicantProfile;
  tempData: ApplicantProfile;
  isInitialized: boolean;
  isLoading: boolean;

  // API 데이터 상태
  availableSkills: Skill[]; // string[]에서 Skill[]로 변경
  availableLocations: string[];
  loadingStates: {
    skills: boolean;
    locations: boolean;
  };

  // 편집 상태
  isEditing: {
    basicInfo: boolean;
    contact: boolean;
    location: boolean;
    skills: boolean;
    workType: boolean;
    jobTypes: boolean;
    availability: boolean;
    languages: boolean;
  };

  // 액션
  setUserInfo: (userInfo: UserInfo | null) => void;
  setSeekerProfile: (profile: applicantProfile | null) => void;
  setApplicantProfile: (profile: ApplicantProfile) => void;
  setTempData: (data: ApplicantProfile) => void;
  setIsEditing: (section: string, value: boolean) => void;
  handleEdit: (section: string) => void;
  handleCancel: (section: string) => void;
  handleTempInputChange: (field: string, value: string) => void;
  updateUserProfile: () => Promise<void>;
  updateProfileImage: (file: File) => Promise<void>;

  // API 데이터 fetch 함수들
  fetchSkills: () => Promise<void>;
  fetchLocations: () => Promise<void>;
}

export const useSeekerMypage = (): UseSeekerMypageReturn => {
  // Auth Store에서 사용자 정보 가져오기
  const { supabaseUser: authUser, appUser } = useAuthStore();

  // 상태 관리
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [seekerPersonality, setSeekerPersonality] = useState<Personality | null>(null);
  const [seekerProfile, setSeekerProfile] = useState<applicantProfile | null>(null);
  const [applicantProfile, setApplicantProfile] = useState<ApplicantProfile>({
    name: "",
    description: "",
    joinDate: "",
    personalityName: "",
    personalityDesc: "",
    location: "",
    phone: "",
    skillIds: [],
    workType: "",
    jobTypes: [],
    availabilityDay: "",
    availabilityTime: "",
    englishLevel: "",
    experiences: [],
  });
  const [tempData, setTempData] = useState<ApplicantProfile>(applicantProfile);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // API 데이터 상태
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [loadingStates, setLoadingStates] = useState({
    skills: false,
    locations: false,
  });

  // 편집 상태 관리
  const [isEditing, setIsEditingState] = useState({
    basicInfo: false,
    contact: false,
    location: false,
    skills: false,
    workType: false,
    jobTypes: false,
    availability: false,
    languages: false,
  });

  // API 데이터 fetch 함수들
  const fetchSkills = async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, skills: true }));
      const data = await apiGet(API_URLS.UTILS);

      if (data.status === "success") {
        setAvailableSkills(data.data.skills);
      } else {
        console.error("Failed to fetch skills:", data.error);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, skills: false }));
    }
  };

  const fetchLocations = async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, locations: true }));
      const data = await apiGet(API_URLS.ENUM.BY_NAME("Location"));

      if (data.status === "success") {
        const locationsData = data.data?.values || data.values || [];
        if (Array.isArray(locationsData)) {
          const convertedCities = locationsData.map(convertLocationKeyToValue);
          setAvailableLocations(convertedCities);
        } else {
          setAvailableLocations([]);
        }
      } else {
        console.error("Failed to fetch locations:", data.error);
        setAvailableLocations([]);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, locations: false }));
    }
  };

  // 컴포넌트 마운트 시 API 데이터 로드
  useEffect(() => {
    fetchSkills();
    fetchLocations();
  }, []);

  // 데이터 초기화
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);

        // AuthProvider에서 이미 설정된 사용자 정보가 있으면 활용
        if (authUser && appUser) {
          const userInfoData = {
            name: appUser.name || authUser.email || "",
            description: "", // AppUser에는 description이 없으므로 빈 문자열
            phone_number: "", // AppUser에는 phone_number가 없으므로 빈 문자열
            img_url: appUser.img_url || undefined,
            created_at: new Date(appUser.created_at || Date.now()),
          };
          setUserInfo(userInfoData);
        } else {
          // AuthProvider에서 정보가 없으면 API 호출
          const userData = await apiGet(API_URLS.USER.ME);
          if (userData.status === "success" && userData.data) {
            setUserInfo(userData.data.user);
          }
        }

        // Seeker Personality 정보 가져오기
        let PersonalityData = await apiGet(API_URLS.QUIZ.MY_PROFILE);

        if (PersonalityData.status === "success" && PersonalityData.data) {
          setSeekerPersonality(PersonalityData.data);
        } else {
          setSeekerPersonality(dummyPersonalityData);
        }

        // Seeker Profile 정보 가져오기
        let profileData = await apiGet(API_URLS.SEEKER.PROFILES);

        if (profileData.status === "success" && profileData.data) {
          setSeekerProfile(profileData.data);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        showErrorToast("Failed to fetch initial data");
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [authUser, appUser]);

  // 데이터 변환 및 초기화
  useEffect(() => {
    if (userInfo && seekerPersonality) {
      // seekerProfile이 없어도 기본 정보로 초기화
      const profile: ApplicantProfile = {
        name: userInfo.name || "",
        description: userInfo.description || "",
        joinDate: new Date(userInfo.created_at).toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
        personalityName: seekerPersonality.name_en,
        personalityDesc: seekerPersonality.description_en,
        location: "", // 기본값
        phone: userInfo.phone_number || "",
        skillIds: [],
        workType: "",
        jobTypes: [],
        availabilityDay: "",
        availabilityTime: "",
        englishLevel: "",
        experiences: [],
      };

      // seekerProfile이 있으면 데이터로 업데이트
      if (seekerProfile) {
        try {
          const formData = ApplicantProfileMapper.fromApi(seekerProfile);
          console.log("🔍 Seeker Profile Data:", seekerProfile);
          console.log("🔍 Mapped Form Data:", formData);
          console.log("🔍 Skill IDs:", formData.skillIds);

          profile.location = formData.location;
          profile.skillIds = formData.skillIds;
          profile.workType = formData.workType;
          profile.jobTypes = formData.preferredJobTypes;
          profile.availabilityDay = formData.availableDay;
          profile.availabilityTime = formData.availableHour;
          profile.englishLevel = formData.englishLevel;
          profile.description = formData.description;
          profile.experiences = formData.experiences.map((exp: any) => ({
            company: exp.company,
            jobType: exp.jobType,
            startYear: exp.startYear,
            workedPeriod: exp.workPeriod,
            workType: exp.workType,
            description: exp.description,
          }));
        } catch (error) {
          console.error("Error parsing seeker profile:", error);
        }
      }

      setApplicantProfile(profile);
      setTempData(profile);
      setIsInitialized(true);
    }
  }, [userInfo, seekerPersonality, seekerProfile]);

  // 임시 데이터 동기화
  useEffect(() => {
    if (applicantProfile) {
      setTempData(applicantProfile);
    }
  }, [applicantProfile]);

  // 액션 함수들
  const setIsEditing = (section: string, value: boolean) => {
    setIsEditingState((prev) => ({ ...prev, [section]: value }));
  };

  const handleEdit = (section: string) => {
    setTempData(applicantProfile);
    setIsEditing(section, true);
  };

  const handleCancel = (section: string) => {
    setTempData(applicantProfile);
    setIsEditing(section, false);
  };

  const handleTempInputChange = (field: string, value: string) => {
    setTempData((prev) => ({ ...prev, [field]: value }));
  };

  const updateUserProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("name", tempData.name);
      formData.append("description", tempData.description);

      const response = await apiPatch(API_URLS.USER.UPDATE, formData);

      if (response.status === "success") {
        setApplicantProfile(tempData);
        showSuccessToast("Profile updated successfully!");
      } else {
        showErrorToast("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showErrorToast("Failed to update profile");
    }
  };

  const updateProfileImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("img", file);

      const result = await apiPatch(API_URLS.USER.UPDATE, formData);

      if (result.data && result.data.img_url !== undefined) {
        // AuthStore 업데이트 - 더 안전한 방식
        const authStore = useAuthStore.getState();
        authStore.updateProfileImage(result.data.img_url);
        showSuccessToast("Profile image updated!");
      } else {
        showErrorToast("Failed to update profile image");
      }
    } catch (error) {
      console.error("Error updating profile image:", error);
      showErrorToast("Failed to update profile image");
    }
  };

  return {
    // 상태
    userInfo,
    seekerProfile,
    applicantProfile,
    tempData,
    isInitialized,
    isLoading,
    isEditing,

    // API 데이터 상태
    availableSkills,
    availableLocations,
    loadingStates,

    // 액션
    setUserInfo,
    setSeekerProfile,
    setApplicantProfile,
    setTempData,
    setIsEditing,
    handleEdit,
    handleCancel,
    handleTempInputChange,
    updateUserProfile,
    updateProfileImage,

    // API 데이터 fetch 함수들
    fetchSkills,
    fetchLocations,
  };
};
