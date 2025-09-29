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

export const SUCCESS_MESSAGES = {
  FORM_SUBMITTED: 'Форма успешно отправлена!',
  POST_CREATED: 'Пост успешно создан!',
  POST_UPDATED: 'Пост успешно обновлен!',
  POST_DELETED: 'Пост успешно удален!',
  FILE_UPLOADED: 'Файл успешно загружен!',
  DATA_LOADED: 'Данные успешно загружены!',
} as const;

export const LOADING_MESSAGES = {
  LOADING_POSTS: 'Загрузка постов...',
  LOADING_COMMENTS: 'Загрузка комментариев...',
  LOADING_USERS: 'Загрузка пользователей...',
  SUBMITTING_FORM: 'Отправка формы...',
  UPLOADING_FILE: 'Загрузка файла...',
  PROCESSING: 'Обработка...',
} as const;

export const FILE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024,
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
  PHONE: /^\+?[1-9]\d{1,14}$/,
  URL: /^https?:\/\/.+/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  LETTERS_ONLY: /^[а-яА-Яa-zA-Z\s]+$/,
  NUMBERS_ONLY: /^\d+$/,
} as const;
