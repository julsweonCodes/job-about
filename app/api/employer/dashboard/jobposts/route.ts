import { successResponse, errorResponse } from "@/app/lib/server/commonResponse";
import { getActiveJobPostsList } from "@/app/services/employer-services";
import { getUserIdFromSession } from "@/utils/auth";

export async function GET() {
  console.log("GET API - /employer/dashboard/application");
  try {
    const userId = await getUserIdFromSession();
    const activeJobPostList = await getActiveJobPostsList(userId);
    console.log(activeJobPostList);
    return successResponse(activeJobPostList, 200, "Employer dashboard - active Job posts");
  } catch (e) {
    console.error("Error in featching active job post lists");
    return errorResponse("An internal server error occurred.", 500);
  }

}