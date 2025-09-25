/**
 * Improved API client with better error handling and configuration
 * Улучшенный API клиент с лучшей обработкой ошибок и конфигурацией
 */

/**
 * API configuration
 */
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
  retries: 3,
  retryDelay: 1000,
} as const;

/**
 * Custom error class for API errors
 */
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

/**
 * HTTP client with retry logic and error handling
 */
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

  /**
   * Parse error response
   */
  private async parseErrorResponse(response: Response) {
    try {
      return await response.json();
    } catch {
      return { message: response.statusText };
    }
  }

  /**
   * Check if request should be retried
   */
  private shouldRetry(error: Error): boolean {
    if (error.name === 'AbortError') return false;
    if (error instanceof ApiError) {
      return error.status ? error.status >= 500 : true;
    }
    return true;
  }

  /**
   * Delay utility
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
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

/**
 * Create API client instance
 */
export const apiClient = new ApiClient(API_CONFIG);

/**
 * Local API client for our custom endpoints
 */
export class LocalApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl =
      typeof window !== 'undefined'
        ? '' // Client-side: use relative URL
        : process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}` // Vercel production
          : 'http://localhost:3000'; // Local development
  }

  /**
   * Make request to local API
   */
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

  /**
   * Parse error response
   */
  private async parseErrorResponse(response: Response) {
    try {
      return await response.json();
    } catch {
      return { message: response.statusText };
    }
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
   * POST request with FormData
   */
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

/**
 * Create local API client instance
 */
export const localApiClient = new LocalApiClient();
