import { successResponse, errorResponse } from "@/app/lib/server/commonResponse";
import { NextRequest } from "next/server";
import { getUrgentJobPosts } from "@/app/services/employer-dash-services";
import { getUserIdFromSession } from "@/utils/auth";
import { JobPost } from "@/types/server/employer";

export async function GET() {
  try {
    const userId = await getUserIdFromSession();
    console.log("GET API - /employer/dashboard/jobposts/urgent");
    const urgentJobPosts: JobPost[] = await getUrgentJobPosts(userId);
    if (urgentJobPosts.length === 0) {
      return successResponse([], 200, "No urgent job posts found");
    }
    console.log("Urgent job posts fetched successfully:", urgentJobPosts.length);
    return successResponse(urgentJobPosts, 200, "Urgent job posts retrieved successfully");
  } catch (e) {
    console.error("Error in fetching urgent job posts:", e);
    return errorResponse("An internal server error occurred while fetching urgent job posts.", 500);
  }
}
