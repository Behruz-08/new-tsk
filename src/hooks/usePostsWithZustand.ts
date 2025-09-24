/**
 * Custom hook for posts management using Zustand
 * Хук для управления постами с использованием Zustand
 */

import { useEffect, useCallback } from 'react';
import { usePostsStore, usePosts, useLocalPosts, usePostsLoading, usePostsError, usePostsActions } from '@/stores/postsStore';
import { postsApi } from '@/lib/api';
import { Post } from '@/types';

interface UsePostsWithZustandReturn {
  posts: Post[];
  localPosts: Post[];
  isLoading: boolean;
  error: string | null;
  refreshPosts: () => Promise<void>;
  createPost: (postData: Omit<Post, 'id'>) => Promise<Post | null>;
  updatePost: (id: number, postData: Partial<Post>) => Promise<void>;
  deletePost: (id: number) => Promise<void>;
  getPostById: (id: number) => Post | undefined;
}

export const usePostsWithZustand = (): UsePostsWithZustandReturn => {
  const posts = usePosts();
  const localPosts = useLocalPosts();
  const isLoading = usePostsLoading();
  const error = usePostsError();
  const actions = usePostsActions();
  const { getPostById } = usePostsStore();

  // Load posts on mount
  useEffect(() => {
    refreshPosts();
  }, [refreshPosts]);

  const refreshPosts = useCallback(async () => {
    try {
      actions.setLoading(true);
      actions.clearError();
      
      const fetchedPosts = await postsApi.getAll();
      actions.setPosts(fetchedPosts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch posts';
      actions.setError(errorMessage);
      console.error('Error fetching posts:', err);
    } finally {
      actions.setLoading(false);
    }
  }, [actions]);

  const createPost = useCallback(async (postData: Omit<Post, 'id'>): Promise<Post | null> => {
    try {
      actions.setLoading(true);
      actions.clearError();
      
      const newPost = await postsApi.create(postData);
      actions.addPost(newPost);
      
      return newPost;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create post';
      actions.setError(errorMessage);
      console.error('Error creating post:', err);
      return null;
    } finally {
      actions.setLoading(false);
    }
  }, [actions]);

  const updatePost = useCallback(async (id: number, postData: Partial<Post>): Promise<void> => {
    try {
      actions.setLoading(true);
      actions.clearError();
      
      await postsApi.update(id, postData);
      actions.updatePost(id, postData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update post';
      actions.setError(errorMessage);
      console.error('Error updating post:', err);
    } finally {
      actions.setLoading(false);
    }
  }, [actions]);

  const deletePost = useCallback(async (id: number): Promise<void> => {
    try {
      actions.setLoading(true);
      actions.clearError();
      
      await postsApi.delete(id);
      actions.deletePost(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete post';
      actions.setError(errorMessage);
      console.error('Error deleting post:', err);
    } finally {
      actions.setLoading(false);
    }
  }, [actions]);

  return {
    posts,
    localPosts,
    isLoading,
    error,
    refreshPosts,
    createPost,
    updatePost,
    deletePost,
    getPostById,
  };
};
