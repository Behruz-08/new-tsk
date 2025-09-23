/**
 * CSR Page - Client-Side Rendering
 * Интерактивная страница с формами и клиентским состоянием
 */

"use client";

import React, { useState } from "react";
import { Navigation } from "@/components/layout/Navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ContactForm } from "@/components/forms/ContactForm";
import { FileList } from "@/components/files/FileList";
import { useModalState } from "@/components/ui/Modal";
import { usePosts } from "@/hooks/usePosts";
// import { useCreatePost } from "@/hooks/usePosts"; // Пока не используется
import { useComments } from "@/hooks/useComments";
import {
  MessageSquare,
  ArrowLeft,
  RefreshCw,
  Loader,
  AlertCircle,
  File,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import styles from "./page.module.scss";

export default function CSRPage() {
  const { isOpen, open, close } = useModalState();
  const [fileListRefreshTrigger, setFileListRefreshTrigger] = useState(0);

  // CSR: Данные загружаются на клиенте
  const {
    data: posts,
    isLoading: postsLoading,
    error: postsError,
    refetch: refetchPosts,
  } = usePosts();
  const {
    data: comments,
    isLoading: commentsLoading,
    error: commentsError,
    refetch: refetchComments,
  } = useComments();
  // const createPostMutation = useCreatePost(); // Пока не используется

  const handleModalSuccess = () => {
    close();
    // Обновляем список постов после успешной отправки формы
    refetchPosts();
    // Обновляем список файлов после успешной отправки формы
    setFileListRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className={styles.page}>
      <Navigation />

      <main className={styles.main}>
        <div className="container">
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <div className={styles.headerInfo}>
                <h1 className={styles.title}>
                  <MessageSquare size={32} />
                  CSR - Client-Side Rendering
                </h1>
                <p className={styles.description}>
                  Интерактивная страница с клиентским рендерингом. Данные
                  загружаются в браузере, формы работают динамически.
                </p>
                <div className={styles.badge}>
                  <span className={styles.badgeIcon}>⚡</span>
                  Клиентский рендеринг
                </div>
              </div>

              <Button variant="outline" asChild>
                <Link href="/">
                  <ArrowLeft size={18} />
                  На главную
                </Link>
              </Button>
            </div>
          </div>

          {/* Interactive Controls */}
          <Card className={styles.controlsCard}>
            <div className={styles.controlsContent}>
              <h3>Интерактивные элементы</h3>
              <div className={styles.controls}>
                <Button
                  variant="primary"
                  onClick={open}
                  leftIcon={<MessageSquare size={18} />}
                >
                  Открыть форму
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => refetchPosts()}
                  leftIcon={<RefreshCw size={18} />}
                  loading={postsLoading}
                >
                  Обновить посты
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => refetchComments()}
                  leftIcon={<RefreshCw size={18} />}
                  loading={commentsLoading}
                >
                  Обновить комментарии
                </Button>
              </div>
            </div>
          </Card>

          {/* Posts Section */}
          <div className={styles.postsSection}>
            <h2 className={styles.sectionTitle}>
              Посты (CSR) - {posts ? posts.length : 0}
            </h2>
            <p className={styles.sectionDescription}>
              Данные загружаются на клиенте с помощью TanStack Query. Новые
              посты создаются через форму обратной связи и отправляются в
              JSONPlaceholder API.
            </p>

            {postsLoading && (
              <div className={styles.loadingState}>
                <Loader className={styles.spinner} />
                <span>Загрузка постов...</span>
              </div>
            )}

            {postsError && (
              <div className={styles.errorState}>
                <AlertCircle size={20} />
                <span>Ошибка загрузки постов: {postsError.message}</span>
              </div>
            )}

            {posts && !postsLoading && (
              <div className={styles.postsGrid}>
                {posts.slice(0, 6).map((post) => (
                  <Card key={post.id} className={styles.postCard} hover>
                    <div className={styles.postHeader}>
                      <h3 className={styles.postTitle}>{post.title}</h3>
                      <span className={styles.postId}>#{post.id}</span>
                    </div>

                    <p className={styles.postBody}>
                      {post.body.length > 100
                        ? `${post.body.substring(0, 100)}...`
                        : post.body}
                    </p>

                    <div className={styles.postFooter}>
                      <span className={styles.userInfo}>
                        User {post.userId}
                      </span>
                      <span className={styles.loadTime}>
                        Загружено: {formatDate(new Date())}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className={styles.commentsSection}>
            <h2 className={styles.sectionTitle}>
              Комментарии (CSR) - {comments ? comments.length : 0}
            </h2>
            <p className={styles.sectionDescription}>
              Комментарии загружаются отдельно с кешированием
            </p>

            {commentsLoading && (
              <div className={styles.loadingState}>
                <Loader className={styles.spinner} />
                <span>Загрузка комментариев...</span>
              </div>
            )}

            {commentsError && (
              <div className={styles.errorState}>
                <AlertCircle size={20} />
                <span>
                  Ошибка загрузки комментариев: {commentsError.message}
                </span>
              </div>
            )}

            {comments && !commentsLoading && (
              <div className={styles.commentsGrid}>
                {comments.slice(0, 8).map((comment) => (
                  <Card key={comment.id} className={styles.commentCard} hover>
                    <div className={styles.commentHeader}>
                      <h4 className={styles.commentName}>{comment.name}</h4>
                      <span className={styles.commentId}>#{comment.id}</span>
                    </div>

                    <p className={styles.commentText}>
                      {comment.body.length > 80
                        ? `${comment.body.substring(0, 80)}...`
                        : comment.body}
                    </p>

                    <div className={styles.commentFooter}>
                      <span className={styles.commentEmail}>
                        {comment.email}
                      </span>
                      <span className={styles.loadTime}>
                        Post #{comment.postId}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Files Section */}
          <div className={styles.filesSection}>
            <h2 className={styles.sectionTitle}>
              <File size={24} />
              Загруженные файлы (дополнительно)
            </h2>
            <p className={styles.sectionDescription}>
              Дополнительная функциональность - файлы, загруженные через форму
              обратной связи. Основные данные отправляются в JSONPlaceholder API
              как посты.
            </p>
            <FileList
              className={styles.fileList}
              refreshTrigger={fileListRefreshTrigger}
            />
          </div>

          {/* Technical Info */}
          <Card className={styles.techInfo}>
            <h3>Техническая информация CSR</h3>
            <div className={styles.techDetails}>
              <div className={styles.techItem}>
                <strong>Время рендеринга:</strong> В браузере (client-side)
              </div>
              <div className={styles.techItem}>
                <strong>Производительность:</strong> Зависит от устройства
                пользователя
              </div>
              <div className={styles.techItem}>
                <strong>SEO:</strong> Требует дополнительной настройки
              </div>
              <div className={styles.techItem}>
                <strong>Кеширование:</strong> TanStack Query + браузер
              </div>
              <div className={styles.techItem}>
                <strong>API интеграция:</strong> JSONPlaceholder для создания
                постов
              </div>
              <div className={styles.techItem}>
                <strong>Форма:</strong> Отправляет POST запросы в
                JSONPlaceholder API
              </div>
              <div className={styles.techItem}>
                <strong>Интерактивность:</strong> Максимальная с модальными
                окнами
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Contact Modal */}
      <Modal
        isOpen={isOpen}
        onClose={close}
        title="Связаться с нами (CSR)"
        size="md"
      >
        <ContactForm onSuccess={handleModalSuccess} />
      </Modal>
    </div>
  );
}
