import { successResponse, errorResponse } from "@/app/lib/server/commonResponse";
import { NextRequest } from "next/server";
import { getJobPostApplicantProfile } from "@/app/services/employer-dash-services";
import { getUserIdFromSession } from "@/utils/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: { postId: string; appId: string } }
) {
  try {
    const userId = await getUserIdFromSession();
    const applicantDetail = await getJobPostApplicantProfile(params.postId, params.appId, userId);

    return successResponse(
      applicantDetail,
      200,
      `Application #${params.appId} , Job Post #${params.postId} data fetched`
    );
  } catch (e) {
    console.error("Failed to fetch applicant profile detail");
    return errorResponse("Failed to fetch applicant profile detail", 500);
  }
}
