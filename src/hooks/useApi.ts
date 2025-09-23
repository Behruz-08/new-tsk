/**
 * Custom hook for API operations with error handling
 */

import { useState, useCallback } from "react";
import { ApiClientError } from "@/lib/api";
import { LoadingState } from "@/types";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  state: LoadingState;
}

interface UseApiActions<T> {
  execute: (...args: unknown[]) => Promise<T | null>;
  reset: () => void;
}

/**
 * Generic hook for handling API operations
 * Provides loading state, error handling, and data management
 */
export function useApi<T = unknown>(
  apiFunction: (...args: unknown[]) => Promise<T>,
): UseApiState<T> & UseApiActions<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    state: "idle",
  });

  const execute = useCallback(
    async (...args: unknown[]): Promise<T | null> => {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        state: "loading",
      }));

      try {
        const result = await apiFunction(...args);

        setState({
          data: result,
          loading: false,
          error: null,
          state: "success",
        });

        return result;
      } catch (error) {
        const errorMessage =
          error instanceof ApiClientError
            ? error.message
            : "Произошла неизвестная ошибка";

        setState((prev) => ({
          ...prev,
          data: null,
          loading: false,
          error: errorMessage,
          state: "error",
        }));

        return null;
      }
    },
    [apiFunction],
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      state: "idle",
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * Hook for handling form submissions with loading states
 */
export function useFormSubmission<T = unknown>(
  submitFunction: (data: unknown) => Promise<T>,
) {
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
          error instanceof ApiClientError
            ? error.message
            : "Ошибка при отправке формы";

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
