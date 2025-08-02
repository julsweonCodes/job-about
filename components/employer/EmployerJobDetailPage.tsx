"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EllipsisVertical } from "lucide-react";
import PostHeader from "@/components/common/PostHeader";
import JobPostView from "@/components/common/JobPostView";
import { JobPostActionsDialog } from "@/components/employer/JobPostActionsDialog";
import { JobPostData } from "@/types/jobPost";
import { API_URLS, PAGE_URLS } from "@/constants/api";
interface Props {
  postId: string;
}

const EmployerJobDetailPage: React.FC<Props> = ({ postId }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [jobDetails, setJobDetails] = useState<JobPostData>();
  const [loadingStates, setLoadingStates] = useState({
    jobDetails: false,
  });
  const initializeData = async () => {
    try {
      // 로딩 시작
      setLoadingStates({
        jobDetails: true,
      });

      // 모든 API 호출을 병렬로 실행
      await Promise.all([
        fetchJobDetails(),
        // 추가 API 호출들을 여기에 추가
      ]);
    } catch (error) {
      console.error("Error initializing dashboard:", error);
    } finally {
      // 로딩 완료
      setLoadingStates({
        jobDetails: false,
      });
    }
  };

  useEffect(() => {
    initializeData();
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleEdit = () => {
    router.push(PAGE_URLS.EMPLOYER.POST.EDIT(postId));
  };
  const isLoading = loadingStates.jobDetails;
  const fetchJobDetails = async () => {
    try {
      const res = await fetch(API_URLS.EMPLOYER.POST.DETAIL(postId));
      const data = await res.json();
      if (res.ok) {
        setJobDetails(data.data);
      } else {
        console.log("Failed to fetch PUBLISHED job post");
      }
    } catch (e) {
      console.log("Error fetching PUBLISHED job post", e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-pretendard">
      {/* Header */}
      <PostHeader
        rightIcon={<EllipsisVertical className="w-5 h-5 text-gray-700" />}
        onClickRight={handleOpen}
      />

      {/* Job Post Content */}
      <JobPostView jobData={jobDetails || null} mode="employer" />

      {/* Actions Dialog */}
      {jobDetails && (
        <JobPostActionsDialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          jobPost={jobDetails}
          onStatusChange={() => {}}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
};

export default EmployerJobDetailPage;
