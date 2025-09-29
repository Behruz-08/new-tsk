import type { ApiError } from '@/lib/api/api-client';
import { apiClient } from '@/lib/api/api-client';

import { useApiMutation } from './useApi';

export function useApiPost<TData, TVariables, TError = ApiError>(
  endpoint: string,
  options: Parameters<typeof useApiMutation<TData, TVariables, TError>>[1] = {},
) {
  return useApiMutation<TData, TVariables, TError>(
    (variables: TVariables) => apiClient.post<TData>(endpoint, variables),
    options,
  );
}
