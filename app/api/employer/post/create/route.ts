import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromSession } from "@/utils/auth";
import { createJobPost } from "@/app/services/job-post-services";
import { geminiTest } from "@/app/services/gemini-services";
import { JobPostPayload } from "@/types/employer";
import { successResponse } from "@/app/lib/server/commonResponse";
import { setCache } from "@/utils/cache";

// create job post

export async function POST(request: NextRequest) {
  const body = (await request.json()) as JobPostPayload;
  let geminiRes: any = null;
  try {
    const userId = await getUserIdFromSession();
    const createPostRes = await createJobPost(body, userId);
    if (body.useAI) {
      geminiRes = await geminiTest(body);
      setCache(`gemini:${createPostRes.id}`, geminiRes);
    }
    setCache(`desc:${createPostRes.id}`, createPostRes.description);
    return successResponse(
      {
        id: Number(createPostRes.id),
        description: createPostRes.description,
        geminiRes: geminiRes,
      },
      200
    );
  } catch (error) {
    console.error("❌ error on creating job post:", error);
    return NextResponse.json({ error: "Failed to create job post" }, { status: 500 });
  }
}
