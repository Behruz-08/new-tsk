/**
 * Comprehensive form hooks with validation and error handling
 * Комплексные хуки для форм с валидацией и обработкой ошибок
 */

import {
  useForm as useReactHookForm,
  UseFormProps,
  FieldValues,
  Path,
  DefaultValues,
  Resolver,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { debounce } from '@/lib/utils';
import { useApiNotifications } from '@/hooks/useNotifications';

/**
 * Type-safe wrapper for zodResolver to handle generic types
 */
function createZodResolver<T extends FieldValues>(schema: z.ZodSchema<T>): Resolver<T> {
  return zodResolver(schema as never) as Resolver<T>;
}

/**
 * Enhanced form submission state
 */
interface FormSubmissionState {
  isSubmitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;
}

/**
 * Enhanced form submission hook
 */
export function useFormSubmission<T = unknown>() {
  const [state, setState] = useState<FormSubmissionState>({
    isSubmitting: false,
    submitError: null,
    submitSuccess: false,
  });
  const { showApiError } = useApiNotifications();

  const submit = useCallback(
    async (submitFn: (data: unknown) => Promise<T>, data: unknown): Promise<T | null> => {
      setState({
        isSubmitting: true,
        submitError: null,
        submitSuccess: false,
      });

      try {
        const result = await submitFn(data);
        setState({
          isSubmitting: false,
          submitError: null,
          submitSuccess: true,
        });
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка';
        setState({
          isSubmitting: false,
          submitError: errorMessage,
          submitSuccess: false,
        });
        showApiError(errorMessage, 'Отправка формы');
        throw error;
      }
    },
    [showApiError],
  );

  const resetSubmission = useCallback(() => {
    setState({
      isSubmitting: false,
      submitError: null,
      submitSuccess: false,
    });
  }, []);

  return {
    ...state,
    submit,
    resetSubmission,
  };
}

/**
 * Enhanced validated form hook
 */
export function useValidatedForm<T extends FieldValues>(
  schema: z.ZodSchema<T>,
  defaultValues?: Partial<T>,
  options?: Omit<UseFormProps<T>, 'resolver' | 'defaultValues'>,
) {
  const form = useReactHookForm<T>({
    resolver: createZodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T> | undefined,
    mode: 'onChange',
    ...options,
  });

  const {
    formState: { errors, isValid, isDirty, isSubmitting },
  } = form;

  // Enhanced error handling
  const getFieldError = useCallback(
    (fieldName: Path<T>) => {
      const error = errors[fieldName];
      return error?.message || null;
    },
    [errors],
  );

  const hasFieldError = useCallback(
    (fieldName: Path<T>) => {
      return !!errors[fieldName];
    },
    [errors],
  );

  const hasAnyError = Object.keys(errors).length > 0;

  return {
    ...form,
    getFieldError,
    hasFieldError,
    hasAnyError,
    isValid,
    isDirty,
    isSubmitting,
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

/**
 * Form validation utilities
 */
export const formValidation = {
  /**
   * Required field validation
   */
  required: (message: string = 'Это поле обязательно') => z.string().min(1, message),

  /**
   * Email validation
   */
  email: (message: string = 'Введите корректный email') => z.string().email(message),

  /**
   * Password validation
   */
  password: (minLength: number = 8, message?: string) =>
    z.string().min(minLength, message || `Пароль должен содержать минимум ${minLength} символов`),

  /**
   * Phone number validation
   */
  phone: (message: string = 'Введите корректный номер телефона') =>
    z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, message),

  /**
   * URL validation
   */
  url: (message: string = 'Введите корректный URL') => z.string().url(message),

  /**
   * File validation
   */
  file: (maxSize: number = 5 * 1024 * 1024, message?: string) =>
    z
      .instanceof(File, { message: 'Выберите файл' })
      .refine(
        (file) => file.size <= maxSize,
        message || `Размер файла не должен превышать ${Math.round(maxSize / 1024 / 1024)}MB`,
      ),

  /**
   * Image file validation
   */
  imageFile: (maxSize: number = 5 * 1024 * 1024, message?: string) =>
    z
      .instanceof(File, { message: 'Выберите изображение' })
      .refine((file) => file.type.startsWith('image/'), 'Выберите изображение')
      .refine(
        (file) => file.size <= maxSize,
        message || `Размер файла не должен превышать ${Math.round(maxSize / 1024 / 1024)}MB`,
      ),

  /**
   * Text length validation
   */
  textLength: (min: number, max: number, message?: string) =>
    z
      .string()
      .min(min, message || `Минимум ${min} символов`)
      .max(max, message || `Максимум ${max} символов`),

  /**
   * Number range validation
   */
  numberRange: (min: number, max: number, message?: string) =>
    z
      .number()
      .min(min, message || `Значение должно быть не менее ${min}`)
      .max(max, message || `Значение должно быть не более ${max}`),

  /**
   * Array length validation
   */
  arrayLength: (min: number, max: number, message?: string) =>
    z
      .array(z.any())
      .min(min, message || `Минимум ${min} элементов`)
      .max(max, message || `Максимум ${max} элементов`),
};

/**
 * Common form schemas
 */
export const commonSchemas = {
  /**
   * Contact form schema
   */
  contactForm: z.object({
    name: formValidation.required('Введите ваше имя'),
    email: formValidation.email(),
    message: formValidation.textLength(
      10,
      1000,
      'Сообщение должно содержать от 10 до 1000 символов',
    ),
    file: formValidation.file().optional(),
  }),

  /**
   * Post form schema
   */
  postForm: z.object({
    title: formValidation.textLength(5, 100, 'Заголовок должен содержать от 5 до 100 символов'),
    body: formValidation.textLength(10, 1000, 'Содержимое должно содержать от 10 до 1000 символов'),
    file: formValidation.file().optional(),
  }),

  /**
   * User profile schema
   */
  userProfile: z.object({
    name: formValidation.required(),
    email: formValidation.email(),
    phone: formValidation.phone().optional(),
    website: formValidation.url().optional(),
    bio: formValidation.textLength(0, 500, 'Биография не должна превышать 500 символов').optional(),
  }),

  /**
   * Login form schema
   */
  loginForm: z.object({
    email: formValidation.email(),
    password: formValidation.password(),
    rememberMe: z.boolean().optional(),
  }),

  /**
   * Registration form schema
   */
  registrationForm: z
    .object({
      name: formValidation.required(),
      email: formValidation.email(),
      password: formValidation.password(),
      confirmPassword: formValidation.required('Подтвердите пароль'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Пароли не совпадают',
      path: ['confirmPassword'],
    }),
};

/**
 * Form field props helper
 */
export function createFieldProps<T extends FieldValues>(
  form: ReturnType<typeof useValidatedForm<T>>,
  fieldName: Path<T>,
) {
  return {
    ...form.register(fieldName),
    error: form.getFieldError(fieldName),
    hasError: form.hasFieldError(fieldName),
  };
}

/**
 * Form submission with toast notifications
 */
export function useFormSubmissionWithToast<T = unknown>() {
  const submission = useFormSubmission<T>();

  const submitWithToast = useCallback(
    async (
      submitFn: (data: unknown) => Promise<T>,
      data: unknown,
      successMessage: string = 'Данные успешно сохранены',
    ): Promise<T | null> => {
      try {
        const result = await submission.submit(submitFn, data);
        toast.success(successMessage);
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка';
        toast.error(errorMessage);
        return null;
      }
    },
    [submission],
  );

  return {
    ...submission,
    submitWithToast,
  };
}

/**
 * Auto-save form hook
 */
export function useAutoSave<T extends FieldValues>(
  form: ReturnType<typeof useValidatedForm<T>>,
  saveFn: (data: T) => Promise<void>,
  delay: number = 2000,
) {
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const autoSave = useCallback(
    async (data: T) => {
      if (!form.isDirty || !form.isValid) return;

      setIsAutoSaving(true);
      try {
        await saveFn(data);
        setLastSaved(new Date());
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setIsAutoSaving(false);
      }
    },
    [form.isDirty, form.isValid, saveFn],
  );

  // Debounced auto-save
  const debouncedAutoSave = useMemo(
    () => debounce((...args: unknown[]) => autoSave(args[0] as T), delay),
    [autoSave, delay],
  );

  return {
    isAutoSaving,
    lastSaved,
    autoSave: debouncedAutoSave,
  };
}
