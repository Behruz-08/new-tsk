import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(50, 'Имя не может быть длиннее 50 символов'),
  email: z.string().email('Введите корректный email адрес'),
  message: z
    .string()
    .min(10, 'Сообщение должно содержать минимум 10 символов')
    .max(1000, 'Сообщение не может быть длиннее 1000 символов'),
  file: z.instanceof(File).optional().or(z.string().optional()),
});

export const postFormSchema = z.object({
  title: z
    .string()
    .min(3, 'Заголовок должен содержать минимум 3 символа')
    .max(100, 'Заголовок не может быть длиннее 100 символов'),
  body: z
    .string()
    .min(10, 'Содержимое должно содержать минимум 10 символов')
    .max(2000, 'Содержимое не может быть длиннее 2000 символов'),
  file: z.instanceof(File).optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type PostFormData = z.infer<typeof postFormSchema>;
