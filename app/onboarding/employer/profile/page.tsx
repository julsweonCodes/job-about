"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Building,
  Globe,
  MapPin,
  Users,
  FileText,
  ArrowLeft,
  Award,
  Phone,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Typography from "@/components/ui/Typography";
import PageHeader from "@/components/common/PageHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Dialog } from "@/components/common/Dialog";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import PhotoUploader from "@/components/ui/PhotoUploader";

export default function EmployerProfilePage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white min-h-screen">
        <PageHeader title="Create Employer Profile" leftIcon={null} />
        <div className="sticky top-14 z-20 bg-white px-4 md:px-8 py-4 border-b border-gray-100">
          <Typography as="h2" variant="headlineSm" className="mb-2">
            Progress
          </Typography>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <Typography as="p" variant="bodySm" className="text-gray-600 mt-2">
            {completionPercentage}% Complete
          </Typography>
        </div>
        <div className="px-4 md:px-8 py-6 space-y-6">
          {/* Business Information */}
          <div>
            <Typography as="h2" variant="headlineSm" className="text-gray-800 mb-4">
              Business Information
            </Typography>
            <div className="space-y-6">
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
                type="phone"
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
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Operating Hours
                </label>
                <div className="flex gap-2">
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, startTime: true }))}
                    placeholder="Start Time"
                    className="w-1/2"
                    error={touched.startTime && !startTime ? "시작 시간을 입력해주세요." : ""}
                  />
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, endTime: true }))}
                    placeholder="End Time"
                    className="w-1/2"
                    error={touched.endTime && !endTime ? "종료 시간을 입력해주세요." : ""}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Detail Photo (Optional)
                </label>
                <PhotoUploader photos={photos} setPhotos={setPhotos} maxCount={5} />
                <Typography as="p" variant="bodySm" className="text-gray-500 mt-1">
                  Add a Photo of your storefront to help applicants recognize your business.
                </Typography>
              </div>
            </div>
          </div>
          {/* Job Conditions & Preferences */}
          <div>
            <Typography as="h2" variant="headlineSm" className="text-gray-800 mb-4">
              Job Conditions & Preferences
            </Typography>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Required Language Level
                </label>
                <div className="flex gap-2">
                  {["Basic English", "Intermediate", "Bilingual"].map((level) => (
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
                    <label key={tag} className="flex items-center gap-2 text-sm font-medium">
                      <input
                        type="checkbox"
                        checked={optionalTags.includes(tag)}
                        onChange={() => {
                          setOptionalTags((prev) =>
                            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                          );
                        }}
                        className="accent-indigo-500"
                      />
                      {tag}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white mt-8"
            disabled={!isFormValid}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
