/**
 * Improved API mutation hook with better error handling
 * Улучшенный хук для API мутаций
 */

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { ApiError } from '@/lib/api-client';
import { toast } from 'sonner';

/**
 * Generic API mutation hook
 */
export function useApiMutation<TData, TVariables, TError = ApiError>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onError: (error) => {
      const errorMessage = error instanceof ApiError ? error.message : 'Произошла ошибка';

      toast.error(errorMessage);
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
    ...options,
  });
}

/**
 * Create post mutation hook
 */
export function useCreatePostMutation() {
  return useApiMutation(
    async (data: { title: string; body: string; userId?: number; fileUrl?: string }) => {
      const { postsService } = await import('@/lib/services');
      return postsService.create({
        ...data,
        userId: data.userId || 1, // Default to user 1 if not provided
      });
    },
    {
      onSuccess: () => {
        toast.success('Пост успешно создан!');
      },
    },
  );
}

/**
 * Update post mutation hook
 */
export function useUpdatePostMutation() {
  return useApiMutation(
    async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<{ title: string; body: string; userId: number }>;
    }) => {
      const { postsService } = await import('@/lib/services');
      return postsService.update(id, data);
    },
    {
      onSuccess: () => {
        toast.success('Пост успешно обновлен!');
      },
    },
  );
}

/**
 * Delete post mutation hook
 */
export function useDeletePostMutation() {
  return useApiMutation(
    async (id: number) => {
      const { postsService } = await import('@/lib/services');
      return postsService.delete(id);
    },
    {
      onSuccess: () => {
        toast.success('Пост успешно удален!');
      },
    },
  );
}

/**
 * Submit form mutation hook
 */
export function useSubmitFormMutation() {
  return useApiMutation(
    async (formData: FormData) => {
      const { formsService } = await import('@/lib/services');
      return formsService.submitContactForm(formData);
    },
    {
      onSuccess: () => {
        toast.success('Форма успешно отправлена!');
      },
    },
  );
}

/**
 * Create post with file mutation hook
 */
export function useCreatePostWithFileMutation() {
  return useApiMutation(
    async ({
      postData,
      file,
    }: {
      postData: { title: string; body: string; userId?: number };
      file?: File;
    }) => {
      const { formsService } = await import('@/lib/services');
      return formsService.createPostWithFile(postData, file);
    },
    {
      onSuccess: () => {
        toast.success('Пост с файлом успешно создан!');
      },
    },
  );
}
