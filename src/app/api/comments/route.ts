import { NextResponse } from 'next/server';

import { apiClient } from '@/lib/api/api-client';
import { errorResponse } from '@/lib/api/api-helpers';
import type { Comment } from '@/types';
import type { ApiResponse } from '@/types/api';

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
