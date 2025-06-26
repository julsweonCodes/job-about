import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

const parseBigInt = (obj: any) => {
    return JSON.parse(
        JSON.stringify(obj, (_, value) =>
            typeof value === 'bigint' ? value.toString() : value
        )
    );
};

export const GET = async (request: NextRequest) => {
    const res = await prisma.test.findMany({
        where: {
            deleted_at: null
        }
    });

    return NextResponse.json(parseBigInt(res));
}

export const POST = async (request: NextRequest) => {
    const body = await request.json();
    const { content } = body;

    const res = await prisma.test.create({
        data: {
            content
        }
    });

    return NextResponse.json(parseBigInt(res));
}