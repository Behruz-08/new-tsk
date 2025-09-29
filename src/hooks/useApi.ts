/**
 * Unified API hooks with comprehensive functionality
 * Унифицированные API хуки с полной функциональностью
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  UseQueryOptions,
  UseMutationOptions,
  UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api-client';
import { debounce, retry } from '@/lib/utils';
import { QUERY_KEYS, TOAST_MESSAGES } from '@/constants';

/**
 * Enhanced query options with better defaults
 */
interface EnhancedQueryOptions<TData, TError = ApiError>
  extends Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'> {
  retries?: number;
  retryDelay?: number;
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
}

/**
 * Enhanced mutation options
 */
interface EnhancedMutationOptions<TData, TVariables, TError = ApiError>
  extends Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'> {
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
  invalidateQueries?: readonly (readonly (string | number)[])[];
}

/**
 * Generic API query hook with enhanced functionality
 */
export function useApiQuery<TData, TError = ApiError>(
  queryKey: readonly (string | number)[],
  queryFn: () => Promise<TData>,
  options: EnhancedQueryOptions<TData, TError> = {},
) {
  const {
    retries = 3,
    retryDelay = 1000,
    showErrorToast = true,
    showSuccessToast = false,
    successMessage = TOAST_MESSAGES.SUCCESS.DATA_LOADED,
    ...queryOptions
  } = options;

  const enhancedQueryFn = useCallback(async () => {
    try {
      return await retry(queryFn, retries, retryDelay);
    } catch (error) {
      if (showErrorToast) {
        const errorMessage =
          error instanceof ApiError ? error.message : TOAST_MESSAGES.ERROR.GENERIC;
        toast.error(errorMessage);
      }
      throw error;
    }
  }, [queryFn, retries, retryDelay, showErrorToast]);

  const query = useQuery({
    queryKey,
    queryFn: enhancedQueryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error instanceof ApiError && error.status && error.status < 500) {
        return false;
      }
      return failureCount < retries;
    },
    ...queryOptions,
  });

  // Show success toast when data is loaded
  useEffect(() => {
    if (query.isSuccess && showSuccessToast && query.data) {
      toast.success(successMessage);
    }
  }, [query.isSuccess, showSuccessToast, successMessage, query.data]);

  return query;
}

/**
 * Generic API mutation hook with enhanced functionality
 */
export function useApiMutation<TData, TVariables, TError = ApiError>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: EnhancedMutationOptions<TData, TVariables, TError> = {},
) {
  const {
    showErrorToast = true,
    showSuccessToast = true,
    successMessage = TOAST_MESSAGES.SUCCESS.DATA_LOADED,
    errorMessage = TOAST_MESSAGES.ERROR.GENERIC,
    invalidateQueries = [],
    ...mutationOptions
  } = options;

  const queryClient = useQueryClient();

  const enhancedMutationFn = useCallback(
    async (variables: TVariables) => {
      try {
        return await mutationFn(variables);
      } catch (error) {
        if (showErrorToast) {
          const finalErrorMessage = error instanceof ApiError ? error.message : errorMessage;
          toast.error(finalErrorMessage);
        }
        throw error;
      }
    },
    [mutationFn, showErrorToast, errorMessage],
  );

  const mutation = useMutation({
    mutationFn: enhancedMutationFn,
    onSuccess: () => {
      if (showSuccessToast) {
        toast.success(successMessage);
      }

      // Invalidate specified queries
      invalidateQueries.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
    },
    ...mutationOptions,
  });

  return mutation;
}

/**
 * Posts query hook
 */
export function usePostsQuery() {
  return useApiQuery(
    QUERY_KEYS.POSTS.LISTS(),
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
 * Post by ID query hook
 */
export function usePostQuery(id: number) {
  return useApiQuery(
    QUERY_KEYS.POSTS.DETAIL(id),
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
 * Comments query hook
 */
export function useCommentsQuery() {
  return useApiQuery(
    QUERY_KEYS.COMMENTS.LISTS(),
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
 * Comments by post ID query hook
 */
export function usePostCommentsQuery(postId: number) {
  return useApiQuery(
    QUERY_KEYS.POSTS.COMMENTS(postId),
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
 * Create post mutation hook
 */
export function useCreatePostMutation() {
  return useApiMutation(
    async (data: { title: string; body: string; userId?: number; fileUrl?: string }) => {
      const { postsService } = await import('@/lib/services');
      return postsService.create({
        ...data,
        userId: data.userId || 1, // Default to user 1 if not provided
      });
    },
    {
      successMessage: TOAST_MESSAGES.SUCCESS.POST_CREATED,
      invalidateQueries: [QUERY_KEYS.POSTS.LISTS()],
    },
  );
}

/**
 * Update post mutation hook
 */
export function useUpdatePostMutation() {
  return useApiMutation(
    async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<{ title: string; body: string; userId: number }>;
    }) => {
      const { postsService } = await import('@/lib/services');
      return postsService.update(id, data);
    },
    {
      successMessage: TOAST_MESSAGES.SUCCESS.POST_UPDATED,
      invalidateQueries: [QUERY_KEYS.POSTS.LISTS()],
    },
  );
}

/**
 * Delete post mutation hook
 */
export function useDeletePostMutation() {
  return useApiMutation(
    async (id: number) => {
      const { postsService } = await import('@/lib/services');
      return postsService.delete(id);
    },
    {
      successMessage: TOAST_MESSAGES.SUCCESS.POST_DELETED,
      invalidateQueries: [QUERY_KEYS.POSTS.LISTS()],
    },
  );
}

/**
 * Submit form mutation hook
 */
export function useSubmitFormMutation() {
  return useApiMutation(
    async (formData: FormData) => {
      const { formsService } = await import('@/lib/services');
      return formsService.submitContactForm(formData);
    },
    {
      successMessage: TOAST_MESSAGES.SUCCESS.FORM_SUBMITTED,
    },
  );
}

/**
 * Create post with file mutation hook
 */
export function useCreatePostWithFileMutation() {
  return useApiMutation(
    async ({
      postData,
      file,
    }: {
      postData: { title: string; body: string; userId?: number };
      file?: File;
    }) => {
      const { formsService } = await import('@/lib/services');
      return formsService.createPostWithFile(postData, file);
    },
    {
      successMessage: TOAST_MESSAGES.SUCCESS.POST_CREATED,
      invalidateQueries: [QUERY_KEYS.POSTS.LISTS()],
    },
  );
}

/**
 * Optimistic update hook
 */
export function useOptimisticMutation<TData, TVariables, TError = ApiError>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: EnhancedMutationOptions<TData, TVariables, TError> & {
    optimisticUpdate: (variables: TVariables) => void;
    rollbackUpdate: (variables: TVariables) => void;
  },
) {
  const { optimisticUpdate, rollbackUpdate, ...mutationOptions } = options;

  const queryClient = useQueryClient();

  return useApiMutation(mutationFn, {
    ...mutationOptions,
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries();

      // Perform optimistic update
      optimisticUpdate(variables);

      // Return context for rollback
      return { variables };
    },
    onError: (error, variables, context, meta) => {
      // Rollback optimistic update
      if (context && typeof context === 'object' && 'variables' in context) {
        rollbackUpdate((context as { variables: TVariables }).variables);
      }

      // Call original error handler
      if (mutationOptions.onError) {
        mutationOptions.onError(error, variables, context, meta);
      }
    },
  });
}

/**
 * Infinite query hook for pagination
 */
export function useInfiniteApiQuery<TData, TError = ApiError>(
  queryKey: readonly (string | number)[],
  queryFn: ({
    pageParam,
  }: {
    pageParam?: number;
  }) => Promise<{ data: TData[]; nextCursor?: number }>,
  options: Omit<
    UseInfiniteQueryOptions<
      { data: TData[]; nextCursor?: number },
      TError,
      { data: TData[]; nextCursor?: number },
      readonly (string | number)[],
      number
    >,
    'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'
  > & {
    retries?: number;
    retryDelay?: number;
    showErrorToast?: boolean;
  } = {},
) {
  const { retries = 3, retryDelay = 1000, showErrorToast = true, ...queryOptions } = options;

  const enhancedQueryFn = useCallback(
    async ({ pageParam = 0 }: { pageParam?: number }) => {
      try {
        return await retry(() => queryFn({ pageParam }), retries, retryDelay);
      } catch (error) {
        if (showErrorToast) {
          const errorMessage =
            error instanceof ApiError ? error.message : TOAST_MESSAGES.ERROR.GENERIC;
          toast.error(errorMessage);
        }
        throw error;
      }
    },
    [queryFn, retries, retryDelay, showErrorToast],
  );

  return useInfiniteQuery({
    queryKey,
    queryFn: enhancedQueryFn,
    getNextPageParam: (lastPage: { data: TData[]; nextCursor?: number }) => lastPage.nextCursor,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...queryOptions,
  });
}

/**
 * Real-time data hook with polling
 */
export function useRealtimeQuery<TData, TError = ApiError>(
  queryKey: readonly (string | number)[],
  queryFn: () => Promise<TData>,
  options: EnhancedQueryOptions<TData, TError> & {
    pollingInterval?: number;
    enabled?: boolean;
  } = {},
) {
  const {
    pollingInterval = 30000, // 30 seconds
    enabled = true,
    ...queryOptions
  } = options;

  return useApiQuery(queryKey, queryFn, {
    ...queryOptions,
    refetchInterval: enabled ? pollingInterval : false,
    refetchIntervalInBackground: true,
  });
}

/**
 * Debounced search hook
 */
export function useDebouncedSearch<TData, TError = ApiError>(
  queryKey: readonly (string | number)[],
  searchFn: (query: string) => Promise<TData>,
  options: EnhancedQueryOptions<TData, TError> & {
    debounceMs?: number;
    minQueryLength?: number;
  } = {},
) {
  const { debounceMs = 300, minQueryLength = 2, ...queryOptions } = options;

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  const debouncedSetQuery = useMemo(
    () =>
      debounce((...args: unknown[]) => {
        const query = args[0] as string;
        setDebouncedQuery(query);
      }, debounceMs),
    [debounceMs],
  );

  useEffect(() => {
    if (searchQuery.length >= minQueryLength) {
      debouncedSetQuery(searchQuery);
    } else {
      setDebouncedQuery('');
    }
  }, [searchQuery, minQueryLength, debouncedSetQuery]);

  const query = useApiQuery([...queryKey, debouncedQuery], () => searchFn(debouncedQuery), {
    ...queryOptions,
    enabled: debouncedQuery.length >= minQueryLength,
  });

  return {
    ...query,
    searchQuery,
    setSearchQuery,
    debouncedQuery,
  };
}

/**
 * Cache management hook
 */
export function useCacheManagement() {
  const queryClient = useQueryClient();

  const invalidateQueries = useCallback(
    (queryKey: readonly (string | number)[]) => {
      queryClient.invalidateQueries({ queryKey });
    },
    [queryClient],
  );

  const removeQueries = useCallback(
    (queryKey: readonly (string | number)[]) => {
      queryClient.removeQueries({ queryKey });
    },
    [queryClient],
  );

  const setQueryData = useCallback(
    <T>(queryKey: readonly (string | number)[], data: T) => {
      queryClient.setQueryData(queryKey, data);
    },
    [queryClient],
  );

  const getQueryData = useCallback(
    <T>(queryKey: readonly (string | number)[]): T | undefined => {
      return queryClient.getQueryData<T>(queryKey);
    },
    [queryClient],
  );

  const clearCache = useCallback(() => {
    queryClient.clear();
  }, [queryClient]);

  return {
    invalidateQueries,
    removeQueries,
    setQueryData,
    getQueryData,
    clearCache,
  };
}

/**
 * Offline support hook
 */
export function useOfflineSupport() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline };
}

/**
 * Background sync hook
 */
export function useBackgroundSync<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: {
    syncKey: string;
    onSyncSuccess?: (data: TData) => void;
    onSyncError?: (error: Error) => void;
  },
) {
  const [pendingMutations, setPendingMutations] = useState<TVariables[]>([]);
  const { isOnline } = useOfflineSupport();

  // Load pending mutations from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(options.syncKey);
    if (stored) {
      try {
        setPendingMutations(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse pending mutations:', error);
      }
    }
  }, [options.syncKey]);

  // Save pending mutations to localStorage
  useEffect(() => {
    localStorage.setItem(options.syncKey, JSON.stringify(pendingMutations));
  }, [pendingMutations, options.syncKey]);

  // Sync when online
  useEffect(() => {
    if (isOnline && pendingMutations.length > 0) {
      const syncMutations = async () => {
        for (const mutation of pendingMutations) {
          try {
            const result = await mutationFn(mutation);
            options.onSyncSuccess?.(result);
          } catch (error) {
            options.onSyncError?.(error as Error);
          }
        }
        setPendingMutations([]);
      };

      syncMutations();
    }
  }, [isOnline, pendingMutations, mutationFn, options]);

  const addPendingMutation = useCallback((variables: TVariables) => {
    setPendingMutations((prev) => [...prev, variables]);
  }, []);

  return {
    pendingMutations,
    addPendingMutation,
    isOnline,
  };
}

/**
 * Hook for cache invalidation
 */
export function useCacheInvalidation() {
  const queryClient = useQueryClient();

  const invalidatePosts = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.POSTS.LISTS() });
  };

  const invalidateComments = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMMENTS.LISTS() });
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
