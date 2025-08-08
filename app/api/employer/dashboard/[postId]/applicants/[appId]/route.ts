import { successResponse, errorResponse } from "@/app/lib/server/commonResponse";
import { NextRequest } from "next/server";
import { getJobPostApplicantProfile, updateAppStatus } from "@/app/services/employer-dash-services";
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

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const userId = await getUserIdFromSession();

  if (!userId) {
    return errorResponse("Unauthorized", 401);
  }

  try {
    const res = await updateAppStatus(body.postId, body.appId, body.status, userId);
    if (res) {
      return successResponse(res, 200, "Application status updated successfully");
    } else {
      console.error("No data updated for application status");
      return errorResponse("No data updated for application status", 500);
    }
  } catch (e) {
    console.error("Failed to update application status:", e);
    return errorResponse("Failed to update application status", 500);
  }
}