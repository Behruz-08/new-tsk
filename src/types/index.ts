/**
 * Global type definitions for the application
 * Централизованные типы для всего приложения
 */

/**
 * Represents a base entity with a numerical ID.
 * Базовый интерфейс для всех сущностей с числовым ID
 */
export interface BaseEntity {
  id: number;
}

/**
 * Represents a post with a title, body, and user ID.
 * Can optionally include a file URL and creation timestamp for local posts.
 * Интерфейс поста с заголовком, содержимым и ID пользователя
 */
export interface Post extends BaseEntity {
  title: string;
  body: string;
  userId: number;
  fileUrl?: string;
  createdAt?: string;
}

/**
 * Represents a comment associated with a post.
 * Интерфейс комментария, связанного с постом
 */
export interface Comment extends BaseEntity {
  postId: number;
  name: string;
  email: string;
  body: string;
}

/**
 * Represents a user.
 * Интерфейс пользователя
 */
export interface User extends BaseEntity {
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

/**
 * Represents a generic API error structure.
 * Структура ошибки API
 */
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

/**
 * Represents the loading state of an asynchronous operation.
 * Состояния загрузки асинхронных операций
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Parameters for pagination.
 * Параметры пагинации
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * Represents a paginated response structure.
 * Структура ответа с пагинацией
 * @template T The type of data in the paginated array
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

/**
 * API response wrapper for consistent response structure.
 * Обертка для API ответов для единообразной структуры
 * @template T The type of the actual data
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Form submission result.
 * Результат отправки формы
 */
export interface FormSubmissionResult {
  success: boolean;
  message: string;
  data?: unknown;
}

/**
 * File upload result.
 * Результат загрузки файла
 */
export interface FileUploadResult {
  success: boolean;
  url?: string;
  filename?: string;
  message?: string;
}

/**
 * Post creation with file upload result.
 * Результат создания поста с загрузкой файла
 */
export interface PostCreationResult {
  success: boolean;
  post?: Post;
  message?: string;
}

/**
 * Generic hook return type for API operations.
 * Универсальный тип возврата для API хуков
 * @template T The type of data returned by the hook
 */
export interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  state: LoadingState;
  execute: (...args: unknown[]) => Promise<T | null>;
  reset: () => void;
}

/**
 * Form submission hook return type.
 * Тип возврата хука отправки формы
 * @template T The type of data returned by the submission
 */
export interface UseFormSubmissionReturn<T> {
  isSubmitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;
  submit: (data: unknown) => Promise<T | null>;
  resetSubmission: () => void;
}
