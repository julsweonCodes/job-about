import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const res = NextResponse.next();
    console.log("middleware in!!");
    return res;
}

export const config = {
    matcher: ["/api/tests"]
}