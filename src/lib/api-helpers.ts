import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types/api';

/**
 * Helper function for consistent error responses.
 * @param message - A human-readable message describing the error.
 * @param status - The HTTP status code for the response.
 * @param error - The actual error object (optional, for logging/debugging).
 * @returns A NextResponse object with a standardized error format.
 */
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
