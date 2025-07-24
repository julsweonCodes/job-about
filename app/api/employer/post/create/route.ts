import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromSession } from "@/utils/auth";
import { createJobPost, getBusinessLocId } from "@/app/services/job-post-services";
import { geminiTest } from "@/app/services/gemini-services";
import { JobPostPayload} from "@/types/employer";
import { getSession } from "@/utils/withSession";

// create job post

export async function POST (request: NextRequest) {
  const body = (await request.json()) as JobPostPayload;
  let result : any = null;
  let geminiRes: any = null;
  try {
    const createPostRes = await createJobPost(body);
    console.log(createPostRes);
    if (body.useAI) {
      geminiRes = await geminiTest(body);
      console.log(geminiRes);
      const session = await getSession();
      session.geminiRes = geminiRes;
      session.jobDescTxt = createPostRes.description;
      await session.save();
    }
    return NextResponse.json( {data: createPostRes, geminiRes}, {status: 200});
  } catch (error) {
    console.error("❌ error on creating job post:", error);
    return NextResponse.json({ error: "Failed to create job post" }, { status: 500 });
  }
}
