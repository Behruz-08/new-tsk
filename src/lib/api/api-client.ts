import { API_CONFIG as SHARED_API_CONFIG } from '@/shared/config/api';

export const API_CONFIG = {
  baseUrl: SHARED_API_CONFIG.BASE_URL,
  timeout: SHARED_API_CONFIG.TIMEOUT,
  retries: SHARED_API_CONFIG.RETRIES,
  retryDelay: SHARED_API_CONFIG.RETRY_DELAY,
} as const;

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiClient {
  private baseUrl: string;
  private timeout: number;
  private retries: number;
  private retryDelay: number;

  constructor(config: typeof API_CONFIG) {
    this.baseUrl = config.baseUrl;
    this.timeout = config.timeout;
    this.retries = config.retries;
    this.retryDelay = config.retryDelay;
  }

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
          const errorData = await this.parseErrorResponse(response);
          throw new ApiError(
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

        if (attempt < this.retries && this.shouldRetry(error as Error)) {
          const delay = this.retryDelay * Math.pow(2, attempt);
          await this.delay(delay);
        }
      }
    }

    clearTimeout(timeoutId);
    throw lastError!;
  }

  private async parseErrorResponse(response: Response) {
    try {
      return await response.json();
    } catch {
      return { message: response.statusText };
    }
  }

  private shouldRetry(error: Error): boolean {
    if (error.name === 'AbortError') return false;
    if (error instanceof ApiError) {
      return error.status ? error.status >= 500 : true;
    }
    return true;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_CONFIG);

export class LocalApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl =
      typeof window !== 'undefined'
        ? ''
        : process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : 'http://localhost:3000';
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await this.parseErrorResponse(response);
      throw new ApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData.code,
        errorData,
      );
    }

    return response.json();
  }

  private async parseErrorResponse(response: Response) {
    try {
      return await response.json();
    } catch {
      return { message: response.statusText };
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await this.parseErrorResponse(response);
      throw new ApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData.code,
        errorData,
      );
    }

    return response.json();
  }
}

export const localApiClient = new LocalApiClient();
