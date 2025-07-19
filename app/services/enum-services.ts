import { NextResponse } from "next/server";
import { HttpError } from "../lib/server/commonResponse";
import { prisma } from "@/app/lib/prisma/prisma-singleton";

export async function getEnumValues(enumName: string) {
    const result = await prisma.$queryRawUnsafe<{ enumlabel: string }[]>(
        `SELECT enumlabel FROM pg_enum
       JOIN pg_type ON pg_enum.enumtypid = pg_type.oid
       WHERE pg_type.typname = '${enumName}'`
    );

    const values = result.map(r => r.enumlabel);
    console.log(values);
    if (values.length == 0) {
        throw new HttpError("Enum not found", 404);
    }

    return { name: enumName, values };
}