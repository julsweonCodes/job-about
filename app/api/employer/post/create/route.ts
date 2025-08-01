import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromSession } from "@/utils/auth";
import { createJobPost, getBusinessLocId } from "@/app/services/job-post-services";
import { geminiTest } from "@/app/services/gemini-services";
import { JobPostPayload} from "@/types/employer";
import { getSession } from "@/utils/withSession";
import { successResponse } from "@/app/lib/server/commonResponse";
import { setCache, getCache } from "@/utils/cache";
import { setupFsCheck } from "next/dist/server/lib/router-utils/filesystem";

// create job post

export async function POST (request: NextRequest) {
  const body = (await request.json()) as JobPostPayload;
  let result : any = null;
  let geminiRes: any = null;
  try {
    const createPostRes = await createJobPost(body);
    if (body.useAI) {
      geminiRes = await geminiTest(body);
      setCache(`gemini:${createPostRes.id}`, geminiRes.summary);
    }
    setCache(`desc:${createPostRes.id}`, createPostRes.description);

    console.log("cache- GEMINI: ", getCache(`gemini:${createPostRes.id}`) );
    console.log("cache- DESCRIPTION ", getCache(`desc:${createPostRes.id}`) );
    return successResponse(
      {
        id: Number(createPostRes.id),
        description: createPostRes.description,
        geminiRes: geminiRes
      }, 200);
  } catch (error) {
    console.error("❌ error on creating job post:", error);
    return NextResponse.json({ error: "Failed to create job post" }, { status: 500 });
  }
}
