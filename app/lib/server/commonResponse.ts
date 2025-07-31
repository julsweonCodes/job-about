// utils/response.ts
import { NextResponse } from 'next/server';

export const SUCCESS_STATUS = "success";
export const ERROR_STATUS = "error";

export class HttpError extends Error {
    status: number;

    constructor(message: string, status = 500) {
        super(message);
        this.status = status;
        this.name = 'HttpError';
    }
}

export type ApiResponse<T> = {
    status: typeof SUCCESS_STATUS | typeof ERROR_STATUS;
    code: number;
    message: string;
    data?: T;
};

export function successResponse<T>(data: T, code = 200, message = 'OK') {
    const body: ApiResponse<T> = {
        status: SUCCESS_STATUS,
        code,
        message,
        data,
    };
    return NextResponse.json(body, { status: code });
}

export function errorResponse(message: string, code = 500) {
    const body: ApiResponse<null> = {
        status: ERROR_STATUS,
        code,
        message,
    };
    return NextResponse.json(body, { status: code });
}
