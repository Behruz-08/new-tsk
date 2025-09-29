import { NextResponse } from 'next/server';
import { Comment } from '@/types';
import { ApiResponse } from '@/types/api';
import { errorResponse } from '@/lib/api/api-helpers';

export async function GET(): Promise<NextResponse<ApiResponse<Comment>>> {
  try {
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
