import { toast } from 'sonner';
import { SUCCESS_MESSAGES, ERROR_MESSAGES, LOADING_MESSAGES } from '@/constants';

export function useNotifications() {
  const showSuccess = (message: string, options?: { duration?: number; description?: string }) => {
    toast.success(message, {
      duration: options?.duration || 4000,
      description: options?.description,
      style: {
        background: 'rgba(0, 255, 136, 0.1)',
        border: '1px solid rgba(0, 255, 136, 0.3)',
        color: '#ffffff',
      },
    });
  };

  const showError = (message: string, options?: { duration?: number; description?: string }) => {
    toast.error(message, {
      duration: options?.duration || 6000,
      description: options?.description,
      style: {
        background: 'rgba(255, 71, 87, 0.1)',
        border: '1px solid rgba(255, 71, 87, 0.3)',
        color: '#ffffff',
      },
    });
  };

  const showWarning = (message: string, options?: { duration?: number; description?: string }) => {
    toast.warning(message, {
      duration: options?.duration || 5000,
      description: options?.description,
      style: {
        background: 'rgba(255, 184, 0, 0.1)',
        border: '1px solid rgba(255, 184, 0, 0.3)',
        color: '#ffffff',
      },
    });
  };

  const showInfo = (message: string, options?: { duration?: number; description?: string }) => {
    toast.info(message, {
      duration: options?.duration || 4000,
      description: options?.description,
      style: {
        background: 'rgba(0, 212, 255, 0.1)',
        border: '1px solid rgba(0, 212, 255, 0.3)',
        color: '#ffffff',
      },
    });
  };

  const showLoading = (message: string, options?: { duration?: number }) => {
    return toast.loading(message, {
      duration: options?.duration || 0,
      style: {
        background: 'rgba(139, 92, 246, 0.1)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        color: '#ffffff',
      },
    });
  };

  const dismiss = (toastId?: string | number) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  };

  const dismissAll = () => {
    toast.dismiss();
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    dismiss,
    dismissAll,
  };
}

export function useFormNotifications() {
  const notifications = useNotifications();

  const showFormSuccess = (message?: string) => {
    notifications.showSuccess(message || SUCCESS_MESSAGES.FORM_SUBMITTED);
  };

  const showFormError = (message?: string) => {
    notifications.showError(message || ERROR_MESSAGES.VALIDATION);
  };

  const showValidationError = (field: string, message: string) => {
    notifications.showError(`${field}: ${message}`);
  };

  const showLoadingState = (message?: string) => {
    return notifications.showLoading(message || LOADING_MESSAGES.SUBMITTING_FORM);
  };

  return {
    showFormSuccess,
    showFormError,
    showValidationError,
    showLoadingState,
  };
}

export function useApiNotifications() {
  const notifications = useNotifications();

  const showApiSuccess = (operation: string) => {
    const message = `${operation} успешно выполнена`;
    notifications.showSuccess(message);
  };

  const showApiError = (error: Error | string, operation?: string) => {
    const message = typeof error === 'string' ? error : error.message;
    const fullMessage = operation ? `${operation}: ${message}` : message;
    notifications.showError(fullMessage);
  };

  const showNetworkError = () => {
    notifications.showError(ERROR_MESSAGES.NETWORK);
  };

  const showTimeoutError = () => {
    notifications.showError(ERROR_MESSAGES.TIMEOUT);
  };

  const showServerError = () => {
    notifications.showError(ERROR_MESSAGES.SERVER_ERROR);
  };

  return {
    showApiSuccess,
    showApiError,
    showNetworkError,
    showTimeoutError,
    showServerError,
  };
}
