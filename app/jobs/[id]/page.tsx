"use client";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import PageHeader from "@/components/common/PageHeader";
import BottomButton from "@/components/common/BottomButton";
import Typography from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import {
  Bookmark,
  Trash,
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  Building,
} from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/Button";

// 임시 mock 데이터 (실제 API 연동 시 교체)
const mockJob = {
  id: "1",
  title: "Server - Full Time",
  company: "Starbucks",
  location: "Gangnam, Seoul",
  wage: "₩12,000/hr",
  schedule: "Flexible, 10-20 hrs/week",
  deadline: "August 15",
  description:
    "Join our team as a friendly cashier! You'll handle transactions, assist customers, and keep the store tidy. No experience needed, just a positive attitude and willingness to learn. Perfect for students or those seeking a flexible schedule.",
  companyImages: [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_vguO_Tb6WmaoO95UhQL7YGkMORACrcgR2w&s",
  ],
  locationImages: ["https://example.com/location1.jpg", "https://example.com/location2.jpg"],
  type: "Part-Time",
  applicants: 12,
  views: 89,
};

export default function JobDetailPage() {
  const router = useRouter();
  const { appUser } = useAuthStore();
  const role = appUser?.role;

  // 헤더 우측 아이콘 및 클릭 핸들러 분기
  const rightIcon =
    role === "employer" ? (
      <Trash className="w-5 h-5 md:w-6 md:h-6" />
    ) : (
      <Bookmark className="w-5 h-5 md:w-6 md:h-6" />
    );
  const handleRightClick = () => {
    if (role === "employer") {
      // 삭제 로직
      alert("삭제 기능 (구현 예정)");
    } else {
      // 북마크 로직
      alert("북마크 기능 (구현 예정)");
    }
  };

  // 모바일 하단 버튼 분기
  const getMobileBottomButton = () => {
    if (role === "employer") {
      return (
        <BottomButton
          type="button"
          size="lg"
          className="shadow-md"
          onClick={() => router.push(`/jobs/${mockJob.id}/edit`)}
        >
          Edit
        </BottomButton>
      );
    } else {
      return (
        <BottomButton
          type="button"
          size="lg"
          className="shadow-md"
          onClick={() => alert("지원하기 (구현 예정)")}
        >
          Apply
        </BottomButton>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-pretendard">
      <div className="md:max-w-6xl mx-auto bg-white min-h-screen">
        {/* Header */}
        <PageHeader
          title="job:about"
          leftIcon={<ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />}
          onClickLeft={() => router.back()}
          rightIcon={rightIcon}
          onClickRight={handleRightClick}
        />
        <main className="flex flex-col gap-6 px-5 md:px-8 pb-20">
          {/* Job Title & Company Section */}
          <section className="mt-4">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Building className="w-8 h-8 text-purple-600" />
                </div>
                <div className="flex-1">
                  <Typography variant="headlineMd" className="font-bold text-gray-900 mb-1">
                    {mockJob.title}
                  </Typography>
                  <Typography variant="bodyLg" className="text-gray-600 mb-2">
                    {mockJob.company}
                  </Typography>
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                      {mockJob.type}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {mockJob.applicants} applicants • {mockJob.views} views
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Job Details */}
          <section>
            <Typography
              variant="headlineMd"
              className="text-xl md:text-2xl font-bold text-gray-900 mb-4"
            >
              Job Details
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="flex items-center gap-4 p-4">
                <MapPin className="w-6 h-6 text-purple-600" />
                <div>
                  <Typography variant="bodySm" className="font-semibold text-gray-900">
                    Location
                  </Typography>
                  <Typography variant="bodySm" className="text-gray-600">
                    {mockJob.location}
                  </Typography>
                </div>
              </Card>
              <Card className="flex items-center gap-4 p-4">
                <DollarSign className="w-6 h-6 text-purple-600" />
                <div>
                  <Typography variant="bodySm" className="font-semibold text-gray-900">
                    Hourly Wage
                  </Typography>
                  <Typography variant="bodySm" className="text-gray-600">
                    {mockJob.wage}
                  </Typography>
                </div>
              </Card>
              <Card className="flex items-center gap-4 p-4">
                <Calendar className="w-6 h-6 text-purple-600" />
                <div>
                  <Typography variant="bodySm" className="font-semibold text-gray-900">
                    Schedule
                  </Typography>
                  <Typography variant="bodySm" className="text-gray-600">
                    {mockJob.schedule}
                  </Typography>
                </div>
              </Card>
              <Card className="flex items-center gap-4 p-4">
                <Briefcase className="w-6 h-6 text-purple-600" />
                <div>
                  <Typography variant="bodySm" className="font-semibold text-gray-900">
                    Deadline
                  </Typography>
                  <Typography variant="bodySm" className="text-gray-600">
                    {mockJob.deadline}
                  </Typography>
                </div>
              </Card>
            </div>
          </section>

          {/* Job Description */}
          <section className="p-4 md:p-8 bg-gradient-to-b from-purple-50 to-white">
            <div className="flex items-center mb-4">
              <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-purple-600 mr-2" />
              <Typography
                variant="headlineMd"
                className="text-xl md:text-2xl font-bold text-gray-900"
              >
                Job Description
              </Typography>
            </div>
            <Typography variant="bodyLg" className="text-gray-700 leading-relaxed mb-6">
              {mockJob.description}
            </Typography>
          </section>

          {/* Company & Location Images */}
          <section>
            <div className="space-y-6">
              {/* Company Images */}
              {mockJob.companyImages && mockJob.companyImages.length > 0 && (
                <div>
                  <Typography
                    variant="titleBold"
                    className="text-lg font-semibold text-gray-900 mb-3"
                  >
                    Company
                  </Typography>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockJob.companyImages.map((imageUrl, index) => (
                      <div key={index} className="rounded-2xl overflow-hidden shadow-sm">
                        <img
                          src={imageUrl}
                          alt={`Company image ${index + 1}`}
                          width={400}
                          height={300}
                          className="w-full h-48 md:h-64 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* 모바일 하단 버튼 */}
      <div className="block md:hidden">{getMobileBottomButton()}</div>
    </div>
  );
}
