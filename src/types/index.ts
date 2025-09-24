/**
 * Global type definitions for the application
 */

export interface BaseEntity {
  id: number;
}

export interface Post extends BaseEntity {
  title: string;
  body: string;
  userId: number;
  fileUrl?: string;
  createdAt?: string;
}

export interface Comment extends BaseEntity {
  postId: number;
  name: string;
  email: string;
  body: string;
}

export interface User extends BaseEntity {
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export type LoadingState = "idle" | "loading" | "success" | "error";

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
