/**
 * Custom hook for API operations with error handling
 * Кастомный хук для API операций с обработкой ошибок
 */

import { useState, useCallback } from 'react';
import { ApiClientError } from '@/lib/api';
import { LoadingState, UseApiReturn } from '@/types';
import { ERROR_MESSAGES } from '@/constants';

/**
 * Generic hook for handling API operations.
 * Provides loading state, error handling, and data management.
 * Универсальный хук для обработки API операций с состоянием загрузки и обработкой ошибок
 * @template T The expected type of the successful API response data
 * @param apiFunction - The asynchronous function that performs the API call
 * @returns An object containing the current state and actions
 */
export function useApi<T = unknown>(
  apiFunction: (...args: unknown[]) => Promise<T>,
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<LoadingState>('idle');

  const execute = useCallback(
    async (...args: unknown[]): Promise<T | null> => {
      setLoading(true);
      setError(null);
      setState('loading');

      try {
        const result = await apiFunction(...args);

        setData(result);
        setLoading(false);
        setError(null);
        setState('success');

        return result;
      } catch (error) {
        const errorMessage =
          error instanceof ApiClientError ? error.message : ERROR_MESSAGES.UNKNOWN;

        setData(null);
        setLoading(false);
        setError(errorMessage);
        setState('error');

        return null;
      }
    },
    [apiFunction],
  );

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
    setState('idle');
  }, []);

  return {
    data,
    loading,
    error,
    state,
    execute,
    reset,
  };
}

/**
 * Hook for handling form submissions with loading states and error handling.
 * Хук для обработки отправки форм с состояниями загрузки и обработкой ошибок
 * @template T The expected type of the successful submission response
 * @param submitFunction - The asynchronous function that performs the form submission
 * @returns An object containing submission state and actions
 */
export function useFormSubmission<T = unknown>(submitFunction: (data: unknown) => Promise<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const submit = useCallback(
    async (data: unknown): Promise<T | null> => {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      try {
        const result = await submitFunction(data);
        setSubmitSuccess(true);
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof ApiClientError ? error.message : ERROR_MESSAGES.VALIDATION;

        setSubmitError(errorMessage);
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [submitFunction],
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
