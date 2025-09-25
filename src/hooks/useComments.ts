/**
 * Legacy comments hooks - deprecated, use useApiQuery instead
 * @deprecated Use useCommentsQuery from @/hooks/useApiQuery
 * Custom hooks for comments data management with TanStack Query
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { commentsApi } from '@/lib/api';
import { queryKeys } from '@/lib/queryClient';

/**
 * Hook to fetch all comments.
 * Uses TanStack Query to manage the fetching, caching, and updating of comments data.
 * @returns The query result object from `useQuery` containing `data`, `isLoading`, `isError`, etc.
 */
export function useComments() {
  return useQuery({
    queryKey: queryKeys.COMMENTS.LISTS(),
    queryFn: commentsApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch comments for a specific post.
 * The query is enabled only when a valid `postId` is provided.
 * @param postId - The ID of the post for which to fetch comments.
 * @returns The query result object from `useQuery`.
 */
export function usePostComments(postId: number) {
  return useQuery({
    queryKey: queryKeys.COMMENTS.LIST({ postId }),
    queryFn: () => commentsApi.getByPostId(postId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!postId, // Only run query if postId exists
  });
}

/**
 * Hook to fetch a single comment by ID.
 * The query is enabled only when a valid `id` is provided.
 * @param id - The ID of the comment to fetch.
 * @returns The query result object from `useQuery`.
 */
export function useComment(id: number) {
  return useQuery({
    queryKey: queryKeys.COMMENTS.DETAIL(id),
    queryFn: () => commentsApi.getById(id),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!id, // Only run query if ID exists
  });
}

/**
 * Hook to prefetch comments for a specific post.
 * Useful for improving UX by loading data before it's explicitly needed.
 * @returns An object containing the `prefetchComments` function.
 */
export function usePrefetchPostComments() {
  const queryClient = useQueryClient();

  const prefetchComments = async (postId: number) => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.COMMENTS.LIST({ postId }),
      queryFn: () => commentsApi.getByPostId(postId),
      staleTime: 5 * 60 * 1000,
    });
  };

  return { prefetchComments };
}
