export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface FormSubmissionResult {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}

export interface ApiError extends Error {
  status?: number;
  code?: string;
  data?: unknown;
}

export interface SubmitPostResponse {
  postId: number;
  title: string;
  name: string;
  email: string;
  message: string;
  fileUrl?: string;
  fileName?: string;
  fileSize: number;
  fileType?: string;
  submittedAt: string;
}

export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  type?: string;
}
