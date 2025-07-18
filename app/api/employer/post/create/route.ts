import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromSession } from "@/utils/auth";
import { createJobPost, getBusinessLocId } from "@/app/services/job-post-services";
import { geminiTest } from "@/app/services/gemini-services";
import { JobPostPayload} from "@/types/employer";

// create job post

export async function POST (request: NextRequest) {
  const body = (await request.json()) as JobPostPayload;

  try {
    const result = await createJobPost(body);
    return NextResponse.json( {data: result}, {status: 200});
  } catch (error) {
    console.error("❌ error on creating job post:", error);
    return NextResponse.json({ error: "Failed to create job post" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await geminiTest();
    return NextResponse.json( {data: result}, {status: 200});
  } catch(error) {
    console.log("gemini error");
    return NextResponse.json({error: "gemini api test fail"}, { status: 500});
  }
}