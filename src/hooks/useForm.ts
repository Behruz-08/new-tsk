/**
 * Custom hook for form management with react-hook-form and Zod validation
 * Кастомные хуки для управления формами с react-hook-form и Zod валидацией
 */

import { useForm as useReactHookForm, FieldValues, Resolver, DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCallback, useState } from 'react';
import { useApiNotifications } from '@/hooks/useNotifications';

/**
 * Type-safe wrapper for zodResolver to handle generic types
 * Типобезопасная обертка для zodResolver для работы с обобщенными типами
 */
function createZodResolver<T extends FieldValues>(schema: z.ZodSchema<T>): Resolver<T> {
  return zodResolver(schema as never) as Resolver<T>;
}

/**
 * Generic hook for validated forms using react-hook-form and Zod
 * Универсальный хук для валидированных форм с использованием react-hook-form и Zod
 * @template T - Тип данных формы
 * @param schema - Zod схема для валидации
 * @param defaultValues - Значения по умолчанию для полей формы
 * @returns Объект с методами и состоянием формы
 */
export function useValidatedForm<T extends FieldValues>(
  schema: z.ZodSchema<T>,
  defaultValues?: Partial<T>,
) {
  return useReactHookForm<T>({
    resolver: createZodResolver(schema),
    mode: 'onChange', // Validate on change for better UX
    defaultValues: defaultValues as DefaultValues<T>,
  });
}

/**
 * Hook for form submission with loading states and error handling
 * Хук для отправки форм с состояниями загрузки и обработкой ошибок
 * @template T - Тип данных, возвращаемых при успешной отправке
 * @returns Объект с состоянием отправки и методами
 */
export function useFormSubmission<T = unknown>() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { showApiError } = useApiNotifications();

  const submit = useCallback(
    async (submitFn: (data: unknown) => Promise<T>, data: unknown): Promise<T | null> => {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      try {
        const result = await submitFn(data);
        setSubmitSuccess(true);
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Произошла ошибка при отправке формы';

        setSubmitError(errorMessage); // Продолжаем устанавливать локальную ошибку
        showApiError(errorMessage, 'Отправка формы'); // Показываем ошибку через уведомления
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [showApiError],
  );

  const resetSubmission = useCallback(() => {
    setIsSubmitting(false);
    setSubmitError(null);
    setSubmitSuccess(false);
  }, []);

  return {
    isSubmitting,
    submitError,
    submitSuccess,
    submit,
    resetSubmission,
  };
}

/**
 * Hook for managing file uploads with validation
 */
export function useFileUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const addFile = useCallback((file: File) => {
    setUploadedFiles((prev) => [...prev, file]);
  }, []);

  const removeFile = useCallback((fileName: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.name !== fileName));
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[fileName];
      return newProgress;
    });
  }, []);

  const clearFiles = useCallback(() => {
    setUploadedFiles([]);
    setUploadProgress({});
  }, []);

  const updateProgress = useCallback((fileName: string, progress: number) => {
    setUploadProgress((prev) => ({
      ...prev,
      [fileName]: progress,
    }));
  }, []);

  return {
    uploadedFiles,
    uploadProgress,
    addFile,
    removeFile,
    clearFiles,
    updateProgress,
  };
}

/**
 * Hook for form field validation with custom error messages
 */
export function useFieldValidation() {
  const validateField = useCallback(
    (
      value: unknown,
      rules: {
        required?: boolean;
        minLength?: number;
        maxLength?: number;
        pattern?: RegExp;
        custom?: (value: unknown) => boolean;
      },
    ): string | null => {
      if (rules.required && (!value || value.toString().trim() === '')) {
        return 'Это поле обязательно для заполнения';
      }

      if (value && rules.minLength && value.toString().length < rules.minLength) {
        return `Минимальная длина: ${rules.minLength} символов`;
      }

      if (value && rules.maxLength && value.toString().length > rules.maxLength) {
        return `Максимальная длина: ${rules.maxLength} символов`;
      }

      if (value && rules.pattern && !rules.pattern.test(value.toString())) {
        return 'Некорректный формат';
      }

      if (value && rules.custom && !rules.custom(value)) {
        return 'Некорректное значение';
      }

      return null;
    },
    [],
  );

  return { validateField };
}
