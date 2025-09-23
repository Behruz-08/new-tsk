/**
 * Custom hooks for comments data management with TanStack Query
 */

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { commentsApi } from "@/lib/api";
import { queryKeys } from "@/lib/queryClient";

/**
 * Hook to fetch all comments
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
 * Hook to fetch comments for a specific post
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
 * Hook to fetch a single comment by ID
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
 * Hook to prefetch comments for a post
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
