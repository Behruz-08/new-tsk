import type { ApiError } from '@/lib/api/api-client';
import { apiClient } from '@/lib/api/api-client';

import { useApiQuery } from './useApi';

export function useApiGet<TData, TError = ApiError>(
  queryKey: readonly (string | number)[],
  endpoint: string,
  options: Parameters<typeof useApiQuery<TData, TError>>[2] = {},
) {
  return useApiQuery<TData, TError>(queryKey, () => apiClient.get<TData>(endpoint), options);
}
