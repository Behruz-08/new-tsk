import type { PostCreationResult } from '@/entities/post';
import { localApiClient } from '@/shared/api';

interface CreatePostData {
  title: string;
  body: string;
  userId?: number;
}

export async function createPostWithFileProcess(
  postData: CreatePostData,
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
    throw error;
  }
}
