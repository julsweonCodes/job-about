"use client";
import React, { useState } from "react";
import { Bookmark } from "lucide-react";
import PostHeader from "@/components/common/PostHeader";
import JobPostView, { JobPostData } from "@/components/common/JobPostView";
import { JobStatus, JobType } from "@/constants/enums";
import { LanguageLevel } from "@/constants/enums";

const jobDetails: JobPostData = {
  id: "1",
  title: "Cashier",
  jobType: JobType.ACCOUNTANT,
  status: JobStatus.Published,
  business: {
    id: "1",
    name: "Fresh Market Grocery",
    description:
      "Café Luna is a locally-owned coffee shop that's been serving the Vancouver community for over 8 years. We pride ourselves on creating a warm, inclusive environment where both customers and staff feel at home. Our team is like a family, and we believe in supporting each other's growth and goals.",
    photos: [
      "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2",
      "https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2",
      "https://images.pexels.com/photos/2292837/pexels-photo-2292837.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2",
      "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2",
      "https://images.pexels.com/photos/1797428/pexels-photo-1797428.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2",
    ],
    location: "123 Main St, Anytown",
    tags: ["Family-friendly", "No experience required", "Quick hiring"],
  },
  deadline: "August 15",
  schedule: "Flexible, 10–20 hrs/week",
  requiredSkills: ["Cash handling", "Customer service", "Teamwork"],
  requiredPersonality: ["Friendly", "Patient", "Team-oriented"],
  languageLevel: LanguageLevel.Intermediate,
  hourlyWage: "$15/hr",
  description:
    "Join our team as a friendly cashier! You'll handle transactions, assist customers, and keep the store tidy. No experience needed, just a positive attitude and willingness to learn. Perfect for students or those seeking a flexible schedule.",
};

export const JobDetailPage: React.FC = () => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleApply = () => {
    console.log("Apply for job");
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    console.log("Bookmark toggled:", !isBookmarked);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-pretendard">
      {/* Header */}
      <PostHeader
        rightIcon={
          <Bookmark
            className={`w-5 h-5 transition-colors ${
              isBookmarked ? "text-purple-500 fill-purple-500" : "text-gray-700"
            }`}
          />
        }
        onClickRight={handleBookmark}
      />

      <JobPostView
        jobData={jobDetails}
        mode="seeker"
        onApply={handleApply}
        showApplyButton={true}
      />
    </div>
  );
};

export default JobDetailPage;
