import { FormSubmissionResult, PostCreationResult } from '@/types';
import { localApiClient } from '@/lib/api/api-client';

export interface FormsService {
  submitContactForm(formData: FormData): Promise<FormSubmissionResult>;
  createPostWithFile(
    postData: { title: string; body: string; userId?: number },
    file?: File,
  ): Promise<PostCreationResult>;
  uploadFileToBlob(fileFormData: FormData): Promise<{ url: string } | undefined>;
}

class FormsServiceImpl implements FormsService {
  async submitContactForm(formData: FormData): Promise<FormSubmissionResult> {
    try {
      let fileUrl: string | undefined;
      const file = formData.get('file') as File | null;

      if (file) {
        const fileFormData = new FormData();
        fileFormData.append('file', file);

        const fileResponse = await localApiClient.postFormData<{ url: string }>(
          '/api/files',
          fileFormData,
        );
        fileUrl = fileResponse.url;
        formData.set('fileUrl', fileUrl);
        formData.delete('file'); // Remove the file from formData as we've uploaded it to Blob
      }

      const response = await localApiClient.postFormData<FormSubmissionResult>(
        '/api/submit',
        formData,
      );
      return response;
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      throw error;
    }
  }

  async createPostWithFile(
    postData: { title: string; body: string; userId?: number },
    file?: File,
  ): Promise<PostCreationResult> {
    try {
      let fileUrl: string | undefined;
      if (file) {
        const fileFormData = new FormData();
        fileFormData.append('file', file);

        const fileResponse = await localApiClient.postFormData<{ url: string }>(
          '/api/files',
          fileFormData,
        );
        fileUrl = fileResponse.url;
      }

      const response = await localApiClient.post<PostCreationResult>('/api/posts', {
        ...postData,
        userId: postData.userId || 1,
        ...(fileUrl && { fileUrl }),
      });

      return response;
    } catch (error) {
      console.error('Failed to create post with file:', error);
      throw error;
    }
  }

  async uploadFileToBlob(fileFormData: FormData): Promise<{ url: string } | undefined> {
    try {
      const fileResponse = await localApiClient.postFormData<{ url: string }>(
        '/api/files',
        fileFormData,
      );
      return fileResponse;
    } catch (error) {
      console.error('Failed to upload file to Vercel Blob:', error);
      return undefined;
    }
  }
}

export const formsService = new FormsServiceImpl();
