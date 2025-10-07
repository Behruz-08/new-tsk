'use client';

import { Mail, User } from 'lucide-react';
import React from 'react';

import type { Comment } from '@/entities/comment';
import { Card } from '@/shared/ui/Card';

import styles from './CommentCard.module.scss';

interface CommentCardProps {
  comment: Comment;
  className?: string;
}

export const CommentCard: React.FC<CommentCardProps> = ({ comment, className }) => {
  return (
    <Card className={`${styles.commentCard} ${className || ''}`} hover>
      <div className={styles.commentHeader}>
        <h4 className={styles.commentTitle}>{comment.name}</h4>
        <div className={styles.commentMeta}>
          <span className={styles.commentId}>#{comment.id}</span>
        </div>
      </div>

      <p className={styles.commentBody}>{comment.body}</p>

      <div className={styles.commentFooter}>
        <div className={styles.commentInfo}>
          <span className={styles.authorInfo}>
            <Mail size={14} />
            {comment.email}
          </span>
          <span className={styles.postInfo}>
            <User size={14} />
            Post #{comment.postId}
          </span>
        </div>
      </div>
    </Card>
  );
};
