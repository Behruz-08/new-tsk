/**
 * Legacy posts hooks - deprecated, use useApiQuery and useApiMutation instead
 * @deprecated Use useApiQuery and useApiMutation from @/hooks/useApiQuery and @/hooks/useApiMutation
 * Кастомные хуки для управления данными постов с TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { postsApi } from '@/lib/api';
import { queryKeys } from '@/lib/queryClient';
import { Post } from '@/types';
import { toast } from 'sonner';
import { usePostsActions } from '@/store';

/**
 * Hook to fetch all posts and update Zustand store
 * Хук для получения всех постов и обновления Zustand store
 * @returns Объект с данными постов и состоянием запроса
 */
export function usePosts() {
  const { setPosts } = usePostsActions();

  const { data, ...queryResult } = useQuery<Post[], Error, Post[], readonly ['posts']>({
    queryKey: queryKeys.POSTS.LISTS(),
    queryFn: postsApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 30000, // Refetch every 30s
  });

  useEffect(() => {
    if (data) {
      setPosts(data);
    }
  }, [data, setPosts]);

  return { data, ...queryResult };
}

/**
 * Hook to fetch a single post by ID
 */
export function usePost(id: number) {
  return useQuery({
    queryKey: queryKeys.POSTS.DETAIL(id),
    queryFn: () => postsApi.getById(id),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!id, // Only run query if ID exists
  });
}

/**
 * Hook to create a new post
 */
export function useCreatePost() {
  const queryClient = useQueryClient();
  const { addPost } = usePostsActions();

  return useMutation({
    mutationFn: (data: Omit<Post, 'id'>) => postsApi.create(data),
    onSuccess: (newPost) => {
      // Invalidate and refetch posts list
      queryClient.invalidateQueries({
        queryKey: queryKeys.POSTS.LISTS(),
      });

      // Add the new post to cache
      queryClient.setQueryData(queryKeys.POSTS.DETAIL(newPost.id), newPost);

      // Add the new post to Zustand store
      addPost(newPost);

      toast.success('Пост успешно создан!');
    },
    onError: (error: Error) => {
      toast.error(`Ошибка при создании поста: ${error.message}`);
    },
  });
}

/**
 * Hook to update an existing post
 */
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Post> }) => postsApi.update(id, data),
    onSuccess: (updatedPost, variables) => {
      // Update the specific post in cache
      queryClient.setQueryData(queryKeys.POSTS.DETAIL(variables.id), updatedPost);

      // Invalidate posts list to ensure consistency
      queryClient.invalidateQueries({
        queryKey: queryKeys.POSTS.LISTS(),
      });

      toast.success('Пост успешно обновлен!');
    },
    onError: (error: Error) => {
      toast.error(`Ошибка при обновлении поста: ${error.message}`);
    },
  });
}

/**
 * Hook to delete a post
 */
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => postsApi.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove the post from cache
      queryClient.removeQueries({
        queryKey: queryKeys.POSTS.DETAIL(deletedId),
      });

      // Invalidate posts list
      queryClient.invalidateQueries({
        queryKey: queryKeys.POSTS.LISTS(),
      });

      toast.success('Пост успешно удален!');
    },
    onError: (error: Error) => {
      toast.error(`Ошибка при удалении поста: ${error.message}`);
    },
  });
}

/**
 * Hook for optimistic updates when creating posts
 */
export function useOptimisticCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Post, 'id'>) => postsApi.create(data),
    onMutate: async (newPost) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.POSTS.LISTS(),
      });

      // Snapshot the previous value
      const previousPosts = queryClient.getQueryData(queryKeys.POSTS.LISTS());

      // Optimistically update to the new value
      const optimisticPost: Post = {
        ...newPost,
        id: Date.now(), // Temporary ID
      };

      queryClient.setQueryData(queryKeys.POSTS.LISTS(), (old: Post[] | undefined) => [
        optimisticPost,
        ...(old || []),
      ]);

      // Return a context object with the snapshotted value
      return { previousPosts };
    },
    onError: (err, newPost, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(queryKeys.POSTS.LISTS(), context?.previousPosts);
      toast.error(`Ошибка при создании поста: ${err.message}`);
    },
    onSuccess: () => {
      toast.success('Пост успешно создан!');
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({
        queryKey: queryKeys.POSTS.LISTS(),
      });
    },
  });
}
