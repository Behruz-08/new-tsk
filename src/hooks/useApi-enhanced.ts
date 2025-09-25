/**
 * Enhanced API hooks with better error handling, caching, and performance
 * Улучшенные API хуки с лучшей обработкой ошибок, кешированием и производительностью
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
import { debounce, retry } from '@/lib/utils-enhanced';

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
  invalidateQueries?: string[][];
}

/**
 * Enhanced API query hook
 */
export function useEnhancedQuery<TData, TError = ApiError>(
  queryKey: (string | number)[],
  queryFn: () => Promise<TData>,
  options: EnhancedQueryOptions<TData, TError> = {},
) {
  const {
    retries = 3,
    retryDelay = 1000,
    showErrorToast = true,
    showSuccessToast = false,
    successMessage = 'Данные успешно загружены',
    ...queryOptions
  } = options;

  const enhancedQueryFn = useCallback(async () => {
    try {
      return await retry(queryFn, retries, retryDelay);
    } catch (error) {
      if (showErrorToast) {
        const errorMessage = error instanceof ApiError ? error.message : 'Ошибка загрузки данных';
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
 * Enhanced API mutation hook
 */
export function useEnhancedMutation<TData, TVariables, TError = ApiError>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: EnhancedMutationOptions<TData, TVariables, TError> = {},
) {
  const {
    showErrorToast = true,
    showSuccessToast = true,
    successMessage = 'Операция выполнена успешно',
    errorMessage = 'Произошла ошибка',
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

  return useEnhancedMutation(mutationFn, {
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
export function useEnhancedInfiniteQuery<TData, TError = ApiError>(
  queryKey: (string | number)[],
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
      (string | number)[],
      number
    >,
    'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'
  > & {
    retries?: number;
    retryDelay?: number;
    showErrorToast?: boolean;
    showSuccessToast?: boolean;
    successMessage?: string;
  } = {},
) {
  const { retries = 3, retryDelay = 1000, showErrorToast = true, ...queryOptions } = options;

  const enhancedQueryFn = useCallback(
    async ({ pageParam = 0 }: { pageParam?: number }) => {
      try {
        return await retry(() => queryFn({ pageParam }), retries, retryDelay);
      } catch (error) {
        if (showErrorToast) {
          const errorMessage = error instanceof ApiError ? error.message : 'Ошибка загрузки данных';
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
  queryKey: (string | number)[],
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

  return useEnhancedQuery(queryKey, queryFn, {
    ...queryOptions,
    refetchInterval: enabled ? pollingInterval : false,
    refetchIntervalInBackground: true,
  });
}

/**
 * Debounced search hook
 */
export function useDebouncedSearch<TData, TError = ApiError>(
  queryKey: (string | number)[],
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

  const query = useEnhancedQuery([...queryKey, debouncedQuery], () => searchFn(debouncedQuery), {
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
    (queryKey: (string | number)[]) => {
      queryClient.invalidateQueries({ queryKey });
    },
    [queryClient],
  );

  const removeQueries = useCallback(
    (queryKey: (string | number)[]) => {
      queryClient.removeQueries({ queryKey });
    },
    [queryClient],
  );

  const setQueryData = useCallback(
    <T>(queryKey: (string | number)[], data: T) => {
      queryClient.setQueryData(queryKey, data);
    },
    [queryClient],
  );

  const getQueryData = useCallback(
    <T>(queryKey: (string | number)[]): T | undefined => {
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
