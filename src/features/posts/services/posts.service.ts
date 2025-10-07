import type { Post } from '@/entities/post';
import { zPosts, zPost } from '@/entities/post';
import { apiClient, localApiClient } from '@/shared/api';

export const postsService = {
  async getAll(): Promise<Post[]> {
    try {
      const response = await localApiClient.get<{ posts: Post[] }>('/api/posts');
      return zPosts.parse(response.posts);
    } catch (error) {
      throw error;
    }
  },

  async getById(id: number): Promise<Post> {
    try {
      const data = await apiClient.get<Post>(`/posts/${id}`);
      return zPost.parse(data);
    } catch (error) {
      throw error;
    }
  },

  async create(data: Omit<Post, 'id'>): Promise<Post> {
    try {
      const response = await localApiClient.post<{ post: Post }>('/api/posts', data);
      return response.post;
    } catch (error) {
      throw error;
    }
  },
} as const;
