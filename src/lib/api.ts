/**
 * Legacy API client - deprecated, use services instead
 * Устаревший API клиент - используйте сервисы вместо этого
 * @deprecated Use services from @/lib/services
 */

import { Post, User } from '@/types';
import { postsService, commentsService, formsService } from '@/lib/services';

/**
 * API configuration
 * Конфигурация API клиента
 */
const API_CONFIG = {
  baseUrl: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
  retries: 3,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
} as const;

/**
 * Custom error class for API errors
 */
export class ApiClientError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

/**
 * HTTP client with error handling and retries
 */
class ApiClient {
  private baseUrl: string;
  private timeout: number;
  private retries: number;

  constructor(config: typeof API_CONFIG) {
    this.baseUrl = config.baseUrl;
    this.timeout = config.timeout;
    this.retries = config.retries;
  }

  /**
   * Make HTTP request with retry logic
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const requestOptions: RequestInit = {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    let lastError: Error;

    for (let attempt = 0; attempt <= this.retries; attempt++) {
      try {
        const response = await fetch(url, requestOptions);
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new ApiClientError(
            `HTTP ${response.status}: ${response.statusText}`,
            response.status,
          );
        }

        const data = await response.json();
        return data as T;
      } catch (error) {
        lastError = error as Error;

        if (attempt < this.retries) {
          // Exponential backoff
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    clearTimeout(timeoutId);
    throw lastError!;
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create API client instance
const apiClient = new ApiClient(API_CONFIG);

/**
 * Posts API
 */
/**
 * Posts API - Legacy wrapper around postsService
 * @deprecated Use postsService directly
 */
export const postsApi = {
  getAll: () => postsService.getAll(),
  getById: (id: number) => postsService.getById(id),
  create: (data: Omit<Post, 'id'>) => postsService.create(data),
  update: (id: number, data: Partial<Post>) => postsService.update(id, data),
  delete: (id: number) => postsService.delete(id),
};

/**
 * Comments API
 */
/**
 * Comments API - Legacy wrapper around commentsService
 * @deprecated Use commentsService directly
 */
export const commentsApi = {
  getAll: () => commentsService.getAll(),
  getById: (id: number) => commentsService.getById(id),
  getByPostId: (postId: number) => commentsService.getByPostId(postId),
};

/**
 * Users API
 */
export const usersApi = {
  /**
   * Get all users
   */
  async getAll(): Promise<User[]> {
    return apiClient.get<User[]>('/users');
  },

  /**
   * Get user by ID
   */
  async getById(id: number): Promise<User> {
    return apiClient.get<User>(`/users/${id}`);
  },
};

/**
 * Form submission API - Legacy wrapper around formsService
 * @deprecated Use formsService directly
 */
export const formApi = {
  submitContactForm: (formData: FormData) => formsService.submitContactForm(formData),
  createPostWithFile: (postData: { title: string; body: string; userId?: number }, file?: File) =>
    formsService.createPostWithFile(postData, file),
};
