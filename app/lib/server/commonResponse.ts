// utils/response.ts
import { NextResponse } from 'next/server';

export type ApiResponse<T> = {
    status: 'success' | 'error';
    code: number;
    message: string;
    data?: T;
};

export function successResponse<T>(data: T, code = 200, message = 'OK') {
    const body: ApiResponse<T> = {
        status: 'success',
        code,
        message,
        data,
    };
    return NextResponse.json(body, { status: code });
}

export function errorResponse(message: string, code = 500) {
    const body: ApiResponse<null> = {
        status: 'error',
        code,
        message,
    };
    return NextResponse.json(body, { status: code });
}
