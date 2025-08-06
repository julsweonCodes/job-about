import { getEmployerBizLoc } from "@/app/services/employer-services";
import { getUserIdFromSession } from "@/utils/auth";
import { getActiveJobPostsCnt, getAllApplicationsCnt, getStatusUpdateCnt} from "@/app/services/employer-dash-services";
import { errorResponse, successResponse } from "@/app/lib/server/commonResponse";
import { Dashboard } from "@/types/employer";

export async function GET() {
  try {
    console.log("dashboard");
    const userId = await getUserIdFromSession();
    console.log(userId);

    const bizLocInfo = await getEmployerBizLoc(userId);
    if (!bizLocInfo) {
      console.log("No business location found for user:", userId);
      // business location이 없으면 기본값으로 dashboard 반환
      const dashboard: Dashboard = {
        activeJobPostsCnt: 0,
        allAppsCnt: 0,
        needsUpdateCnt: 0,
      };
      return successResponse(
        dashboard,
        200,
        "Employer dashboard setting data fetched successfully."
      );
    }

    const bizLocId = Number(bizLocInfo.id);
    const [activeJobPostsCnt, allAppsCnt, needsUpdateCnt] = await Promise.all([
      getActiveJobPostsCnt(userId, bizLocId),
      getAllApplicationsCnt(userId, bizLocId),
      getStatusUpdateCnt(userId, bizLocId),
    ]);
    const dashboard: Dashboard = {
      activeJobPostsCnt: activeJobPostsCnt,
      allAppsCnt: allAppsCnt,
      needsUpdateCnt: needsUpdateCnt,
    };
    return successResponse(dashboard, 200, "Employer dashboard setting data fetched successfully.");
  } catch (err) {
    console.error("Error in dashboard API:", err);
    return errorResponse("An internal server error occurred.", 500);
  }
}
