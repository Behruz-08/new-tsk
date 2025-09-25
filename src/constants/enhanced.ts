/**
 * Enhanced constants with better organization and type safety
 * Улучшенные константы с лучшей организацией и типизацией
 */

/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://jsonplaceholder.typicode.com',
  TIMEOUT: 10000,
  RETRIES: 3,
  RETRY_DELAY: 1000,
} as const;

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  JSONPLACEHOLDER: {
    POSTS: '/posts',
    COMMENTS: '/comments',
    USERS: '/users',
  },
  LOCAL: {
    POSTS: '/api/posts',
    COMMENTS: '/api/comments',
    FILES: '/api/files',
    SUBMIT: '/api/submit',
  },
} as const;

/**
 * Query Keys for TanStack Query
 */
export const QUERY_KEYS = {
  POSTS: {
    LISTS: () => ['posts'] as const,
    DETAIL: (id: number) => ['posts', id] as const,
    COMMENTS: (id: number) => ['posts', id, 'comments'] as const,
  },
  COMMENTS: {
    LISTS: () => ['comments'] as const,
    DETAIL: (id: number) => ['comments', id] as const,
  },
  USERS: {
    LISTS: () => ['users'] as const,
    DETAIL: (id: number) => ['users', id] as const,
  },
  FILES: {
    LISTS: () => ['files'] as const,
    DETAIL: (filename: string) => ['files', filename] as const,
  },
} as const;

/**
 * Form Validation Messages
 */
export const VALIDATION_MESSAGES = {
  REQUIRED: 'Это поле обязательно',
  EMAIL: 'Введите корректный email',
  PHONE: 'Введите корректный номер телефона',
  URL: 'Введите корректный URL',
  MIN_LENGTH: (min: number) => `Минимум ${min} символов`,
  MAX_LENGTH: (max: number) => `Максимум ${max} символов`,
  MIN_VALUE: (min: number) => `Значение должно быть не менее ${min}`,
  MAX_VALUE: (max: number) => `Значение должно быть не более ${max}`,
  FILE_SIZE: (maxSize: number) =>
    `Размер файла не должен превышать ${Math.round(maxSize / 1024 / 1024)}MB`,
  FILE_TYPE: 'Неподдерживаемый тип файла',
  PASSWORDS_MATCH: 'Пароли не совпадают',
} as const;

/**
 * Toast Messages
 */
export const TOAST_MESSAGES = {
  SUCCESS: {
    POST_CREATED: 'Пост успешно создан!',
    POST_UPDATED: 'Пост успешно обновлен!',
    POST_DELETED: 'Пост успешно удален!',
    FORM_SUBMITTED: 'Форма успешно отправлена!',
    FILE_UPLOADED: 'Файл успешно загружен!',
    DATA_LOADED: 'Данные успешно загружены!',
    SETTINGS_SAVED: 'Настройки сохранены!',
  },
  ERROR: {
    GENERIC: 'Произошла ошибка',
    NETWORK: 'Ошибка сети',
    VALIDATION: 'Ошибка валидации',
    UNAUTHORIZED: 'Недостаточно прав',
    FORBIDDEN: 'Доступ запрещен',
    NOT_FOUND: 'Ресурс не найден',
    SERVER_ERROR: 'Ошибка сервера',
    FILE_TOO_LARGE: 'Файл слишком большой',
    INVALID_FILE_TYPE: 'Неподдерживаемый тип файла',
  },
  INFO: {
    LOADING: 'Загрузка...',
    SAVING: 'Сохранение...',
    UPLOADING: 'Загрузка файла...',
  },
} as const;

/**
 * File Upload Configuration
 */
export const FILE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: {
    IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENTS: ['application/pdf', 'text/plain'],
    ALL: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain'],
  },
  UPLOAD_DIR: 'uploads',
} as const;

/**
 * Pagination Configuration
 */
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
  MAX_PAGE_SIZE: 100,
} as const;

/**
 * Cache Configuration
 */
export const CACHE_CONFIG = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  GC_TIME: 10 * 60 * 1000, // 10 minutes
  REFETCH_INTERVAL: 30 * 1000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

/**
 * Theme Configuration
 */
export const THEME_CONFIG = {
  DEFAULT_THEME: 'dark',
  AVAILABLE_THEMES: ['light', 'dark', 'auto'] as const,
  STORAGE_KEY: 'theme-preference',
} as const;

/**
 * Language Configuration
 */
export const LANGUAGE_CONFIG = {
  DEFAULT_LANGUAGE: 'ru',
  AVAILABLE_LANGUAGES: ['ru', 'en'] as const,
  STORAGE_KEY: 'language-preference',
} as const;

/**
 * Modal Configuration
 */
export const MODAL_CONFIG = {
  ANIMATION_DURATION: 200,
  BACKDROP_BLUR: 10,
  Z_INDEX: 1400,
} as const;

/**
 * Breakpoints
 */
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280,
  LARGE_DESKTOP: 1536,
} as const;

/**
 * Animation Durations
 */
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 250,
  SLOW: 350,
  BOUNCE: 500,
  ELASTIC: 600,
} as const;

/**
 * Z-Index Layers
 */
export const Z_INDEX = {
  HIDE: -1,
  AUTO: 'auto',
  BASE: 0,
  DOCKED: 10,
  DROPDOWN: 1000,
  STICKY: 1100,
  BANNER: 1200,
  OVERLAY: 1300,
  MODAL: 1400,
  POPOVER: 1500,
  SKIP_LINK: 1600,
  TOAST: 1700,
  TOOLTIP: 1800,
} as const;

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  THEME: 'theme-preference',
  LANGUAGE: 'language-preference',
  USER_PREFERENCES: 'user-preferences',
  FORM_DRAFTS: 'form-drafts',
  CACHE_VERSION: 'cache-version',
} as const;

/**
 * Error Codes
 */
export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR',
  TIMEOUT: 'TIMEOUT',
  UNKNOWN: 'UNKNOWN',
} as const;

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Regex Patterns
 */
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  USERNAME: /^[a-zA-Z0-9_-]{3,20}$/,
} as const;

/**
 * Feature Flags
 */
export const FEATURE_FLAGS = {
  ENABLE_WEBSOCKETS: process.env.NEXT_PUBLIC_ENABLE_WEBSOCKETS === 'true',
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  ENABLE_PWA: process.env.NEXT_PUBLIC_ENABLE_PWA === 'true',
  ENABLE_DARK_MODE: process.env.NEXT_PUBLIC_ENABLE_DARK_MODE !== 'false',
  ENABLE_OFFLINE_SUPPORT: process.env.NEXT_PUBLIC_ENABLE_OFFLINE_SUPPORT === 'true',
} as const;

/**
 * Environment Configuration
 */
export const ENV_CONFIG = {
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_TEST: process.env.NODE_ENV === 'test',
  VERCEL_URL: process.env.VERCEL_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
} as const;

/**
 * Performance Configuration
 */
export const PERFORMANCE_CONFIG = {
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 100,
  LAZY_LOAD_THRESHOLD: 100,
  VIRTUAL_SCROLL_THRESHOLD: 1000,
  IMAGE_LAZY_LOAD_THRESHOLD: 200,
} as const;

/**
 * Accessibility Configuration
 */
export const A11Y_CONFIG = {
  FOCUS_VISIBLE_CLASS: 'focus-visible',
  SKIP_LINK_TEXT: 'Перейти к основному содержимому',
  ARIA_LIVE_POLITE: 'polite',
  ARIA_LIVE_ASSERTIVE: 'assertive',
} as const;

/**
 * SEO Configuration
 */
export const SEO_CONFIG = {
  DEFAULT_TITLE: 'Next.js Test Task - Frontend Development',
  DEFAULT_DESCRIPTION: 'Тестовое задание для демонстрации навыков разработки на Next.js',
  DEFAULT_KEYWORDS: ['Next.js', 'React', 'TypeScript', 'Frontend', 'Development'],
  DEFAULT_AUTHOR: 'Frontend Developer',
  DEFAULT_IMAGE: '/images/og-image.jpg',
} as const;
