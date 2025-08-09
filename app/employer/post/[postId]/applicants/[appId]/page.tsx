"use client";

import React, { useMemo } from "react";
import { Clock } from "lucide-react";
import BackHeader from "@/components/common/BackHeader";
import { Button } from "@/components/ui/Button";
import { updateApplicantStatus, useApplicationDetail } from "@/hooks/employer/useEmployerDashboard";
import { useParams, useRouter } from "next/navigation";
import { STORAGE_URLS } from "@/constants/storage";
import { ImageWithSkeleton } from "@/components/ui/ImageWithSkeleton";
import { formatYYYYMMDDtoMonthDayYear } from "@/lib/utils";
import {
  getJobTypeName,
  getWorkPeriodLabel,
  getWorkTypeLabel,
} from "@/utils/client/enumDisplayUtils";
import { ApplicantStatus } from "@/constants/enums";
import { showErrorToast, showSuccessToast } from "@/utils/client/toastUtils";
import { useQueryClient } from "@tanstack/react-query";
import { EMPLOYER_QUERY_KEYS } from "@/constants/queryKeys";

function ApplicantDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <BackHeader title="Applicant Profile" />
      <main className="pb-32 lg:pb-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8 lg:mt-10">
          <div className="lg:col-span-1 space-y-6">
            <section className="bg-white backdrop-blur-sm mt-6 lg:mt-0 rounded-2xl p-6 lg:p-8 shadow-sm border border-white/50">
              <div className="flex lg:flex-col lg:items-center lg:text-center items-center space-x-4 lg:space-x-0 lg:space-y-4">
                <div className="relative">
                  <div className="w-20 lg:w-24 h-20 lg:h-24 rounded-full bg-gray-200 animate-pulse" />
                </div>
                <div className="flex-1 lg:flex-none lg:text-center">
                  <div className="h-6 lg:h-8 bg-gray-200 rounded w-32 lg:w-48 animate-pulse mb-2 lg:mx-auto" />
                  <div className="h-4 lg:h-5 bg-gray-200 rounded w-24 lg:w-40 animate-pulse lg:mx-auto" />
                </div>
              </div>
              <div className="hidden lg:flex gap-4 mt-8 justify-center">
                <div className="h-10 bg-gray-200 rounded w-24 animate-pulse" />
                <div className="h-10 bg-gray-200 rounded w-24 animate-pulse" />
              </div>
            </section>

            <section className="bg-white backdrop-blur-sm mt-4 lg:mt-0 rounded-2xl p-6 lg:p-8 shadow-sm border border-white/50">
              <div className="h-5 lg:h-6 bg-gray-200 rounded w-48 animate-pulse mb-4 lg:mb-6" />
              <div className="flex flex-wrap gap-2 lg:gap-3 mb-5 lg:mb-6">
                <div className="h-8 lg:h-10 bg-gray-200 rounded-full w-24 lg:w-32 animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-100 rounded w-11/12 animate-pulse" />
                <div className="h-4 bg-gray-100 rounded w-10/12 animate-pulse" />
              </div>
            </section>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white backdrop-blur-sm mt-4 lg:mt-0 rounded-2xl p-6 lg:p-8 shadow-sm border border-white/50">
              <div className="h-5 lg:h-6 bg-gray-200 rounded w-48 animate-pulse mb-4 lg:mb-6" />
              <div className="flex flex-wrap gap-2 lg:gap-3 mb-6 lg:mb-8">
                <div className="h-8 lg:h-10 bg-gray-200 rounded-full w-24 lg:w-32 animate-pulse" />
                <div className="h-8 lg:h-10 bg-gray-200 rounded-full w-28 lg:w-36 animate-pulse" />
                <div className="h-8 lg:h-10 bg-gray-200 rounded-full w-20 lg:w-28 animate-pulse" />
              </div>
              <div className="space-y-5 lg:space-y-6">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="relative pl-8 lg:pl-10">
                    <div className="absolute left-0 top-1.5 lg:top-2 w-4 h-4 lg:w-5 lg:h-5 bg-gray-200 rounded-full" />
                    <div className="h-4 lg:h-5 bg-gray-200 rounded w-32 lg:w-40 animate-pulse mb-1 lg:mb-2" />
                    <div className="h-3 lg:h-4 bg-gray-100 rounded w-24 lg:w-32 animate-pulse mb-1" />
                    <div className="h-3 lg:h-4 bg-gray-100 rounded w-20 lg:w-28 animate-pulse" />
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white backdrop-blur-sm mt-4 lg:mt-0 rounded-2xl p-6 lg:p-8 shadow-sm border border-white/50">
              <div className="h-5 lg:h-6 bg-gray-200 rounded w-40 animate-pulse mb-5 lg:mb-6" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-100 rounded w-11/12 animate-pulse" />
                <div className="h-4 bg-gray-100 rounded w-10/12 animate-pulse" />
              </div>
            </section>
          </div>
        </div>
      </main>
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-white/20 px-4 sm:px-6 lg:px-8 py-6 shadow-2xl flex gap-4 lg:hidden">
        <div className="h-12 bg-gray-200 rounded w-full animate-pulse" />
        <div className="h-12 bg-gray-200 rounded w-full animate-pulse" />
      </div>
    </div>
  );
}

function ApplicantDetailPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const postId = params?.postId as string;
  const appId = params?.appId as string;
  const { appDetail, loadingStates } = useApplicationDetail(postId, appId);

  const displayName = appDetail?.applicant_name || "Applicant";
  const appliedOn = appDetail?.applied_date
    ? `Applied ${formatYYYYMMDDtoMonthDayYear(appDetail.applied_date)}`
    : "";
  const profileImage = appDetail?.profile_image_url
    ? `${STORAGE_URLS.USER.PROFILE_IMG}${appDetail.profile_image_url}`
    : "/images/img-default-profile.png";

  const skillsTags = useMemo(() => {
    return appDetail?.profile_skills?.map((s) => s.name_en) || [];
  }, [appDetail?.profile_skills]);

  const experiences = useMemo(
    () =>
      (appDetail?.work_experiences || []).map((exp) => ({
        jobTypeName: getJobTypeName(exp.job_type),
        companyName: exp.company_name,
        period: exp.start_year,
        duration: getWorkPeriodLabel(exp.work_period),
        workType: getWorkTypeLabel(exp.work_type),
      })),
    [appDetail?.work_experiences]
  );

  const handleApplicantStatusUpdate = async (status: ApplicantStatus) => {
    console.log(postId, appId, status);
    try {
      const res = await updateApplicantStatus(postId, appId, status);
      if (res) {
        showSuccessToast("Applicant status updated to " + status + ".");
        queryClient.invalidateQueries({ queryKey: EMPLOYER_QUERY_KEYS.APPLICANTS_LIST(postId) });
        await new Promise((resolve) => setTimeout(resolve, 800)); // 1 second delay
        router.back();
      } else {
        showErrorToast("No changes made to applicant status.");
      }
    } catch (e) {
      showErrorToast("Error updating applicant status: " + (e as Error).message);
    }
  };

  const onClickAccept = () => {
    console.log("accept");
    handleApplicantStatusUpdate(ApplicantStatus.HIRED);
  };

  const onClickDeny = () => {
    console.log("deny");
    handleApplicantStatusUpdate(ApplicantStatus.REJECTED);
  };

  const finalized =
    appDetail?.application_status === ApplicantStatus.HIRED ||
    appDetail?.application_status === ApplicantStatus.REJECTED;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {loadingStates.appDetail && <ApplicantDetailSkeleton />}
      {!loadingStates.appDetail && (
        <>
          {/* Header */}
          <BackHeader title="Applicant Profile" />

          {/* Main Content */}
          <main className="pb-32 lg:pb-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Desktop Grid Layout */}
            <div className="lg:grid lg:grid-cols-3 lg:gap-8 lg:mt-10">
              {/* Left Column - Applicant Info & Work Style (Desktop) */}
              <div className="lg:col-span-1 space-y-6">
                {/* Applicant Info */}
                <section className="bg-white backdrop-blur-sm mt-6 lg:mt-0 rounded-2xl p-6 lg:p-8 shadow-sm border border-white/50">
                  <div className="flex lg:flex-col lg:items-center lg:text-center items-center space-x-4 lg:space-x-0 lg:space-y-4">
                    <div className="relative">
                      <div className="w-20 lg:w-24 h-20 lg:h-24 rounded-full overflow-hidden">
                        <ImageWithSkeleton
                          src={profileImage}
                          alt={displayName}
                          className="w-full h-full object-cover"
                          fallbackSrc="/images/img-default-profile.png"
                          skeletonClassName="bg-gray-200 animate-pulse rounded-full"
                        />
                      </div>
                    </div>
                    <div className="flex-1 lg:flex-none lg:text-center">
                      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1 tracking-tight">
                        {displayName}
                      </h2>
                      {appliedOn && (
                        <p className="text-gray-500 flex items-center lg:justify-center text-sm lg:text-base">
                          <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                          {appliedOn}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* 데스크탑용 버튼 */}
                  {!finalized && (
                    <div className="hidden lg:flex gap-4 mt-8 justify-center">
                      <Button variant="black" onClick={onClickDeny}>
                        Deny
                      </Button>
                      <Button variant="default" onClick={onClickAccept}>
                        Accept
                      </Button>
                    </div>
                  )}
                </section>

                {/* Work Style Summary */}
                <section className="bg-white backdrop-blur-sm mt-4 lg:mt-0 rounded-2xl p-6 lg:p-8 shadow-sm border border-white/50">
                  <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4 lg:mb-6 tracking-tight">
                    Personality Summary
                  </h3>

                  {appDetail?.quiz_type_name_en && (
                    <div className="flex flex-wrap gap-2 lg:gap-3 mb-5 lg:mb-6">
                      <span className="px-4 py-2 lg:px-5 lg:py-2.5 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 rounded-full text-sm lg:text-base font-medium border border-purple-100/50">
                        #{appDetail.quiz_type_name_en}
                      </span>
                    </div>
                  )}

                  {appDetail?.quiz_type_desc_en && (
                    <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                      {appDetail.quiz_type_desc_en}
                    </p>
                  )}
                </section>
              </div>

              {/* Right Column - Skills, Experience & Preferences (Desktop) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Skills & Experience */}
                <section className="bg-white backdrop-blur-sm mt-4 lg:mt-0 rounded-2xl p-6 lg:p-8 shadow-sm border border-white/50">
                  <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4 lg:mb-6 tracking-tight">
                    Skills & Experience
                  </h3>

                  <div className="flex flex-wrap gap-2 lg:gap-3 mb-6 lg:mb-8">
                    {skillsTags.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 lg:px-5 lg:py-2.5 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 rounded-full text-sm lg:text-base font-medium border border-blue-100/50 hover:from-blue-100 hover:to-cyan-100 transition-all duration-200 cursor-default shadow-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-5 lg:space-y-6">
                    {experiences.map((exp, index) => (
                      <div key={index} className="relative pl-8 lg:pl-10">
                        {/* Timeline dot */}
                        <div className="absolute left-0 top-1.5 lg:top-2 w-4 h-4 lg:w-5 lg:h-5 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full shadow-sm ring-2 ring-white"></div>

                        {/* Timeline line */}
                        {index < experiences.length - 1 && (
                          <div className="absolute left-2 lg:left-2.5 top-6 lg:top-7 w-0.5 h-8 lg:h-10 bg-gradient-to-b from-purple-200 to-transparent"></div>
                        )}

                        <div className="pb-2">
                          <h4 className="font-semibold text-gray-900 mb-1 lg:mb-2 text-sm lg:text-base tracking-tight">
                            {exp.jobTypeName}
                          </h4>
                          <div className="text-xs lg:text-sm text-gray-500 space-y-0.5 lg:space-y-1">
                            <p className="font-medium">{exp.companyName}</p>
                            <p className="text-gray-400">
                              {exp.period}
                              {exp.duration ? ` · ${exp.duration}` : ""}
                              {exp.workType ? ` · ${exp.workType}` : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
                {/* About Applicant */}
                {appDetail?.profile_description && (
                  <section className="bg-white backdrop-blur-sm mt-4 lg:mt-0 rounded-2xl p-6 lg:p-8 shadow-sm border border-white/50">
                    <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-5 lg:mb-6 tracking-tight">
                      About Applicant
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap text-sm lg:text-base">
                      {appDetail.profile_description}
                    </p>
                  </section>
                )}
              </div>
            </div>
          </main>

          {/* 모바일 하단 고정 버튼 */}
          {!finalized && (
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-white/20 px-4 sm:px-6 lg:px-8 py-6 shadow-2xl flex gap-4 lg:hidden">
              <Button variant="black" size="xl" onClick={onClickDeny}>
                Deny
              </Button>
              <Button variant="default" size="xl" onClick={onClickAccept}>
                Accept
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ApplicantDetailPage;
