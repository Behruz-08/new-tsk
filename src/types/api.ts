/**
 * API-related type definitions
 */

import { Post, Comment, User } from './index';

/**
 * Defines the available endpoints for JSONPlaceholder API.
 */
export interface JsonPlaceholderEndpoints {
  posts: '/posts';
  comments: '/comments';
  users: '/users';
}

/**
 * Type representing a key from `JsonPlaceholderEndpoints`.
 */
export type JsonPlaceholderEndpoint = JsonPlaceholderEndpoints[keyof JsonPlaceholderEndpoints];

/**
 * Interface for the JSONPlaceholder API service methods.
 */
export interface JsonPlaceholderApi {
  getPosts: () => Promise<Post[]>;
  getPost: (id: number) => Promise<Post>;
  getComments: (postId?: number) => Promise<Comment[]>;
  getUser: (id: number) => Promise<User>;
  createPost: (data: Omit<Post, 'id'>) => Promise<Post>;
}

/**
 * Configuration for API requests.
 */
export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
}

/**
 * Configuration for individual HTTP requests.
 */
export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
}

/**
 * Generic response structure for form submissions.
 */
export interface SubmitFormResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

/**
 * Extends the base `Post` interface with properties specific to locally stored posts.
 */
export interface LocalPost extends Post {
  fileUrl?: string;
  createdAt?: string;
}

/**
 * Generic API response structure.
 * @template T The type of data contained in the response.
 */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  error?: string;
  posts?: T[];
  post?: T;
  total?: number;
  localCount?: number;
  jsonPlaceholderCount?: number;
}

/**
 * Response structure for successful file uploads.
 */
export interface FileUploadResponse {
  success: boolean;
  message?: string;
  url?: string;
  fileName?: string;
  originalName?: string;
  size?: number;
  blobId?: string;
  isDemo?: boolean;
}

/**
 * Response structure for successful form submissions that result in a new post.
 */
export interface SubmitPostResponse {
  postId: number;
  title: string;
  name: string;
  email: string;
  message: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  filePath?: string;
  submittedAt: string;
}
