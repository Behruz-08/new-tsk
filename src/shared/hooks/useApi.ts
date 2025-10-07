'use client';

import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';

import { QUERY_KEYS, TOAST_MESSAGES } from '@/shared/constants';
import { retry } from '@/shared/lib/utils';

import type { ApiError } from './useApiQuery';

interface EnhancedQueryOptions<TData, TError = ApiError>
  extends Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'> {
  retries?: number;
  retryDelay?: number;
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
}

interface EnhancedMutationOptions<TData, TVariables, TError = ApiError>
  extends Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'> {
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
  invalidateQueries?: readonly (readonly (string | number)[])[];
}

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
        const errorMessage = (error as ApiError).status
          ? (error as ApiError).message
          : TOAST_MESSAGES.ERROR.GENERIC;
        toast.error(errorMessage);
      }
      throw error;
    }
  }, [queryFn, retries, retryDelay, showErrorToast]);

  const query = useQuery({
    queryKey,
    queryFn: enhancedQueryFn,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      if ((error as ApiError).status !== undefined && (error as ApiError).status! < 500) {
        return false;
      }
      return failureCount < retries;
    },
    ...queryOptions,
  });

  useEffect(() => {
    if (query.isSuccess && showSuccessToast && query.data) {
      toast.success(successMessage);
    }
  }, [query.isSuccess, showSuccessToast, successMessage, query.data]);

  return query;
}

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
          const finalErrorMessage = (error as ApiError).status
            ? (error as ApiError).message
            : errorMessage;
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

      invalidateQueries.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });
    },
    ...mutationOptions,
  });

  return mutation;
}

export function useSubmitFormMutation() {
  return useApiMutation(
    async (formData: FormData) => {
      const { formsService } = await import('../../features/forms/services/forms.service');
      return formsService.submitContactForm(formData);
    },
    {
      successMessage: TOAST_MESSAGES.SUCCESS.FORM_SUBMITTED,
    },
  );
}

export function useCreatePostWithFileMutation() {
  return useApiMutation(
    async ({
      postData,
      file,
    }: {
      postData: { title: string; body: string; userId?: number };
      file?: File;
    }) => {
      const { formsService } = await import('../../features/forms/services/forms.service');
      return formsService.createPostWithFile(postData, file);
    },
    {
      successMessage: TOAST_MESSAGES.SUCCESS.POST_CREATED,
      invalidateQueries: [QUERY_KEYS.POSTS.LISTS()],
    },
  );
}

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
