/**
 * Comprehensive application constants with enhanced organization
 * Комплексные константы приложения с улучшенной организацией
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
    LIST: (filters?: Record<string, unknown>) => ['posts', 'list', filters] as const,
    DETAILS: () => ['posts', 'detail'] as const,
    DETAIL: (id: number) => ['posts', 'detail', id] as const,
    COMMENTS: (id: number) => ['posts', id, 'comments'] as const,
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
 * File Upload Configuration
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
 * Breakpoints for responsive design, used in SCSS and JavaScript.
 * @namespace BREAKPOINTS
 */
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280,
  LARGE_DESKTOP: 1536,
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
 * Z-index values for layering UI elements.
 * @namespace Z_INDEX
 */
export const Z_INDEX = {
  HIDE: -1,
  AUTO: 'auto',
  BASE: 0,
  DOCKED: 10,
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
  BANNER: 1200,
  OVERLAY: 1300,
  SKIP_LINK: 1600,
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
