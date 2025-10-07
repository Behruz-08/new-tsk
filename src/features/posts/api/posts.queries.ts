'use client';

import { useApiQuery, useApiMutation } from '@/shared';
import { QUERY_KEYS, TOAST_MESSAGES } from '@/shared/constants';

export function usePostsQuery() {
  return useApiQuery(
    QUERY_KEYS.POSTS.LISTS(),
    async () => {
      const { postsService } = await import('@/features/posts');
      return postsService.getAll();
    },
    {
      staleTime: 2 * 60 * 1000,
    },
  );
}

export function usePostQuery(id: number) {
  return useApiQuery(
    QUERY_KEYS.POSTS.DETAIL(id),
    async () => {
      const { postsService } = await import('@/features/posts');
      return postsService.getById(id);
    },
    {
      enabled: !!id,
    },
  );
}

export function useCreatePostMutation() {
  return useApiMutation(
    async (data: { title: string; body: string; userId?: number; fileUrl?: string }) => {
      const { postsService } = await import('@/features/posts');
      return postsService.create({
        ...data,
        userId: data.userId || 1,
      });
    },
    {
      successMessage: TOAST_MESSAGES.SUCCESS.POST_CREATED,
      invalidateQueries: [QUERY_KEYS.POSTS.LISTS()],
    },
  );
}
