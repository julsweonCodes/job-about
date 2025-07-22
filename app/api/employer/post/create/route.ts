import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromSession } from "@/utils/auth";
import { createJobPost, getBusinessLocId } from "@/app/services/job-post-services";
import { geminiTest } from "@/app/services/gemini-services";
import { JobPostPayload} from "@/types/employer";

// create job post

export async function POST (request: NextRequest) {
  const body = (await request.json()) as JobPostPayload;
  let result : any = null;
  let geminiRes: any = null;
  try {
    //const createPostRes = await createJobPost(body);
    console.log(body);
    if (body.useAI) {
      const test = "주방일.이에요 주로 설거지나 재료 손질.하고 하루에 한 끼 직원식으로 제공됍.니다. 주방일 경험 있는 사람이 왔으면 좋.갰어,요 강아지 한 마리가 드나드니까 이것도 유의해저요";
      // geminiRes = await geminiTest(body.jobDescription);
      geminiRes = await geminiTest(test);
      console.log(geminiRes);
    }
    return NextResponse.json( {data: result, geminiRes}, {status: 200});
  } catch (error) {
    console.error("❌ error on creating job post:", error);
    return NextResponse.json({ error: "Failed to create job post" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await geminiTest("주방일.이에요 주로 설거지나 재료 손질.하고 하루에 한 끼 직원식으로 제공됍.니다. ");
    return NextResponse.json( {data: result}, {status: 200});
  } catch(error) {
    console.log("gemini error");
    return NextResponse.json({error: "gemini api test fail"}, { status: 500});
  }
}