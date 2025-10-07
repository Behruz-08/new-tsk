'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import type { DefaultValues, FieldValues, Path, Resolver, UseFormProps } from 'react-hook-form';
import { useForm as useReactHookForm } from 'react-hook-form';
import type { z } from 'zod';

import { useApiNotifications } from './useNotifications';

function createZodResolver<T extends FieldValues>(schema: z.ZodSchema<T>): Resolver<T> {
  return zodResolver(schema as never) as Resolver<T>;
}

interface FormSubmissionState {
  isSubmitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;
}

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
