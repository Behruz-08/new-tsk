export const API_CONFIG = {
  BASE_URL:
    process.env.NEXT_PUBLIC_JSONPLACEHOLDER_BASE_URL || 'https://jsonplaceholder.typicode.com',
  TIMEOUT: 10000,
  RETRIES: 3,
  RETRY_DELAY: 1000,
} as const;

export const QUERY_KEYS = {
  POSTS: {
    LISTS: () => ['posts'] as const,
    DETAIL: (id: number) => ['posts', id] as const,
    COMMENTS: (postId: number) => ['posts', postId, 'comments'] as const,
  },
  COMMENTS: {
    LISTS: () => ['comments'] as const,
    DETAIL: (id: number) => ['comments', id] as const,
  },
  FILES: {
    UPLOAD: (fileId: string) => ['files', 'upload', fileId] as const,
  },
} as const;

export const TOAST_MESSAGES = {
  SUCCESS: {
    DATA_LOADED: 'Данные успешно загружены',
    POST_CREATED: 'Пост успешно создан',
    FORM_SUBMITTED: 'Форма успешно отправлена',
    FILE_UPLOADED: 'Файл успешно загружен',
  },
  ERROR: {
    GENERIC: 'Произошла ошибка',
    NETWORK: 'Ошибка сети',
    VALIDATION: 'Ошибка валидации',
    FILE_UPLOAD: 'Ошибка загрузки файла',
  },
  LOADING: {
    DEFAULT: 'Загрузка...',
    UPLOADING: 'Загрузка файла...',
    SUBMITTING: 'Отправка...',
  },
} as const;

export const LOADING_MESSAGES = {
  DEFAULT: 'Загрузка...',
  POSTS: 'Загрузка постов...',
  COMMENTS: 'Загрузка комментариев...',
  UPLOADING: 'Загрузка файла...',
  SUBMITTING: 'Отправка формы...',
  PROCESSING: 'Обработка...',
} as const;

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

export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s-()]+$/,
  URL: /^https?:\/\/.+/,
  LETTERS_ONLY: /^[a-zA-Zа-яА-Я\s]+$/,
} as const;
