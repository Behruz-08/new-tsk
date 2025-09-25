/**
 * Comments service with improved error handling
 * Сервис для работы с комментариями
 */

import { Comment } from '@/types';
import { apiClient, localApiClient } from '@/lib/api-client';

/**
 * Comments service interface
 */
export interface CommentsService {
  getAll(): Promise<Comment[]>;
  getById(id: number): Promise<Comment>;
  getByPostId(postId: number): Promise<Comment[]>;
}

/**
 * Comments service implementation
 */
class CommentsServiceImpl implements CommentsService {
  /**
   * Get all comments
   */
  async getAll(): Promise<Comment[]> {
    try {
      if (process.env.NODE_ENV === 'development') {
        // Use local API in development
        const response = await localApiClient.get<{ comments: Comment[] }>('/api/comments');
        return response.comments;
      } else {
        // Use JSONPlaceholder in production
        return await apiClient.get<Comment[]>('/comments');
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      throw error;
    }
  }

  /**
   * Get comment by ID
   */
  async getById(id: number): Promise<Comment> {
    try {
      return await apiClient.get<Comment>(`/comments/${id}`);
    } catch (error) {
      console.error(`Failed to fetch comment ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get comments by post ID
   */
  async getByPostId(postId: number): Promise<Comment[]> {
    try {
      return await apiClient.get<Comment[]>(`/posts/${postId}/comments`);
    } catch (error) {
      console.error(`Failed to fetch comments for post ${postId}:`, error);
      throw error;
    }
  }
}

/**
 * Export singleton instance
 */
export const commentsService = new CommentsServiceImpl();
