/**
 * Forms service for handling form submissions
 * Сервис для обработки отправки форм
 */

import { FormSubmissionResult, PostCreationResult } from '@/types';
import { localApiClient } from '@/lib/api-client';

/**
 * Forms service interface
 */
export interface FormsService {
  submitContactForm(formData: FormData): Promise<FormSubmissionResult>;
  createPostWithFile(
    postData: { title: string; body: string; userId?: number },
    file?: File,
  ): Promise<PostCreationResult>;
}

/**
 * Forms service implementation
 */
class FormsServiceImpl implements FormsService {
  /**
   * Submit contact form
   */
  async submitContactForm(formData: FormData): Promise<FormSubmissionResult> {
    try {
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

  /**
   * Create post with file upload
   */
  async createPostWithFile(
    postData: { title: string; body: string; userId?: number },
    file?: File,
  ): Promise<PostCreationResult> {
    try {
      // First upload file if provided
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

      // Create the post
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
}

/**
 * Export singleton instance
 */
export const formsService = new FormsServiceImpl();
