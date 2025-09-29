import { apiClient, localApiClient } from '@/lib/api/api-client';
import type { Post } from '@/types';

export interface PostsService {
  getAll(): Promise<Post[]>;
  getById(id: number): Promise<Post>;
  create(data: Omit<Post, 'id'>): Promise<Post>;
  update(id: number, data: Partial<Post>): Promise<Post>;
  delete(id: number): Promise<void>;
}

class PostsServiceImpl implements PostsService {
  async getAll(): Promise<Post[]> {
    try {
      const response = await localApiClient.get<{ posts: Post[] }>('/api/posts');
      return response.posts;
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<Post> {
    try {
      return await apiClient.get<Post>(`/posts/${id}`);
    } catch (error) {
      console.error(`Failed to fetch post ${id}:`, error);
      throw error;
    }
  }

  async create(data: Omit<Post, 'id'>): Promise<Post> {
    try {
      const response = await localApiClient.post<{ post: Post }>('/api/posts', data);
      return response.post;
    } catch (error) {
      console.error('Failed to create post:', error);
      throw error;
    }
  }

  async update(id: number, data: Partial<Post>): Promise<Post> {
    try {
      return await apiClient.put<Post>(`/posts/${id}`, data);
    } catch (error) {
      console.error(`Failed to update post ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete<void>(`/posts/${id}`);
    } catch (error) {
      console.error(`Failed to delete post ${id}:`, error);
      throw error;
    }
  }
}

export const postsService = new PostsServiceImpl();
