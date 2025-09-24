/**
 * PostCard component for displaying individual posts
 */

"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Post } from "@/types";
import { User, Calendar, Paperclip, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";
import styles from "./PostCard.module.scss";

interface PostCardProps {
  post: Post;
  showRenderTime?: boolean;
  renderTime?: Date;
  className?: string;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  showRenderTime = false,
  renderTime,
  className,
}) => {
  const isLocalPost = post.createdAt; // Local posts have createdAt field
  const displayTime = showRenderTime && renderTime ? renderTime : new Date();

  return (
    <Card className={`${styles.postCard} ${className || ""}`} hover>
      <div className={styles.postHeader}>
        <h3 className={styles.postTitle}>{post.title}</h3>
        <div className={styles.postMeta}>
          <span
            className={`${styles.postId} ${isLocalPost ? styles.localPost : ""}`}
          >
            #{post.id}
          </span>
          {isLocalPost && <span className={styles.localBadge}>Новый</span>}
        </div>
      </div>

      <p className={styles.postBody}>
        {post.body.length > 120
          ? `${post.body.substring(0, 120)}...`
          : post.body}
      </p>

      {/* File Attachment */}
      {post.fileUrl && (
        <div className={styles.fileAttachment}>
          <div className={styles.fileInfo}>
            <Paperclip size={16} />
            <span className={styles.fileLabel}>Прикрепленный файл:</span>
            <a
              href={post.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.fileLink}
            >
              {post.fileUrl.split("/").pop()}
            </a>
          </div>
        </div>
      )}

      <div className={styles.postFooter}>
        <div className={styles.postInfo}>
          <span className={styles.userInfo}>
            <User size={14} />
            User {post.userId}
          </span>
          <span className={styles.timeInfo}>
            <Calendar size={14} />
            {showRenderTime ? (
              <>Рендер: {formatDate(displayTime)}</>
            ) : (
              <>Загружено: {formatDate(displayTime)}</>
            )}
          </span>
          {isLocalPost && (
            <span className={styles.createdTime}>
              <FileText size={14} />
              Создан: {formatDate(new Date(post.createdAt!))}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};
