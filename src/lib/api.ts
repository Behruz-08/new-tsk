/**
 * API client and utility functions
 * Оптимизированный API клиент с улучшенной архитектурой
 */

import { Post, Comment, User } from "@/types";
import { API_ENDPOINTS } from "@/constants";
// import { ERROR_MESSAGES } from "@/constants"; // Пока не используется

/**
 * API configuration
 * Конфигурация API клиента с поддержкой разных окружений
 */
const API_CONFIG = {
  baseUrl:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://jsonplaceholder.typicode.com", // Restored for production to target JSONPlaceholder directly
  timeout: 10000,
  retries: 3,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
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
    this.name = "ApiClientError";
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
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const requestOptions: RequestInit = {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
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
    return this.request<T>(endpoint, { method: "GET" });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

// Create API client instance
const apiClient = new ApiClient(API_CONFIG);

/**
 * Posts API
 */
export const postsApi = {
  /**
   * Get all posts
   */
  async getAll(): Promise<Post[]> {
    // Always use local API to combine JSONPlaceholder and locally created posts
    const baseUrl = typeof window !== 'undefined' 
      ? '' // Client-side: use relative URL
      : process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` // Vercel production
        : 'http://localhost:3000'; // Local development server
    
    const response = await fetch(`${baseUrl}/api/posts`);

    if (!response.ok) {
      throw new ApiClientError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
      );
    }
    const data = await response.json();
    return data.posts;
  },

  /**
   * Get post by ID
   */
  async getById(id: number): Promise<Post> {
    return apiClient.get<Post>(`${API_ENDPOINTS.JSONPLACEHOLDER.POSTS}/${id}`);
  },

  /**
   * Create new post
   */
  async create(data: Omit<Post, "id">): Promise<Post> {
    // Always use local API to create new posts
    const baseUrl = typeof window !== 'undefined' 
      ? '' // Client-side: use relative URL
      : process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` // Vercel production
        : 'http://localhost:3000'; // Local development server
    
    const response = await fetch(`${baseUrl}/api/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new ApiClientError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
      );
    }
    const result = await response.json();
    return result.post;
  },

  /**
   * Update post
   */
  async update(id: number, data: Partial<Post>): Promise<Post> {
    return apiClient.put<Post>(`/posts/${id}`, data);
  },

  /**
   * Delete post
   */
  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/posts/${id}`);
  },
};

/**
 * Comments API
 */
export const commentsApi = {
  /**
   * Get all comments
   */
  async getAll(): Promise<Comment[]> {
    if (process.env.NODE_ENV === "development") {
      // Use local API in development
      const response = await apiClient.get<{ comments: Comment[] }>(
        API_ENDPOINTS.LOCAL.COMMENTS,
      );
      return response.comments;
    } else {
      // Use JSONPlaceholder in production
      return apiClient.get<Comment[]>(API_ENDPOINTS.JSONPLACEHOLDER.COMMENTS);
    }
  },

  /**
   * Get comments by post ID
   */
  async getByPostId(postId: number): Promise<Comment[]> {
    return apiClient.get<Comment[]>(`/posts/${postId}/comments`);
  },

  /**
   * Get comment by ID
   */
  async getById(id: number): Promise<Comment> {
    return apiClient.get<Comment>(`/comments/${id}`);
  },
};

/**
 * Users API
 */
export const usersApi = {
  /**
   * Get all users
   */
  async getAll(): Promise<User[]> {
    return apiClient.get<User[]>("/users");
  },

  /**
   * Get user by ID
   */
  async getById(id: number): Promise<User> {
    return apiClient.get<User>(`/users/${id}`);
  },
};

/**
 * Form submission API (our custom endpoint)
 */
export const formApi = {
  /**
   * Submit contact form
   */
  async submitContactForm(
    formData: FormData,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new ApiClientError(
          `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      throw new ApiClientError(
        error instanceof Error ? error.message : "Failed to submit form",
      );
    }
  },

  /**
   * Create post with file upload
   */
  async createPostWithFile(
    postData: { title: string; body: string; userId?: number },
    file?: File,
  ): Promise<{ success: boolean; post: Post; message: string }> {
    try {
      // First upload file if provided
      let fileUrl: string | undefined;
      if (file) {
        const fileFormData = new FormData();
        fileFormData.append("file", file);

        const fileResponse = await fetch("/api/files", {
          method: "POST",
          body: fileFormData,
        });

        if (!fileResponse.ok) {
          throw new ApiClientError(
            `File upload failed: ${fileResponse.status}`,
          );
        }

        const fileResult = await fileResponse.json();
        fileUrl = fileResult.url;
      }

      // Create the post
      const baseUrl = typeof window !== 'undefined' 
        ? '' // Client-side: use relative URL
        : process.env.VERCEL_URL 
          ? `https://${process.env.VERCEL_URL}` // Vercel production
          : 'http://localhost:3000'; // Local development server
      
      const response = await fetch(`${baseUrl}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...postData,
          userId: postData.userId || 1,
          ...(fileUrl && { fileUrl }),
        }),
      });

      if (!response.ok) {
        throw new ApiClientError(
          `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      throw new ApiClientError(
        error instanceof Error ? error.message : "Failed to create post",
      );
    }
  },
};
