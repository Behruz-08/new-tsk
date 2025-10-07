import { NextResponse } from 'next/server';

import type { ApiResponse } from '@/shared/types/api.types';

export function errorResponse<T>(
  message: string,
  status: number = 500,
  error?: Error,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: false,
      error: error ? `${message}: ${error.message}` : message,
    } as ApiResponse<T>,
    { status },
  );
}

export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message && { message }),
    } as ApiResponse<T>,
    { status },
  );
}
