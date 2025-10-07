'use client';

import React from 'react';

import type { Comment } from '@/entities/comment';
import { CommentCard } from '@/entities/comment';
import { LoadingState, ErrorState } from '@/shared/ui';

import styles from './CommentsList.module.scss';

interface CommentsListProps {
  comments: Comment[];
  isLoading?: boolean;
  error?: string | null;
  className?: string;
  emptyMessage?: string;
  title?: string;
}

export const CommentsList: React.FC<CommentsListProps> = ({
  comments,
  isLoading = false,
  error = null,
  className,
  emptyMessage = 'Комментариев пока нет',
  title,
}) => {
  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className={`${styles.commentsList} ${className || ''}`}>
      {title && <h3 className={styles.title}>{title}</h3>}

      {comments.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyMessage}>{emptyMessage}</p>
        </div>
      ) : (
        <div className={styles.commentsContainer}>
          {comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
};
