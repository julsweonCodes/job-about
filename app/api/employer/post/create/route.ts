import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromSession } from "@/utils/auth";
import { createJobPost, getBusinessLocId } from "@/app/services/job-post-services";
import { JobPostPayload} from "@/types/employer";

// create job post

export async function POST (request: NextRequest) {
  const body = (await request.json()) as JobPostPayload;

  try {
    const result = await createJobPost(body);
    return NextResponse.json(result);
  } catch (error) {
    console.log("error on creating job post");
    return NextResponse.json({ error: "Failed to create job post" }, { status: 500 });
  }
}
