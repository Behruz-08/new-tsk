import { LocalPost } from '@/types/api';

let localPosts: LocalPost[] = [];

export const getLocalPosts = (): LocalPost[] => {
  return localPosts;
};

export const addLocalPost = (newPost: LocalPost): void => {
  localPosts.unshift(newPost);
  // Limit local posts to 50 to prevent memory issues
  if (localPosts.length > 50) {
    localPosts = localPosts.slice(0, 50);
  }
};

export const resetLocalPosts = (): void => {
  localPosts = [];
};
