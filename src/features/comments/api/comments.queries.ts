'use client';

import { useApiQuery } from '@/shared';
import { QUERY_KEYS } from '@/shared/constants';

export function useCommentsQuery() {
  return useApiQuery(
    QUERY_KEYS.COMMENTS.LISTS(),
    async () => {
      const { commentsService } = await import('@/features/comments');
      return commentsService.getAll();
    },
    {
      staleTime: 5 * 60 * 1000,
    },
  );
}

export function usePostCommentsQuery(postId: number) {
  return useApiQuery(
    QUERY_KEYS.POSTS.COMMENTS(postId),
    async () => {
      const { commentsService } = await import('@/features/comments');
      return commentsService.getByPostId(postId);
    },
    {
      enabled: !!postId,
    },
  );
}
