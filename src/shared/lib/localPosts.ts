import type { LocalPost } from '@/entities/post';

let localPosts: LocalPost[] = [];

export function getLocalPosts(): LocalPost[] {
  return [...localPosts];
}

export function addLocalPost(post: LocalPost): void {
  localPosts.unshift(post); // Add to beginning for newest first
}

export function clearLocalPosts(): void {
  localPosts = [];
}

export function getLocalPostById(id: number): LocalPost | undefined {
  return localPosts.find((post) => post.id === id);
}
