import { QueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

const defaultQueryOptions = {
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 3,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always' as const,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
};

export const queryClient = new QueryClient(defaultQueryOptions);
export const queryKeys = QUERY_KEYS;

export const prefetchQueries = {
  async postsList() {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.POSTS.LISTS(),
      queryFn: () =>
        import('@/features/posts/services/posts.service').then(({ postsService }) =>
          postsService.getAll(),
        ),
      staleTime: 5 * 60 * 1000,
    });
  },

  async postDetail(id: number) {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.POSTS.DETAIL(id),
      queryFn: () =>
        import('@/features/posts/services/posts.service').then(({ postsService }) =>
          postsService.getById(id),
        ),
      staleTime: 10 * 60 * 1000,
    });
  },

  async postComments(postId: number) {
    await queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.POSTS.COMMENTS(postId),
      queryFn: () =>
        import('@/features/comments/services/comments.service').then(({ commentsService }) =>
          commentsService.getByPostId(postId),
        ),
      staleTime: 5 * 60 * 1000,
    });
  },
};
