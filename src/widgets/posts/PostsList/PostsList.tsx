'use client';

import React from 'react';

import type { Post } from '@/entities/post';
import { PostCard } from '@/entities/post';
import { LoadingState, ErrorState } from '@/shared/ui';

import styles from './PostsList.module.scss';

interface PostsListProps {
  posts: Post[];
  isLoading?: boolean;
  error?: string | null;
  showRenderTime?: boolean;
  renderTime?: Date;
  className?: string;
  emptyMessage?: string;
}

export const PostsList: React.FC<PostsListProps> = ({
  posts,
  isLoading = false,
  error = null,
  showRenderTime = false,
  renderTime,
  className,
  emptyMessage = 'Постов пока нет',
}) => {
  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (posts.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyMessage}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`${styles.postsList} ${className || ''}`}>
      <div className={styles.postsGrid}>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            showRenderTime={showRenderTime}
            renderTime={renderTime}
          />
        ))}
      </div>
    </div>
  );
};
