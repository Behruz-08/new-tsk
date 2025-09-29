import { apiClient, localApiClient } from '@/lib/api/api-client';
import { zPosts, zPost } from '@/shared/schemas/jsonplaceholder';
import type { Post } from '@/types';

export interface PostsService {
  getAll(): Promise<Post[]>;
  getById(id: number): Promise<Post>;
  create(data: Omit<Post, 'id'>): Promise<Post>;
}

class PostsServiceImpl implements PostsService {
  async getAll(): Promise<Post[]> {
    try {
      const response = await localApiClient.get<{ posts: Post[] }>('/api/posts');
      return zPosts.parse(response.posts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<Post> {
    try {
      const data = await apiClient.get<Post>(`/posts/${id}`);
      return zPost.parse(data);
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
}

export const postsService = new PostsServiceImpl();
