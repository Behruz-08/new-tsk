/**
 * Improved API query hook with better error handling and caching
 * Улучшенный хук для API запросов
 */

import { useQuery, UseQueryOptions, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@/lib/api-client';

/**
 * Generic API query hook
 */
export function useApiQuery<TData, TError = ApiError>(
  queryKey: (string | number)[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error instanceof ApiError && error.status && error.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
    ...options,
  });
}

/**
 * Posts query hook
 */
export function usePostsQuery() {
  return useApiQuery(
    ['posts'],
    async () => {
      const { postsService } = await import('@/lib/services');
      return postsService.getAll();
    },
    {
      staleTime: 2 * 60 * 1000, // 2 minutes for posts
    },
  );
}

/**
 * Comments query hook
 */
export function useCommentsQuery() {
  return useApiQuery(
    ['comments'],
    async () => {
      const { commentsService } = await import('@/lib/services');
      return commentsService.getAll();
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes for comments
    },
  );
}

/**
 * Post by ID query hook
 */
export function usePostQuery(id: number) {
  return useApiQuery(
    ['posts', id],
    async () => {
      const { postsService } = await import('@/lib/services');
      return postsService.getById(id);
    },
    {
      enabled: !!id,
    },
  );
}

/**
 * Comments by post ID query hook
 */
export function usePostCommentsQuery(postId: number) {
  return useApiQuery(
    ['posts', postId, 'comments'],
    async () => {
      const { commentsService } = await import('@/lib/services');
      return commentsService.getByPostId(postId);
    },
    {
      enabled: !!postId,
    },
  );
}

/**
 * Hook for cache invalidation
 */
export function useCacheInvalidation() {
  const queryClient = useQueryClient();

  const invalidatePosts = () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  };

  const invalidateComments = () => {
    queryClient.invalidateQueries({ queryKey: ['comments'] });
  };

  const invalidateAll = () => {
    queryClient.invalidateQueries();
  };

  return {
    invalidatePosts,
    invalidateComments,
    invalidateAll,
  };
}
