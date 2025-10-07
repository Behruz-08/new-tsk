import { NextResponse } from 'next/server';

import type { Comment } from '@/entities/comment';
import { apiClient, errorResponse } from '@/shared/api';
import type { ApiResponse } from '@/shared/types/api.types';

export async function GET(): Promise<NextResponse<ApiResponse<Comment>>> {
  try {
    const comments = await apiClient.get<Comment[]>('/comments');

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
