import { prisma } from '@/app/lib/prisma/prisma-singleton';
import { NextRequest, NextResponse } from 'next/server';
import { parseBigInt } from '../../lib/server/utils';
import { errorResponse, HttpError, successResponse } from '@/app/lib/server/commonResponse';
import { createUser } from '@/app/services/user-services';
import { SupabaseUser } from '@/types/user';


export async function POST(req: NextRequest) {
    const supabaseUser: SupabaseUser = await req.json();
    try {
        if (!supabaseUser.uid || !supabaseUser.email || !supabaseUser.displayName) {
            return errorResponse('Missing required fields', 400);
        }

        const user = await createUser(supabaseUser);
        return successResponse(parseBigInt(user), 201, 'User created');
    }
    catch (err: any) {
        if (err instanceof HttpError) {
            return errorResponse(err.message, err.status);
        }
        console.error(err);
        return errorResponse("Internal server error", 500);
    }
}