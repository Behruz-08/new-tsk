/**
 * API endpoint for comments - fetches from JSONPlaceholder
 */

import { NextResponse } from 'next/server';
import { Comment } from '@/types';
import { ApiResponse } from '@/types/api';
import { errorResponse } from '@/lib/api-helpers';

/**
 * Handles GET requests to fetch all comments from JSONPlaceholder.
 * @returns A NextResponse containing an array of comments or an error response.
 */
export async function GET(): Promise<NextResponse<ApiResponse<Comment>>> {
  try {
    // Fetch comments from JSONPlaceholder
    const response = await fetch('https://jsonplaceholder.typicode.com/comments');

    if (!response.ok) {
      throw new Error(`JSONPlaceholder API error: ${response.status}`);
    }

    const comments: Comment[] = await response.json();

    return NextResponse.json({
      success: true,
      comments: comments,
      total: comments.length,
    });
  } catch (error) {
    return errorResponse(
      'Error fetching comments',
      500,
      error instanceof Error ? error : undefined,
    );
  }
}
