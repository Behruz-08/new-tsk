import { localApiClient } from '@/shared/api';
import type { FormSubmissionResult } from '@/shared/types/api.types';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  file?: string;
}

export async function submitContactFormProcess(
  formData: ContactFormData,
): Promise<FormSubmissionResult> {
  try {
    const submissionData = new FormData();
    submissionData.append('name', formData.name);
    submissionData.append('email', formData.email);
    submissionData.append('message', formData.message);
    if (formData.file) {
      submissionData.append('fileUrl', formData.file);
    }

    const response = await localApiClient.postFormData<FormSubmissionResult>(
      '/api/submit',
      submissionData,
    );

    return response;
  } catch (error) {
    throw error;
  }
}
