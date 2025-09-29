import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types/api';

export function errorResponse<T = null>(
  message: string,
  status: number,
  error?: Error,
): NextResponse<ApiResponse<T>> {
  console.error(message, error);
  return NextResponse.json(
    { success: false, message, error: error?.message || 'Unknown error' },
    { status },
  );
}
