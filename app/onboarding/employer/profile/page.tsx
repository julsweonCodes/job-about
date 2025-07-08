"use client";
import React, { useState } from "react";
import { Phone, MapPin, CircleCheckBig, X } from "lucide-react";
import TimeRangePicker from "@/components/ui/TimeRangePicker";
import { Chip } from "@/components/ui/Chip";
import Typography from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import ProgressBar from "@/components/common/ProgressBar";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import PhotoUploader from "@/components/ui/PhotoUploader";

interface FormData {
  businessName: string;
  phoneNumber: string;
  address: string;
  startTime: string;
  endTime: string;
  photos: File[];
  languageLevel: "Beginner" | "Intermediate" | "Bilingual" | null;
  description: string;
  tags: {
    familyFriendly: boolean;
    noExperience: boolean;
    quickHiring: boolean;
  };
}

function EmployerProfile() {
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    phoneNumber: "",
    address: "",
    startTime: "",
    endTime: "",
    photos: [],
    languageLevel: null,
    description: "",
    tags: {
      familyFriendly: false,
      noExperience: false,
      quickHiring: false,
    },
  });

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTagChange = (tag: keyof FormData["tags"]) => {
    setFormData((prev) => ({
      ...prev,
      tags: {
        ...prev.tags,
        [tag]: !prev.tags[tag],
      },
    }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const remainingSlots = 5 - formData.photos.length;
    const filesToAdd = files.slice(0, remainingSlots);

    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...filesToAdd],
    }));

    // Reset input value to allow re-uploading the same file
    event.target.value = "";
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // Handle form submission logic here
  };

  const languageLevels = ["Beginner", "Intermediate", "Bilingual"] as const;

  // Calculate progress based on filled fields
  const calculateProgress = () => {
    let filledFields = 0;
    const totalFields = 7; // 필수 항목 개수

    if (formData.businessName.trim()) filledFields++;
    if (formData.phoneNumber.trim()) filledFields++;
    if (formData.address.trim()) filledFields++;
    if (formData.startTime) filledFields++;
    if (formData.endTime) filledFields++;
    if (formData.languageLevel) filledFields++;
    // 사진 또는 설명만 필수, optional tag는 제외
    if (formData.description.trim()) filledFields++;

    return Math.round((filledFields / totalFields) * 100);
  };

  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
      {/* Sticky Progress Bar */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <Typography
              as="h3"
              variant="bodySm"
              className="font-semibold text-gray-700 tracking-wide"
            >
              Profile Setup
            </Typography>
            <Typography as="span" variant="bodySm" className="font-medium text-gray-500">
              {progress}% Complete
            </Typography>
          </div>
          <ProgressBar value={progress} className="h-1.5" />
        </div>
      </div>

      <div className="py-8 px-5 lg:py-16">
        <div className="max-w-6xl mx-auto lg:max-w-5xl">
          {/* Header */}
          <div className="text-center mb-10 lg:mb-16">
            <Typography variant="headlineLg" as="h1" className="mb-4 tracking-tight">
              Create Employer Profile
            </Typography>
            <Typography
              variant="bodyMd"
              as="p"
              className="text-gray-600 lg:text-lg font-medium max-w-2xl mx-auto leading-relaxed"
            >
              Set up your business profile to attract the right candidates and streamline your
              hiring process
            </Typography>
          </div>

          <div className="lg:grid lg:grid-cols-2 lg:gap-12">
            {/* Business Information Section */}
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

              <div className="space-y-8">
                {/* Business Name */}
                <div className="group">
                  <Input
                    label="Business Name"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange("businessName", e.target.value)}
                    placeholder="e.g., Lee's Cafe"
                    required
                  />
                </div>

                {/* Business Phone Number */}
                <div className="group">
                  <Input
                    label="Business Phone Number"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    placeholder="(555) 123-4567"
                    type="phone"
                    required
                    rightIcon={<Phone className="w-5 h-5" />}
                  />
                </div>

                {/* Business Address */}
                <div className="group">
                  <Input
                    label="Business Address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="123 Main Street, City, State"
                    required
                    rightIcon={<MapPin className="w-5 h-5" />}
                  />
                </div>

                {/* Operating Hours */}
                <div>
                  <TimeRangePicker
                    startTime={formData.startTime}
                    endTime={formData.endTime}
                    onStartTimeChange={(time) => handleInputChange("startTime", time)}
                    onEndTimeChange={(time) => handleInputChange("endTime", time)}
                    label="Operating Hours"
                    required
                  />
                </div>

                {/* Photo Upload */}
                <div>
                  <Typography
                    as="label"
                    variant="bodySm"
                    className="block font-semibold text-gray-800 mb-3"
                  >
                    Storefront Photos
                    <Typography
                      as="span"
                      variant="bodySm"
                      className="text-gray-400 font-medium ml-1"
                    >
                      ({formData.photos.length} / 5 uploaded)
                    </Typography>
                  </Typography>

                  <PhotoUploader
                    photos={formData.photos}
                    setPhotos={(files) => setFormData((prev) => ({ ...prev, photos: files }))}
                    maxCount={5}
                  />
                </div>
              </div>
            </div>

            {/* Job Conditions & Preferences Section */}
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

              <div className="space-y-8">
                {/* Required Language Level */}
                <div>
                  <Typography variant="bodySm" as="label" className="block mb-4">
                    Required Language Level
                  </Typography>
                  <div className="flex flex-wrap gap-3">
                    {languageLevels.map((level) => (
                      <Chip
                        key={level}
                        selected={formData.languageLevel === level}
                        onClick={() =>
                          handleInputChange(
                            "languageLevel",
                            formData.languageLevel === level ? null : level
                          )
                        }
                      >
                        {level}
                      </Chip>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Typography
                    as="label"
                    variant="bodySm"
                    className="block font-semibold text-gray-800 mb-3"
                  >
                    Description
                  </Typography>
                  <TextArea
                    label={undefined}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Tell us more about your business and what you're looking for in candidates..."
                    required
                    rows={5}
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
                        selected={formData.tags[key as keyof FormData["tags"]]}
                        onClick={() => handleTagChange(key as keyof FormData["tags"])}
                      >
                        {label}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          <div className="mt-16 lg:mt-20">
            <Button
              onClick={handleSubmit}
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

export default EmployerProfile;
