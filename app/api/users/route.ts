import { prisma } from '@/app/lib/prisma/prisma-singleton';
import { NextRequest, NextResponse } from 'next/server';
import { parseBigInt } from '../../lib/server/utils';
import { errorResponse, successResponse } from '@/app/lib/server/commonResponse';

export async function POST(req: NextRequest) {
    const { uid, email, displayName } = await req.json();

    if (!uid || !email || !displayName) {
        return errorResponse('Missing required fields', 400);
    }
    try {
        const user = await prisma.users.findFirst({
            where: {
                user_id: uid
            }
        });

        if (!user) {
            const newUser = await prisma.users.create({
                data: {
                    user_id: uid,
                    email,
                    name: displayName,
                    created_at: new Date(),
                    updated_at: new Date()
                },
            });
            return successResponse(parseBigInt(newUser), 201, 'User created');
        }
        return successResponse(parseBigInt(user), 200, 'User already exists');
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}
