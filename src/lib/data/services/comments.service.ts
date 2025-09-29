import { apiClient, localApiClient } from '@/lib/api/api-client';
import type { Comment } from '@/types';

export interface CommentsService {
  getAll(): Promise<Comment[]>;
  getById(id: number): Promise<Comment>;
  getByPostId(postId: number): Promise<Comment[]>;
}

class CommentsServiceImpl implements CommentsService {
  async getAll(): Promise<Comment[]> {
    try {
      if (process.env.NODE_ENV === 'development') {
        const response = await localApiClient.get<{ comments: Comment[] }>('/api/comments');
        return response.comments;
      } else {
        return await apiClient.get<Comment[]>('/comments');
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<Comment> {
    try {
      return await apiClient.get<Comment>(`/comments/${id}`);
    } catch (error) {
      console.error(`Failed to fetch comment ${id}:`, error);
      throw error;
    }
  }

  async getByPostId(postId: number): Promise<Comment[]> {
    try {
      return await apiClient.get<Comment[]>(`/posts/${postId}/comments`);
    } catch (error) {
      console.error(`Failed to fetch comments for post ${postId}:`, error);
      throw error;
    }
  }
}

export const commentsService = new CommentsServiceImpl();
