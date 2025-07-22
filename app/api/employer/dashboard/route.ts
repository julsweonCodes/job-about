import { NextRequest, NextResponse } from 'next/server';
import { getActiveJobPosts, getAllApplicationsCnt, getStatusUpdateCnt} from "@/app/services/employer-services";
import {getUserIdFromSession} from "@/utils/auth";
import { errorResponse, successResponse } from "@/app/lib/server/commonResponse";
import { Dashboard } from "@/types/employer";

export async function GET() {
  try {
    console.log("dashboard");
    const userId = await getUserIdFromSession();
    console.log(userId);
    const [activeJobPostsCnt, allAppsCnt, needsUpdateCnt] = await Promise.all([
      getActiveJobPosts(userId),
      getAllApplicationsCnt(userId),
      getStatusUpdateCnt(userId)
    ]);
    const dashboard : Dashboard = {
      activeJobPostsCnt: activeJobPostsCnt,
      allAppsCnt: allAppsCnt,
      needsUpdateCnt: needsUpdateCnt,
    }
    return successResponse(dashboard, 200, "Employer dashboard setting data fetched successfully.");
  } catch (err) {
    console.error("Error in dashboard API:", err);
    return errorResponse("An internal server error occurred.", 500);
  }
}