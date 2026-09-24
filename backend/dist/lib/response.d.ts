/**
 * Uniform API Response Envelope — Shared Lib
 *
 * Every API response follows this shape:
 *
 * Success:
 *   { success: true, data: T, meta?: { page, perPage, total } }
 *
 * Error:
 *   { success: false, error: { code: ErrorCode, message: string, details?: unknown } }
 */
import type { FastifyReply } from 'fastify';
import { AppError, type ErrorCode } from './errors.js';
import { ZodError } from 'zod';
export interface PaginationMeta {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
}
export interface SuccessResponse<T> {
    success: true;
    data: T;
    meta?: PaginationMeta;
}
export interface ErrorResponse {
    success: false;
    error: {
        code: ErrorCode | 'VALIDATION_ERROR';
        message: string;
        details?: unknown;
    };
}
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
export declare function ok<T>(data: T, meta?: PaginationMeta): SuccessResponse<T>;
export declare function paginatedOk<T>(data: T, page: number, perPage: number, total: number): SuccessResponse<T>;
export declare function sendOk<T>(reply: FastifyReply, data: T, statusCode?: number): void;
export declare function sendCreated<T>(reply: FastifyReply, data: T): void;
export declare function sendError(reply: FastifyReply, error: AppError | ZodError | Error): void;
//# sourceMappingURL=response.d.ts.map