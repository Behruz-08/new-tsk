import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { FILE_CONFIG } from '@/constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {},
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  };

  return new Intl.DateTimeFormat('ru-RU', defaultOptions).format(dateObj);
}

export function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
}

export async function retry<T>(fn: () => Promise<T>, retries: number, delay: number): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    await sleep(delay);
    return retry(fn, retries - 1, delay * 2);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isFileTypeAllowed(mimeType: string): boolean {
  return (FILE_CONFIG.ALLOWED_TYPES as readonly string[]).includes(mimeType);
}

export function validateFile(file: File): { isValid: boolean; error?: string } {
  if (file.size > FILE_CONFIG.MAX_SIZE) {
    return {
      isValid: false,
      error: `Файл слишком большой. Максимальный размер: ${formatFileSize(FILE_CONFIG.MAX_SIZE)}`,
    };
  }

  if (!isFileTypeAllowed(file.type)) {
    return {
      isValid: false,
      error: `Неподдерживаемый тип файла. Разрешены: ${FILE_CONFIG.ALLOWED_TYPES.join(', ')}`,
    };
  }

  return { isValid: true };
}
