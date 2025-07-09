"use client";

import React, { useState } from "react";
import { MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import PhotoComponent from "@/components/ui/PhotoComponent";
import TimeRangePicker from "@/components/ui/TimeRangePicker";
import Checkbox from "@/components/ui/Checkbox";
import LogoHeader from "@/components/common/LogoHeader";
import ProgressBar from "@/components/common/ProgressBar";
import { deleteSingleEmployerImage } from "@/app/services/employer-services";

export default function EmployerProfilePage() {
  const [companyName, setCompanyName] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("17:00");
  const [photos, setPhotos] = useState<(File | string)[]>([]);
  const [logoImg, setLogoImg] = useState<(File | string)[]>([]);
  const [languageLevel, setLanguageLevel] = useState("");
  const [description, setDescription] = useState("");
  const [optionalTags, setOptionalTags] = useState<string[]>([]);

  // touched state for validation
  const [touched, setTouched] = useState({
    companyName: false,
    businessPhone: false,
    businessAddress: false,
    startTime: false,
    endTime: false,
    languageLevel: false,
  });

  // validation functions
  const validateRequired = (val: string, msg: string) => (!val ? msg : "");
  const validatePhone = (phone: string) => {
    if (!phone) return "전화번호를 입력해주세요.";
    // 캐나다 전화번호: (555) 123-4567, 555-123-4567, 5551234567
    const re = /^(\(\d{3}\) ?|\d{3}-?)\d{3}-?\d{4}$/;
    return re.test(phone) ? "" : "전화번호 형식이 올바르지 않습니다.";
  };

  // progress 계산 (필수값 5개)
  const requiredCount = 5;
  let validCount = 0;
  if (companyName) validCount++;
  if (validatePhone(businessPhone) === "") validCount++;
  if (businessAddress) validCount++;
  if (startTime && endTime) validCount++;
  if (languageLevel) validCount++;
  const completionPercentage = Math.round((validCount / requiredCount) * 100);

  const tagOptions = ["Family-friendly", "No experience required", "Quick hiring"];

  // Confirm 버튼 활성화 조건
  const isFormValid =
    companyName &&
    validatePhone(businessPhone) === "" &&
    businessAddress &&
    startTime &&
    endTime &&
    languageLevel;

  // Confirm 버튼 클릭 시 FormData로 전송
  const handleConfirm = async() => {
    const formFields = {
      name: companyName,
      phone_number : businessPhone,
      address : businessAddress,
      operating_start : startTime,
      operating_end : endTime,
      language_level : languageLevel.toUpperCase().replace("_", " "),
      description,
      // optional 태그는 백엔드에서 처리
    };

    const formData = new FormData();
    formData.append("profile", JSON.stringify(formFields)); // 폼데이터에서 "profile" JSON형식으로 변환

    logoImg.forEach( (file) => {
      if (file instanceof File && file.size>0) {
        formData.append("logoImg", file);
      }
    });

    photos.forEach( (file) => {
      if (file instanceof File && file.size>0) {
        formData.append("photos", file);
      }
    });


    const res =await fetch("/api/employer/profile", {
      method: "PUT",
      body: formData,
    });

    const result = await res.json();
    if (res.ok) {
      alert("저장 완료!");
    } else {
      alert(result.error || "저장 중 오류 발생");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white min-h-screen">
        <LogoHeader borderless shadowless />
        {/* 타이틀 + 진행률 바 */}
        <div className="sticky top-14 z-20 bg-white px-4 md:px-8 py-2 border-b border-gray-100">
          <Typography as="h1" variant="headlineSm" className="text-center mb-6">
            Create Employer Profile
          </Typography>
          <ProgressBar value={completionPercentage} className="mb-4" />
        </div>
        <div className="px-4 md:px-8 py-8 space-y-8">
          {/* Business Information */}
          <div>
            <Typography as="h2" variant="titleBold" className="text-gray-800 mb-4">
              Business Information
            </Typography>
            <div className="space-y-4">
              <Input
                label="Business Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, companyName: true }))}
                required
                error={
                  touched.companyName
                    ? validateRequired(companyName, "사업장명을 입력해주세요.")
                    : ""
                }
                placeholder="e.g., Lee’s Cafe"
              />
              <Input
                label="Business Phone Number"
                type="tel"
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, businessPhone: true }))}
                placeholder="e.g., (555) 123-4567"
                rightIcon={<Phone className="w-5 h-5" />}
                error={touched.businessPhone ? validatePhone(businessPhone) : ""}
              />
              <Input
                label="Business Address"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, businessAddress: true }))}
                placeholder="Business Address"
                rightIcon={<MapPin className="w-5 h-5" />}
                error={
                  touched.businessAddress
                    ? validateRequired(businessAddress, "주소를 입력해주세요.")
                    : ""
                }
              />
              <TimeRangePicker
                startTime={startTime}
                endTime={endTime}
                onStartTimeChange={(time) => {
                  setStartTime(time);
                  setTouched((t) => ({ ...t, startTime: true }));
                }}
                onEndTimeChange={(time) => {
                  setEndTime(time);
                  setTouched((t) => ({ ...t, endTime: true }));
                }}
                label="Operating Hours"
                required
                error={
                  (touched.startTime && !startTime) || (touched.endTime && !endTime)
                    ? "운영 시간을 선택해주세요."
                    : ""
                }
              />
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Logo Image
                </label>
                <PhotoComponent photos={logoImg}
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
          </div>
          {/* Job Conditions & Preferences */}
          <div>
            <Typography as="h2" variant="titleBold" className="text-gray-800 mb-4">
              Job Conditions & Preferences
            </Typography>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Required Language Level
                </label>
                <div className="flex gap-2">
                  {["Beginner", "Intermediate", "Fluent"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => {
                        setLanguageLevel(level);
                        setTouched((t) => ({ ...t, languageLevel: true }));
                      }}
                      className={`px-4 py-2 rounded-xl font-semibold text-sm border transition-all duration-200 ${
                        languageLevel === level
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                {touched.languageLevel && !languageLevel && (
                  <div className="text-xs text-red-500 mt-1">언어 레벨을 선택해주세요.</div>
                )}
              </div>
              <TextArea
                label="Description (Optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder=""
                rows={4}
              />
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Optional Tags
                </label>
                <div className="flex flex-col gap-2">
                  {tagOptions.map((tag) => (
                    <Checkbox
                      key={tag}
                      label={tag}
                      checked={optionalTags.includes(tag)}
                      onChange={() => {
                        setOptionalTags((prev) =>
                          prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                        );
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white mt-8"
            disabled={!isFormValid}
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
