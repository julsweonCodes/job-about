import { useState, useEffect } from "react";
import { API_URLS } from "@/constants/api";
import { showErrorToast, showSuccessToast } from "@/utils/client/toastUtils";
import { useAuthStore } from "@/stores/useAuthStore";
import { applicantProfile, ApplicantProfileMapper } from "@/types/profile";

export interface UserInfo {
  name: string;
  description: string;
  phone_number: string;
  img_url?: string;
  created_at: Date;
}

export interface ApplicantProfile {
  name: string;
  description: string;
  profileImageUrl: string | null;
  joinDate: string;
  location: string;
  phone: string;
  skills: string[];
  workType: string;
  jobTypes: string[];
  availabilityDays: string[];
  availabilityTimes: string[];
  englishLevel: string;
  experiences: {
    title: string;
    company: string;
    duration: string;
    description?: string;
  }[];
}

// 더미 데이터
const dummySeekerProfile: applicantProfile = {
  job_type1: "SERVER",
  job_type2: "BARISTA",
  job_type3: "CASHIER",
  work_type: "REMOTE",
  available_day: "WEEKDAYS",
  available_hour: "AM",
  location: "TORONTO",
  language_level: "INTERMEDIATE",
  description: "Experienced service professional with strong customer service skills",
  work_experiences: [
    {
      company_name: "Starbucks Coffee",
      job_type: "BARISTA",
      start_date: new Date("2023-01-15"),
      end_date: new Date("2024-06-30"),
      work_type: "ON_SITE",
      description:
        "Prepared and served coffee beverages, maintained cleanliness standards, and provided excellent customer service.",
    },
    {
      company_name: "McDonald's",
      job_type: "CASHIER",
      start_date: new Date("2022-03-01"),
      end_date: new Date("2022-12-31"),
      work_type: "ON_SITE",
      description:
        "Handled cash transactions, took customer orders, and ensured customer satisfaction.",
    },
    {
      company_name: "Tim Hortons",
      job_type: "SERVER",
      start_date: new Date("2021-06-01"),
      end_date: new Date("2022-02-28"),
      work_type: "ON_SITE",
      description:
        "Served customers, maintained dining area cleanliness, and assisted with food preparation.",
    },
  ],
};

interface UseSeekerMypageReturn {
  // 상태
  userInfo: UserInfo | null;
  seekerProfile: applicantProfile | null;
  applicantProfile: ApplicantProfile;
  tempData: ApplicantProfile;
  isInitialized: boolean;
  isLoading: boolean;

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
}

export const useSeekerMypage = (): UseSeekerMypageReturn => {
  // Auth Store에서 사용자 정보 가져오기
  const { user: authUser, appUser } = useAuthStore();

  // 상태 관리
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [seekerProfile, setSeekerProfile] = useState<applicantProfile | null>(null);
  const [applicantProfile, setApplicantProfile] = useState<ApplicantProfile>({
    name: "",
    description: "",
    profileImageUrl: null,
    joinDate: "",
    location: "",
    phone: "",
    skills: [],
    workType: "",
    jobTypes: [],
    availabilityDays: [],
    availabilityTimes: [],
    englishLevel: "",
    experiences: [],
  });
  const [tempData, setTempData] = useState<ApplicantProfile>(applicantProfile);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  // 데이터 초기화
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);

        // AuthProvider에서 이미 설정된 사용자 정보가 있으면 활용
        if (authUser && appUser) {
          setUserInfo({
            name: appUser.name || authUser.email || "",
            description: "", // AppUser에는 description이 없으므로 빈 문자열
            phone_number: "", // AppUser에는 phone_number가 없으므로 빈 문자열
            img_url: appUser.img_url || undefined,
            created_at: new Date(appUser.created_at || Date.now()),
          });
        } else {
          // AuthProvider에서 정보가 없으면 API 호출
          const userRes = await fetch(API_URLS.USER.ME);
          const userData = await userRes.json();
          if (userData.status === "success" && userData.data) {
            setUserInfo(userData.data.user);
          }
        }

        // Seeker Profile 정보 가져오기
        const profileRes = await fetch(API_URLS.SEEKER.PROFILES);
        let profileData = await profileRes.json();

        // API 실패 시 더미 데이터 사용
        if (profileData.status !== "success" || !profileData.data) {
          console.log("API 실패, 더미 데이터 사용");
          console.log(dummySeekerProfile);
          profileData = { status: "success", data: dummySeekerProfile };
        }

        if (profileData.status === "success" && profileData.data) {
          setSeekerProfile(profileData.data);
        }
      } catch (error) {
        // 네트워크 에러 등에도 더미 데이터 사용
        console.log("네트워크 에러, 더미 데이터 사용:", error);
        setSeekerProfile(dummySeekerProfile);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [authUser, appUser]);

  // 데이터 변환 및 초기화
  useEffect(() => {
    if (userInfo && seekerProfile && !isInitialized) {
      // API 데이터를 폼 데이터로 변환
      const formData = ApplicantProfileMapper.fromApi(seekerProfile);

      const profile = {
        name: userInfo.name || "",
        description: userInfo.description || "",
        profileImageUrl: userInfo.img_url || null,
        joinDate: new Date(userInfo.created_at).toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
        location: formData.location,
        phone: userInfo.phone_number || "",
        skills: ["UI/UX Design", "Figma", "Prototyping", "User Research"],
        workType: formData.workType,
        jobTypes: formData.preferredJobTypes,
        availabilityDays: formData.availableDays,
        availabilityTimes: formData.availableHours,
        englishLevel: formData.englishLevel,
        experiences: formData.experiences.map((exp: any) => ({
          title: exp.jobType,
          company: exp.company,
          duration: `${new Date(exp.startDate).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })} - ${new Date(exp.endDate).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}`,
          description: exp.description,
        })),
      };

      setApplicantProfile(profile);
      setTempData(profile);
      setIsInitialized(true);
    }
  }, [userInfo, seekerProfile, isInitialized]);

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
      formData.append("phone_number", tempData.phone);

      const response = await fetch("/api/users", {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
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
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setApplicantProfile((prev) => ({
          ...prev,
          profileImageUrl: imageUrl,
        }));
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("img", file);

      const response = await fetch("/api/users", {
        method: "PATCH",
        body: formData,
      });
      const result = await response.json();

      if (result.data.img_url) {
        setApplicantProfile((prev) => ({
          ...prev,
          profileImageUrl: result.data.img_url,
        }));
      }
      showSuccessToast("Profile image updated!");
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
  };
};
