import type { Comment } from '@/entities/comment';
import { zComments, zComment } from '@/entities/comment';
import { apiClient, localApiClient } from '@/shared/api';

export const commentsService = {
  async getAll(): Promise<Comment[]> {
    try {
      if (process.env.NODE_ENV === 'development') {
        const response = await localApiClient.get<{ comments: Comment[] }>('/api/comments');
        return zComments.parse(response.comments);
      } else {
        const data = await apiClient.get<Comment[]>('/comments');
        return zComments.parse(data);
      }
    } catch (error) {
      throw error;
    }
  },

  async getById(id: number): Promise<Comment> {
    try {
      const data = await apiClient.get<Comment>(`/comments/${id}`);
      return zComment.parse(data);
    } catch (error) {
      throw error;
    }
  },

  async getByPostId(postId: number): Promise<Comment[]> {
    try {
      const data = await apiClient.get<Comment[]>(`/posts/${postId}/comments`);
      return zComments.parse(data);
    } catch (error) {
      throw error;
    }
  },
} as const;
