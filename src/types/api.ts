import { Post, Comment, User } from './index';

export interface JsonPlaceholderEndpoints {
  posts: '/posts';
  comments: '/comments';
  users: '/users';
}

export type JsonPlaceholderEndpoint = JsonPlaceholderEndpoints[keyof JsonPlaceholderEndpoints];

export interface JsonPlaceholderApi {
  getPosts: () => Promise<Post[]>;
  getPost: (id: number) => Promise<Post>;
  getComments: (postId?: number) => Promise<Comment[]>;
  getUser: (id: number) => Promise<User>;
  createPost: (data: Omit<Post, 'id'>) => Promise<Post>;
}

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
}

export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
}

export interface SubmitFormResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export interface LocalPost extends Post {
  fileUrl?: string;
  createdAt?: string;
}

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
