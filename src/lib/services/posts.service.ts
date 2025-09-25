/**
 * Posts service with improved error handling and type safety
 * Сервис для работы с постами с улучшенной обработкой ошибок
 */

import { Post } from '@/types';
import { apiClient, localApiClient } from '@/lib/api-client';

/**
 * Posts service interface
 */
export interface PostsService {
  getAll(): Promise<Post[]>;
  getById(id: number): Promise<Post>;
  create(data: Omit<Post, 'id'>): Promise<Post>;
  update(id: number, data: Partial<Post>): Promise<Post>;
  delete(id: number): Promise<void>;
}

/**
 * Posts service implementation
 */
class PostsServiceImpl implements PostsService {
  /**
   * Get all posts (combines JSONPlaceholder and local posts)
   */
  async getAll(): Promise<Post[]> {
    try {
      const response = await localApiClient.get<{ posts: Post[] }>('/api/posts');
      return response.posts;
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      throw error;
    }
  }

  /**
   * Get post by ID from JSONPlaceholder
   */
  async getById(id: number): Promise<Post> {
    try {
      return await apiClient.get<Post>(`/posts/${id}`);
    } catch (error) {
      console.error(`Failed to fetch post ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create new post (saves locally and to JSONPlaceholder)
   */
  async create(data: Omit<Post, 'id'>): Promise<Post> {
    try {
      const response = await localApiClient.post<{ post: Post }>('/api/posts', data);
      return response.post;
    } catch (error) {
      console.error('Failed to create post:', error);
      throw error;
    }
  }

  /**
   * Update post in JSONPlaceholder
   */
  async update(id: number, data: Partial<Post>): Promise<Post> {
    try {
      return await apiClient.put<Post>(`/posts/${id}`, data);
    } catch (error) {
      console.error(`Failed to update post ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete post from JSONPlaceholder
   */
  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete<void>(`/posts/${id}`);
    } catch (error) {
      console.error(`Failed to delete post ${id}:`, error);
      throw error;
    }
  }
}

/**
 * Export singleton instance
 */
export const postsService = new PostsServiceImpl();
