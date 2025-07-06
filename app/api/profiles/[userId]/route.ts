import { ProfileDto, profileDtoToCreateData, profileDtoToUpdateData } from '@/types/profile';
import { PrismaClient, Prisma } from '@prisma/client';
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
    { params: { userId } }: { params: { userId: string } }) => {
    try {
        const profile = await prisma.profiles.findFirst({
            where: {
                user_id: BigInt(userId)
            }
        });
        if (!profile) {
            return NextResponse.json(
                { error: "Profile not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(parseBigInt(profile));
    }
    catch (err) {
        if (err instanceof SyntaxError || err instanceof TypeError) {
            return NextResponse.json(
                { error: "SyntaxError or TypeError" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};

export const PUT = async (request: NextRequest,
    { params: { userId } }: { params: { userId: string } }) => {
    const body: ProfileDto = await request.json();

    try {
        const user = await prisma.users.findUnique({
            where: { id: BigInt(userId) }
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const profile = await prisma.profiles.findFirst({
            where: { user_id: BigInt(userId) },
        });

        if (profile) {
            const updated = await prisma.profiles.update({
                where: { id: profile.id },
                data: profileDtoToUpdateData(body)
            });
            return NextResponse.json(parseBigInt(updated));
        } else {
            const created = await prisma.profiles.create({
                data: {
                    ...profileDtoToCreateData(body, userId)
                },
            });

            return NextResponse.json(parseBigInt(created));;
        }
    } catch (err) {
        console.log(err);
        if (err instanceof SyntaxError || err instanceof TypeError) {
            return NextResponse.json(
                { error: "SyntaxError or TypeError" },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
};

export const DELETE = async (request: NextRequest,
    { params: { userId } }: { params: { userId: string } }) => {
    try {
        const profile = await prisma.profiles.findFirst({
            where: {
                user_id: BigInt(userId)
            }
        });
        if (!profile) {
            return NextResponse.json(
                { error: "Profile not found" },
                { status: 404 }
            );
        }

        const updated = await prisma.profiles.update({
            where: { id: profile.id },
            data: {
                deleted_at: new Date()
            },
        });

        return NextResponse.json(parseBigInt(profile));
    } catch (err) {
        if (err instanceof SyntaxError || err instanceof TypeError) {
            return NextResponse.json(
                { error: "SyntaxError or TypeError" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }

}