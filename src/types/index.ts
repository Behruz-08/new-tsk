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

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface FormSubmissionResult {
  success: boolean;
  message: string;
  data?: unknown;
}

export interface FileUploadResult {
  success: boolean;
  url?: string;
  filename?: string;
  message?: string;
}

export interface PostCreationResult {
  success: boolean;
  post?: Post;
  message?: string;
}

export interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  state: LoadingState;
  execute: (...args: unknown[]) => Promise<T | null>;
  reset: () => void;
}

export interface UseFormSubmissionReturn<T> {
  isSubmitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;
  submit: (data: unknown) => Promise<T | null>;
  resetSubmission: () => void;
}
