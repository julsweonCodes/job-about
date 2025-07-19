import { NextRequest, NextResponse } from 'next/server';
import { getActiveJobPosts, getAllApplicationsCnt, getStatusUpdateCnt} from "@/app/services/employer-services";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import {getUserIdFromSession} from "@/utils/auth";
import { throws } from "node:assert";

export async function GET() {
  try {
    console.log("dashboard");
    const userId = await getUserIdFromSession();

    const [activeJobPostCnt, allApplicationsCnt, statusUpdateCnt] = await Promise.all([
      getActiveJobPosts(userId),
      getAllApplicationsCnt(userId),
      getStatusUpdateCnt(userId)
    ]);

    return NextResponse.json({
      status: "success",
      data: {
        activeJobPostCnt,
        allApplicationsCnt,
        statusUpdateCnt
      }
    });
  } catch (err) {
    console.error("Error in dashboard API:", err);
    return NextResponse.json(
      { status: "error", message: "Internal Server Error" },
      { status: 500 }
    );
  }
}