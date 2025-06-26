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

export const GET = async (request: NextRequest,
    { params }: { params: { id: string } }) => {
    const res = await prisma.test.findMany({
        where: {
            id: BigInt(params.id),
            deleted_at: null
        }
    });

    return NextResponse.json(parseBigInt(res));
}

export const PUT = async (request: NextRequest,
    { params }: { params: { id: string, content: string } }) => {
    const body = await request.json();
    const { content } = body;

    const res = await prisma.test.update({
        where: {
            id: BigInt(params.id),
            deleted_at: null
        },
        data: {
            content,
            updated_at: new Date().toISOString(),
        }
    })


    return NextResponse.json(parseBigInt(res));
}

export const DELETE = async (request: NextRequest,
    { params }: { params: { id: string } }) => {
    const res = await prisma.test.update({
        where: {
            id: BigInt(params.id),
        },
        data: {
            updated_at: new Date().toISOString(),
            deleted_at: new Date().toISOString(),
        }
    });

    return NextResponse.json(parseBigInt(res));
}