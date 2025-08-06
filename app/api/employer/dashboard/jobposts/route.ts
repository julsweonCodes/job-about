import { successResponse, errorResponse } from "@/app/lib/server/commonResponse";
import { getActiveJobPostsList, updateJobPostStatus } from "@/app/services/employer-dash-services";
import { getUserIdFromSession } from "@/utils/auth";
import { NextRequest } from "next/server";

export async function GET() {
  console.log("GET API - /employer/dashboard/jobposts");
  try {
    const userId = await getUserIdFromSession();
    if (!userId) {
      return errorResponse("User not authenticated", 401);
    }

    const activeJobPostList = await getActiveJobPostsList(userId);
    console.log("Active job posts fetched successfully:", activeJobPostList.length);
    return successResponse(activeJobPostList, 200, "Employer dashboard - active Job posts");
  } catch (e) {
    console.error("Error in fetching active job post lists:", e);
    return errorResponse("An internal server error occurred.", 500);
  }
}
