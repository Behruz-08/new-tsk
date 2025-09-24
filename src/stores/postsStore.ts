/**
 * Zustand store for posts management
 * Хранилище состояния для управления постами
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Post } from '@/types';

interface PostsState {
  // State
  posts: Post[];
  localPosts: Post[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  updatePost: (id: number, post: Partial<Post>) => void;
  deletePost: (id: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Computed
  getPostById: (id: number) => Post | undefined;
  getLocalPosts: () => Post[];
  getJsonPlaceholderPosts: () => Post[];
}

export const usePostsStore = create<PostsState>()(
  devtools(
    (set, get) => ({
      // Initial state
      posts: [],
      localPosts: [],
      isLoading: false,
      error: null,

      // Actions
      setPosts: (posts) => set({ posts }, false, 'setPosts'),
      
      addPost: (post) => set((state) => ({
        posts: [post, ...state.posts],
        localPosts: [post, ...state.localPosts],
      }), false, 'addPost'),
      
      updatePost: (id, updatedPost) => set((state) => ({
        posts: state.posts.map((post) =>
          post.id === id ? { ...post, ...updatedPost } : post
        ),
        localPosts: state.localPosts.map((post) =>
          post.id === id ? { ...post, ...updatedPost } : post
        ),
      }), false, 'updatePost'),
      
      deletePost: (id) => set((state) => ({
        posts: state.posts.filter((post) => post.id !== id),
        localPosts: state.localPosts.filter((post) => post.id !== id),
      }), false, 'deletePost'),
      
      setLoading: (isLoading) => set({ isLoading }, false, 'setLoading'),
      
      setError: (error) => set({ error }, false, 'setError'),
      
      clearError: () => set({ error: null }, false, 'clearError'),

      // Computed getters
      getPostById: (id) => {
        const state = get();
        return state.posts.find((post) => post.id === id);
      },
      
      getLocalPosts: () => {
        const state = get();
        return state.localPosts;
      },
      
      getJsonPlaceholderPosts: () => {
        const state = get();
        return state.posts.filter((post) => !state.localPosts.some((localPost) => localPost.id === post.id));
      },
    }),
    {
      name: 'posts-store', // Unique name for devtools
    }
  )
);

// Selectors for better performance
export const usePosts = () => usePostsStore((state) => state.posts);
export const useLocalPosts = () => usePostsStore((state) => state.localPosts);
export const usePostsLoading = () => usePostsStore((state) => state.isLoading);
export const usePostsError = () => usePostsStore((state) => state.error);

// Action selectors
export const usePostsActions = () => usePostsStore((state) => ({
  setPosts: state.setPosts,
  addPost: state.addPost,
  updatePost: state.updatePost,
  deletePost: state.deletePost,
  setLoading: state.setLoading,
  setError: state.setError,
  clearError: state.clearError,
}));
