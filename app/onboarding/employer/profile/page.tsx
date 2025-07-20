"use client";

import React, { useState } from "react";
import { CircleCheckBig, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import PhotoComponent from "@/components/ui/PhotoComponent";
import TimeRangePicker from "@/components/ui/TimeRangePicker";
import ProgressHeader from "@/components/common/ProgressHeader";
import { deleteSingleEmployerImage } from "@/app/services/employer-services";
import { Chip } from "@/components/ui/Chip";

interface EmployerFormData {
  businessName: string;
  phoneNumber: string;
  address: string;
  startTime: string;
  endTime: string;
  description: string;
  optionalTags: string[];
  logoImgs: (File | string)[];
  photos: (File | string)[];
}

function EmployerProfileHeader() {
  return (
    <div className="text-center mb-10 lg:mb-16">
      <Typography variant="headlineLg" as="h1" className="mb-4 tracking-tight">
        Create Employer Profile
      </Typography>
      <Typography
        variant="bodyMd"
        as="p"
        className="text-gray-600 lg:text-lg font-medium max-w-2xl mx-auto leading-relaxed"
      >
        Set up your business profile to attract <br /> the right candidates and streamline your
        hiring process
      </Typography>
    </div>
  );
}

function BusinessInfoSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl shadow-gray-200/40 border border-white/50 p-5 md:p-8 mb-8 lg:mb-0 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500">
      <div className="mb-8">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
          <MapPin className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        <Typography variant="headlineMd" as="h2" className="mb-2 tracking-tight">
          Business Information
        </Typography>
        <Typography variant="bodySm" as="p" className="text-gray-500 text-sm font-medium">
          Tell us about your business location and details
        </Typography>
      </div>
      {children}
    </div>
  );
}

function JobConditionsSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl shadow-gray-200/40 border border-white/50 p-5 md:p-8 mb-10 lg:mb-0 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500">
      <div className="mb-8">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-200">
          <CircleCheckBig className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        <Typography variant="headlineMd" as="h2" className="mb-2 tracking-tight">
          Job Conditions & Preferences
        </Typography>
        <Typography variant="bodySm" as="p" className="text-gray-500 text-sm font-medium">
          Define your hiring requirements and preferences
        </Typography>
      </div>
      {children}
    </div>
  );
}

export default function EmployerProfilePage() {
  const [profileFormData, setProfileFormData] = useState<EmployerFormData>({
    businessName: "",
    phoneNumber: "",
    address: "",
    startTime: "",
    endTime: "",
    description: "",
    optionalTags: [],
    logoImgs: [],
    photos: [],
  });

  const [photos, setPhotos] = useState<(File | string)[]>([]);
  const [logoImg, setLogoImg] = useState<(File | string)[]>([]);

  const handleInputChange = (field: keyof EmployerFormData, value: any) => {
    setProfileFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTagChange = (tag: keyof EmployerFormData["optionalTags"]) => {
    setProfileFormData((prev) => ({
      ...prev,
      optionalTags: {
        ...prev.optionalTags,
        [tag]: !prev.optionalTags[tag],
      },
    }));
  };

  // touched state for validation
  const [touched, setTouched] = useState({
    businessName: false,
    phoneNumber: false,
    address: false,
    startTime: false,
    endTime: false,
    description: false,
  });

  // validation functions
  const validateRequired = (val: string, msg: string) => (!val ? msg : "");

  const validatePhone = (phone: string) => {
    if (!phone) return "전화번호를 입력해주세요.";
    // 캐나다 전화번호: (555) 123-4567, 555-123-4567, 5551234567, 555.123.4567 등
    const re = /^(\d{3})[-.\s]?(\d{3})[-.\s]?(\d{4})|\(\d{3}\)\s?\d{3}[-.\s]?\d{4}|\d{10}$/;
    return re.test(phone) ? "" : "전화번호 형식이 올바르지 않습니다.";
  };

  const calculateProgress = () => {
    let filledFields = 0;

    // 체크할 필드들을 배열로 관리
    const requiredFields = [
      { check: () => !!profileFormData.businessName, name: "businessName" },
      { check: () => validatePhone(profileFormData.phoneNumber) === "", name: "phoneNumber" },
      { check: () => !!profileFormData.address, name: "address" },
      {
        check: () => !!(profileFormData.startTime && profileFormData.endTime),
        name: "operatingHours",
      },
      { check: () => !!profileFormData.description, name: "description" },
    ];

    filledFields = requiredFields.filter((field) => field.check()).length;
    const totalFields = requiredFields.length;

    return Math.round((filledFields / totalFields) * 100);
  };

  const progress = calculateProgress();

  // Confirm 버튼 클릭 시 FormData로 전송
  const handleConfirm = async () => {
    const formFields = {
      name: profileFormData.businessName,
      phone_number: profileFormData.phoneNumber,
      address: profileFormData.address,
      operating_start: profileFormData.startTime,
      operating_end: profileFormData.endTime,
      description: profileFormData.description,
      // optional 태그는 백엔드에서 처리
    };

    const formData = new FormData();
    formData.append("profile", JSON.stringify(formFields)); // 폼데이터에서 "profile" JSON형식으로 변환

    logoImg.forEach((file) => {
      if (file instanceof File && file.size > 0) {
        formData.append("logoImg", file);
      }
    });

    photos.forEach((file) => {
      if (file instanceof File && file.size > 0) {
        formData.append("photos", file);
      }
    });
    
    const res = await fetch("/api/employer/profile", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (res.ok) {
      alert("Profile saved successfully!");
    } else {
      alert(result.error || "Error saving profile");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
      {/* Sticky Progress Bar */}
      <ProgressHeader completionPercentage={progress} title="Profile Setup" />

      {/* Main Content */}
      <div className="py-8 px-5 lg:py-16">
        <div className="mx-auto lg:max-w-4xl">
          {/* Header */}
          <EmployerProfileHeader />

          <div className="flex flex-col gap-5 sm:gap-10">
            {/* Business Information Section */}
            <BusinessInfoSection>
              <div className="space-y-8">
                {/* Business Name */}
                <div className="group">
                  <Input
                    label="Business Name"
                    value={profileFormData.businessName}
                    onChange={(e) => handleInputChange("businessName", e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, businessName: true }))}
                    required
                    error={
                      touched.businessName
                        ? validateRequired(
                            profileFormData.businessName,
                            "Business name is required"
                          )
                        : ""
                    }
                    placeholder="e.g., Lee's Cafe"
                  />
                </div>

                {/* Business Phone Number */}
                <div className="group">
                  <Input
                    label="Business Phone Number"
                    value={profileFormData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, phoneNumber: true }))}
                    placeholder="(555) 123-4567"
                    type="phone"
                    required
                    rightIcon={<Phone className="w-5 h-5" />}
                    error={touched.phoneNumber ? validatePhone(profileFormData.phoneNumber) : ""}
                  />
                </div>

                {/* Business Address */}
                <div className="group">
                  <Input
                    label="Business Address"
                    value={profileFormData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, address: true }))}
                    placeholder="123 Main Street, City, State"
                    required
                    rightIcon={<MapPin className="w-5 h-5" />}
                    error={
                      touched.address
                        ? validateRequired(profileFormData.address, "Address is required")
                        : ""
                    }
                  />
                </div>

                {/* Operating Hours */}
                <div>
                  <TimeRangePicker
                    startTime={profileFormData.startTime}
                    endTime={profileFormData.endTime}
                    onStartTimeChange={(time) => {
                      handleInputChange("startTime", time);
                      setTouched((t) => ({ ...t, startTime: true }));
                    }}
                    onEndTimeChange={(time) => {
                      handleInputChange("endTime", time);
                      setTouched((t) => ({ ...t, endTime: true }));
                    }}
                    label="Operating Hours"
                    required
                    error={
                      (touched.startTime && !profileFormData.startTime) ||
                      (touched.endTime && !profileFormData.endTime)
                        ? "Operating hours are required"
                        : ""
                    }
                  />
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Logo Image
                  </label>
                  <PhotoComponent
                    photos={logoImg}
                    setPhotos={setLogoImg}
                    maxCount={1}
                    onRemove={async (urlOrFile) => {
                      if (typeof urlOrFile === "string") {
                        await deleteSingleEmployerImage(urlOrFile);
                      }
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Detail Photo (Optional)
                  </label>
                  <PhotoComponent
                    photos={photos}
                    setPhotos={setPhotos}
                    maxCount={5}
                    onRemove={async (urlOrFile) => {
                      if (typeof urlOrFile === "string") {
                        await deleteSingleEmployerImage(urlOrFile);
                      }
                    }}
                  />
                  <Typography as="p" variant="bodySm" className="text-gray-500 mt-1">
                    Add a Photo of your storefront to help applicants recognize your business.
                  </Typography>
                </div>
              </div>
            </BusinessInfoSection>

            {/* Job Conditions & Preferences Section */}
            <JobConditionsSection>
              <div className="space-y-8">
                {/* Description */}
                <div>
                  <Typography
                    as="label"
                    variant="bodySm"
                    className="block font-semibold text-gray-800 mb-3"
                  >
                    Description <span className="text-red-500">*</span>
                  </Typography>
                  <TextArea
                    label={undefined}
                    value={profileFormData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, description: true }))}
                    placeholder="Tell us more about your business and what you're looking for in candidates..."
                    required
                    rows={5}
                    error={
                      touched.description
                        ? validateRequired(profileFormData.description, "Description is required")
                        : ""
                    }
                  />
                </div>

                {/* Optional Tags */}
                <div>
                  <Typography variant="bodySm" as="label" className="block mb-3">
                    Optional Tags
                  </Typography>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { key: "familyFriendly", label: "Family-friendly" },
                      { key: "noExperience", label: "No experience required" },
                      { key: "quickHiring", label: "Quick hiring" },
                    ].map(({ key, label }) => (
                      <Chip
                        key={key}
                        selected={
                          !!profileFormData.optionalTags[
                            key as keyof EmployerFormData["optionalTags"]
                          ]
                        }
                        onClick={() =>
                          handleTagChange(key as keyof EmployerFormData["optionalTags"])
                        }
                      >
                        {label}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
            </JobConditionsSection>
          </div>

          {/* Confirm Button */}
          <div className="mt-8 lg:mt-10">
            <Button
              onClick={handleConfirm}
              size="xl"
              className="w-full lg:mx-auto lg:block"
              disabled={progress < 100}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
