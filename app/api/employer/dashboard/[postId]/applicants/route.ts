import { successResponse, errorResponse } from "@/app/lib/server/commonResponse";
import { NextRequest } from "next/server";
import { getApplicantsList } from "@/app/services/employer-dash-services";

export async function GET(
  _req: NextRequest,
  { params }: { params: { postId: string}}
) {
  try {
    // this is for testing, use useEmployerJobPostAppList hook instead
    const applicantsList = await getApplicantsList(params.postId);
    console.log(applicantsList);

    return successResponse(
      applicantsList,
      200,
      `#${params.postId} job post applicants list fetched`
    );
  } catch (e) {
    console.error("Failed to fetch applicants list.", e);
    return errorResponse("Failed to fetch applicants list", 500);
  }
};