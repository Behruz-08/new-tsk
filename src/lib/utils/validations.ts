import { z } from 'zod';

import { VALIDATION_PATTERNS, FILE_CONFIG } from '@/constants';

const fileSchema = z
  .instanceof(File, { message: 'Выберите файл' })
  .refine(
    (file) => file.size <= FILE_CONFIG.MAX_SIZE,
    `Размер файла не должен превышать ${FILE_CONFIG.MAX_SIZE / (1024 * 1024)}MB`,
  )
  .refine(
    (file) => (FILE_CONFIG.ALLOWED_TYPES as readonly string[]).includes(file.type),
    'Поддерживаются только изображения, PDF, TXT, JSON и другие файлы',
  );

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(50, 'Имя не должно превышать 50 символов')
    .regex(VALIDATION_PATTERNS.LETTERS_ONLY, 'Имя может содержать только буквы и пробелы'),
  email: z
    .string()
    .email('Некорректный формат email')
    .min(5, 'Email должен содержать минимум 5 символов')
    .regex(VALIDATION_PATTERNS.EMAIL, 'Некорректный формат email'),
  message: z
    .string()
    .min(10, 'Сообщение должно содержать минимум 10 символов')
    .max(500, 'Сообщение не должно превышать 500 символов')
    .trim(),
  file: z.string().url('Некорректный формат URL файла').optional().nullable(),
});

export const createPostSchema = z.object({
  title: z
    .string()
    .min(5, 'Заголовок должен содержать минимум 5 символов')
    .max(100, 'Заголовок не должен превышать 100 символов'),
  body: z
    .string()
    .min(10, 'Содержимое должно содержать минимум 10 символов')
    .max(1000, 'Содержимое не должно превышать 1000 символов'),
  userId: z
    .number()
    .int('ID пользователя должен быть целым числом')
    .positive('ID пользователя должен быть положительным'),
});

export const postFormSchema = z.object({
  title: z
    .string()
    .min(5, 'Заголовок должен содержать минимум 5 символов')
    .max(100, 'Заголовок не должен превышать 100 символов'),
  body: z
    .string()
    .min(10, 'Содержимое должно содержать минимум 10 символов')
    .max(1000, 'Содержимое не должно превышать 1000 символов'),
  file: fileSchema,
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type CreatePostData = z.infer<typeof createPostSchema>;
export type PostFormData = z.infer<typeof postFormSchema>;

export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[1-9]\d{1,14}$/,
  url: /^https?:\/\/.+/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  lettersOnly: /^[а-яА-Яa-zA-Z\s]+$/,
} as const;
