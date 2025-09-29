/**
 * TanStack Query client configuration
 * Конфигурация TanStack Query с централизованными ключами запросов
 */

import { QueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants';

/**
 * Default query options for consistent behavior
 */
const defaultQueryOptions = {
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Keep unused data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests up to 3 times
      retry: 3,
      // Retry with exponential backoff
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus
      refetchOnWindowFocus: false,
      // Don't refetch on reconnect by default
      refetchOnReconnect: 'always' as const,
    },
    mutations: {
      // Retry mutations once
      retry: 1,
      // Retry delay for mutations
      retryDelay: 1000,
    },
  },
};

/**
 * Create and configure QueryClient instance
 */
export const queryClient = new QueryClient(defaultQueryOptions);

/**
 * Query keys for consistent caching
 * Используем централизованные ключи из констант
 */
export const queryKeys = QUERY_KEYS;

/**
 * Prefetch utilities for better UX
 */
export const prefetchQueries = {
  /**
   * Prefetch posts list
   */
  async postsList() {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.POSTS.LISTS(),
      queryFn: () => import('./services').then(({ postsService }) => postsService.getAll()),
      staleTime: 5 * 60 * 1000,
    });
  },

  /**
   * Prefetch specific post
   */
  async postDetail(id: number) {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.POSTS.DETAIL(id),
      queryFn: () => import('./services').then(({ postsService }) => postsService.getById(id)),
      staleTime: 10 * 60 * 1000,
    });
  },

  /**
   * Prefetch comments for a post
   */
  async postComments(postId: number) {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.COMMENTS.BY_POST(postId),
      queryFn: () =>
        import('./services').then(({ commentsService }) => commentsService.getByPostId(postId)),
      staleTime: 5 * 60 * 1000,
    });
  },
};
