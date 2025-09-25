/**
 * Application constants
 * Централизованные константы приложения
 */

/**
 * API endpoints for external and local services.
 * @namespace API_ENDPOINTS
 */
export const API_ENDPOINTS = {
  // JSONPlaceholder endpoints
  JSONPLACEHOLDER: {
    POSTS: '/posts',
    COMMENTS: '/comments',
    USERS: '/users',
  },
  // Local API endpoints
  LOCAL: {
    POSTS: '/api/posts',
    COMMENTS: '/api/comments',
    SUBMIT: '/api/submit',
    FILES: '/api/files',
  },
} as const;

/**
 * Query keys for TanStack Query to manage cached data.
 * Each key is a function that returns an array, allowing for dynamic key creation.
 * @namespace QUERY_KEYS
 */
export const QUERY_KEYS = {
  POSTS: {
    LISTS: () => ['posts'] as const,
    LIST: (filters?: Record<string, unknown>) => ['posts', 'list', filters] as const,
    DETAILS: () => ['posts', 'detail'] as const,
    DETAIL: (id: number) => ['posts', 'detail', id] as const,
  },
  COMMENTS: {
    LISTS: () => ['comments'] as const,
    LIST: (filters?: Record<string, unknown>) => ['comments', 'list', filters] as const,
    DETAILS: () => ['comments', 'detail'] as const,
    DETAIL: (id: number) => ['comments', 'detail', id] as const,
    BY_POST: (postId: number) => ['comments', 'post', postId] as const,
  },
  USERS: {
    LISTS: () => ['users'] as const,
    LIST: (filters?: Record<string, unknown>) => ['users', 'list', filters] as const,
    DETAILS: () => ['users', 'detail'] as const,
    DETAIL: (id: number) => ['users', 'detail', id] as const,
  },
} as const;

/**
 * Constants related to UI animations, including durations, easing functions, and keyframe names.
 * @namespace ANIMATIONS
 */
export const ANIMATIONS = {
  DURATION: {
    FAST: 150,
    NORMAL: 250,
    SLOW: 350,
    BOUNCE: 500,
    ELASTIC: 600,
  },
  EASING: {
    LINEAR: 'linear',
    EASE: 'ease',
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out',
    CUBIC_BEZIER: 'cubic-bezier(0.4, 0, 0.2, 1)',
    BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    ELASTIC: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  KEYFRAMES: {
    FADE_IN: 'fadeIn',
    FADE_IN_UP: 'fadeInUp',
    FADE_IN_DOWN: 'fadeInDown',
    FADE_IN_LEFT: 'fadeInLeft',
    FADE_IN_RIGHT: 'fadeInRight',
    SCALE_IN: 'scaleIn',
    SCALE_OUT: 'scaleOut',
    PULSE: 'pulse',
    SLIDE_IN_UP: 'slideInUp',
    SLIDE_IN_DOWN: 'slideInDown',
    SLIDE_IN_LEFT: 'slideInLeft',
    SLIDE_IN_RIGHT: 'slideInRight',
    GLOW_PULSE: 'glowPulse',
    GLOW_ROTATE: 'glowRotate',
    FLOAT: 'float',
    SHIMMER: 'shimmer',
    MATRIX_RAIN: 'matrixRain',
    CYBER_SCAN: 'cyberScan',
  },
} as const;

/**
 * Breakpoints for responsive design, used in SCSS and JavaScript.
 * @namespace BREAKPOINTS
 */
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
} as const;

/**
 * Z-index values for layering UI elements.
 * @namespace Z_INDEX
 */
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
} as const;

/**
 * Standardized error messages for various application scenarios.
 * @namespace ERROR_MESSAGES
 */
export const ERROR_MESSAGES = {
  NETWORK: 'Ошибка сети. Проверьте подключение к интернету.',
  TIMEOUT: 'Время ожидания истекло. Попробуйте еще раз.',
  VALIDATION: 'Ошибка валидации данных.',
  UNAUTHORIZED: 'Недостаточно прав для выполнения операции.',
  FORBIDDEN: 'Доступ запрещен.',
  NOT_FOUND: 'Ресурс не найден.',
  SERVER_ERROR: 'Внутренняя ошибка сервера.',
  UNKNOWN: 'Произошла неизвестная ошибка.',
  UPLOAD_FAILED_HTTP: 'Ошибка HTTP при загрузке файла:',
} as const;

/**
 * Standardized success messages for various application scenarios.
 * @namespace SUCCESS_MESSAGES
 */
export const SUCCESS_MESSAGES = {
  FORM_SUBMITTED: 'Форма успешно отправлена!',
  POST_CREATED: 'Пост успешно создан!',
  POST_UPDATED: 'Пост успешно обновлен!',
  POST_DELETED: 'Пост успешно удален!',
  FILE_UPLOADED: 'Файл успешно загружен!',
  DATA_LOADED: 'Данные успешно загружены!',
} as const;

/**
 * Standardized loading messages for various application scenarios.
 * @namespace LOADING_MESSAGES
 */
export const LOADING_MESSAGES = {
  LOADING_POSTS: 'Загрузка постов...',
  LOADING_COMMENTS: 'Загрузка комментариев...',
  LOADING_USERS: 'Загрузка пользователей...',
  SUBMITTING_FORM: 'Отправка формы...',
  UPLOADING_FILE: 'Загрузка файла...',
  PROCESSING: 'Обработка...',
} as const;

/**
 * Configuration for file uploads, including size limits and allowed types.
 * @namespace FILE_CONFIG
 */
export const FILE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'application/json',
    'application/octet-stream',
  ],
  TYPE_LABELS: {
    'image/jpeg': 'JPEG Image',
    'image/jpg': 'JPEG Image',
    'image/png': 'PNG Image',
    'image/gif': 'GIF Image',
    'image/webp': 'WebP Image',
    'application/pdf': 'PDF Document',
    'text/plain': 'Text File',
    'application/json': 'JSON File',
    'application/octet-stream': 'Binary File',
  } as Record<string, string>,
} as const;

/**
 * Regular expression patterns for form validation.
 * @namespace VALIDATION_PATTERNS
 */
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[1-9]\d{1,14}$/,
  URL: /^https?:\/\/.+/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  LETTERS_ONLY: /^[а-яА-Яa-zA-Z\s]+$/,
  NUMBERS_ONLY: /^\d+$/,
} as const;

/**
 * Theme color definitions for consistent styling.
 * @namespace THEME_COLORS
 */
export const THEME_COLORS = {
  PRIMARY: '#00d4ff',
  PRIMARY_DARK: '#00b8e6',
  PRIMARY_LIGHT: '#33ddff',
  SECONDARY: '#8b5cf6',
  SECONDARY_DARK: '#7c3aed',
  SECONDARY_LIGHT: '#a78bfa',
  ACCENT: '#00ff88',
  ACCENT_DARK: '#00e676',
  ACCENT_LIGHT: '#33ff9a',
  SUCCESS: '#00ff88',
  WARNING: '#ffb800',
  ERROR: '#ff4757',
  INFO: '#00d4ff',
  BACKGROUND: '#0a0e27',
  BACKGROUND_SECONDARY: '#1a1f3a',
  BACKGROUND_TERTIARY: '#252b4d',
  TEXT_PRIMARY: '#ffffff',
  TEXT_SECONDARY: '#cbd5e1',
  TEXT_TERTIARY: '#94a3b8',
} as const;
