import { API_CONFIG as SHARED_API_CONFIG } from '@/shared/config/api';
import type { ApiError } from '@/shared/types/api.types';

export const API_CONFIG = {
  baseUrl: SHARED_API_CONFIG.BASE_URL,
  timeout: SHARED_API_CONFIG.TIMEOUT,
  retries: SHARED_API_CONFIG.RETRIES,
  retryDelay: SHARED_API_CONFIG.RETRY_DELAY,
} as const;

export const createApiError = (
  message: string,
  status?: number,
  code?: string,
  data?: unknown,
): ApiError => {
  const error = new Error(message) as ApiError;
  error.name = 'ApiError';
  error.status = status;
  error.code = code;
  error.data = data;
  return error;
};

export const createApiClient = (config: typeof API_CONFIG) => {
  const request = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const url = `${config.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    const requestOptions: RequestInit = {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    let lastError: Error;

    for (let attempt = 0; attempt <= config.retries; attempt++) {
      try {
        const response = await fetch(url, requestOptions);
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await parseErrorResponse(response);
          throw createApiError(
            errorData.message || `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            errorData.code,
            errorData,
          );
        }

        const data = await response.json();
        return data as T;
      } catch (error) {
        lastError = error as Error;

        if (attempt < config.retries && shouldRetry(error as Error)) {
          const delay = config.retryDelay * Math.pow(2, attempt);
          await delayMs(delay);
        }
      }
    }

    clearTimeout(timeoutId);
    throw lastError!;
  };

  const parseErrorResponse = async (response: Response) => {
    try {
      return await response.json();
    } catch {
      return { message: response.statusText };
    }
  };

  const shouldRetry = (error: Error): boolean => {
    if (error.name === 'AbortError') return false;
    if (error.name === 'ApiError') {
      const apiError = error as ApiError;
      return apiError.status ? apiError.status >= 500 : true;
    }
    return true;
  };

  const delayMs = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  return {
    get: <T>(endpoint: string): Promise<T> => request<T>(endpoint, { method: 'GET' }),

    post: <T>(endpoint: string, data?: unknown): Promise<T> =>
      request<T>(endpoint, {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      }),

    put: <T>(endpoint: string, data?: unknown): Promise<T> =>
      request<T>(endpoint, {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      }),

    delete: <T>(endpoint: string): Promise<T> => request<T>(endpoint, { method: 'DELETE' }),
  };
};

export const apiClient = createApiClient(API_CONFIG);

export const createLocalApiClient = () => {
  const getBaseUrl = () => {
    if (typeof window !== 'undefined') return '';
    return process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
  };

  const request = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const url = `${getBaseUrl()}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await parseErrorResponse(response);
      throw createApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData.code,
        errorData,
      );
    }

    return response.json();
  };

  const parseErrorResponse = async (response: Response) => {
    try {
      return await response.json();
    } catch {
      return { message: response.statusText };
    }
  };

  const postFormData = async <T>(endpoint: string, formData: FormData): Promise<T> => {
    const url = `${getBaseUrl()}${endpoint}`;

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await parseErrorResponse(response);
      throw createApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData.code,
        errorData,
      );
    }

    return response.json();
  };

  return {
    get: <T>(endpoint: string): Promise<T> => request<T>(endpoint, { method: 'GET' }),

    post: <T>(endpoint: string, data?: unknown): Promise<T> =>
      request<T>(endpoint, {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      }),

    postFormData,
  };
};

export const localApiClient = createLocalApiClient();
