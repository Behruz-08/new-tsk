import type { LocalPost } from '@/types/api';

const LOCAL_STORAGE_KEY = 'localPosts';

let localPosts: LocalPost[] =
  typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]') : [];

const saveLocalPosts = (posts: LocalPost[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(posts));
  }
};

export const getLocalPosts = (): LocalPost[] => {
  return localPosts;
};

export const addLocalPost = (newPost: LocalPost): void => {
  localPosts.unshift(newPost);
  if (localPosts.length > 50) {
    localPosts = localPosts.slice(0, 50);
  }
  saveLocalPosts(localPosts);
};

export const resetLocalPosts = (): void => {
  localPosts = [];
  saveLocalPosts(localPosts);
};
