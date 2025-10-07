import type { PostCreationResult } from '@/entities/post';
import { submitContactFormProcess, createPostWithFileProcess } from '@/processes/form-submission';
import type { FormSubmissionResult } from '@/shared/types/api.types';

export const formsService = {
  async submitContactForm(formData: FormData): Promise<FormSubmissionResult> {
    const fileUrl = formData.get('fileUrl') as string | null;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    return submitContactFormProcess({
      name,
      email,
      message,
      ...(fileUrl && { file: fileUrl }),
    });
  },

  async createPostWithFile(
    postData: { title: string; body: string; userId?: number },
    file?: File,
  ): Promise<PostCreationResult> {
    return createPostWithFileProcess(postData, file);
  },

  async uploadFileToBlob(fileFormData: FormData): Promise<{ url: string } | undefined> {
    try {
      const { localApiClient } = await import('@/shared/api');
      const fileResponse = await localApiClient.postFormData<{ url: string }>(
        '/api/files',
        fileFormData,
      );
      return fileResponse;
    } catch {
      return undefined;
    }
  },
} as const;
