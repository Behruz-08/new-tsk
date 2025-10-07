'use client';

import { MessageSquare, RefreshCw } from 'lucide-react';
import React from 'react';

import { useModalState, useModalActions } from '@/app/store';
import type { Comment } from '@/entities/comment';
import type { Post } from '@/entities/post';
import { PostCard } from '@/entities/post';
import { useCommentsQuery } from '@/features/comments';
import { usePostsQuery } from '@/features/posts';
import { Button, Card, ErrorState, LoadingState, Modal, PageHeader } from '@/shared/ui';
import { ContactForm } from '@/widgets/forms/ContactForm';
import { MainLayout } from '@/widgets/layout/MainLayout';

import styles from './CSRPage.module.scss';

export default function CSRPage() {
  const { isOpen } = useModalState('contact-modal');
  const { openModal, closeModal } = useModalActions();

  const {
    data: posts,
    isLoading: postsLoading,
    error: postsError,
    refetch: refetchPosts,
  } = usePostsQuery();
  const {
    data: comments,
    isLoading: commentsLoading,
    error: commentsError,
    refetch: refetchComments,
  } = useCommentsQuery();

  const handleModalSuccess = () => {
    closeModal('contact-modal');
  };

  return (
    <MainLayout>
      <main className={styles.main}>
        <div className="container">
          <PageHeader
            title="CSR - Client-Side Rendering"
            description="Интерактивная страница с клиентским рендерингом. Данные загружаются в браузере, формы работают динамически."
            icon={MessageSquare}
            badge={{
              text: '⚡ Клиентский рендеринг',
            }}
          />

          <Card className={styles.controlsCard}>
            <div className={styles.controlsContent}>
              <h3>Интерактивные элементы</h3>
              <div className={styles.controls}>
                <Button
                  variant="primary"
                  onClick={() => openModal('contact-modal')}
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

          <div className={styles.postsSection}>
            <h2 className={styles.sectionTitle}>Посты (CSR) - {posts ? posts.length : 0}</h2>
            <p className={styles.sectionDescription}>
              Данные загружаются на клиенте с помощью TanStack Query. Новые посты создаются через
              форму обратной связи и отправляются в JSONPlaceholder API.
            </p>

            {postsLoading && <LoadingState message="Загрузка постов..." />}

            {postsError && (
              <ErrorState
                message={`Ошибка загрузки постов: ${(postsError as Error).message}`}
                onRetry={() => refetchPosts()}
              />
            )}

            {posts && !postsLoading && (
              <div className={styles.postsGrid}>
                {posts.slice(0, 6).map((post: Post) => (
                  <PostCard key={post.id} post={post} showRenderTime={false} />
                ))}
              </div>
            )}
          </div>

          <div className={styles.commentsSection}>
            <h2 className={styles.sectionTitle}>
              Комментарии (CSR) - {comments ? comments.length : 0}
            </h2>
            <p className={styles.sectionDescription}>
              Комментарии загружаются отдельно с кешированием
            </p>

            {commentsLoading && <LoadingState message="Загрузка комментариев..." />}

            {commentsError && (
              <ErrorState
                message={`Ошибка загрузки комментариев: ${(commentsError as Error).message}`}
                onRetry={() => refetchComments()}
              />
            )}

            {comments && !commentsLoading && (
              <div className={styles.commentsGrid}>
                {comments.slice(0, 8).map((comment: Comment) => (
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
                      <span className={styles.commentEmail}>{comment.email}</span>
                      <span className={styles.loadTime}>Post #{comment.postId}</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <Card className={styles.techInfo}>
            <h3>Техническая информация CSR</h3>
            <div className={styles.techItems}>
              <div className={styles.techItem}>
                <span className={styles.techLabel}>Время рендеринга:</span>
                <span className={styles.techValue}>В браузере (client-side)</span>
              </div>
              <div className={styles.techItem}>
                <span className={styles.techLabel}>Производительность:</span>
                <span className={styles.techValue}>Зависит от устройства пользователя</span>
              </div>
              <div className={styles.techItem}>
                <span className={styles.techLabel}>SEO:</span>
                <span className={styles.techValue}>Требует дополнительной настройки</span>
              </div>
              <div className={styles.techItem}>
                <span className={styles.techLabel}>Кеширование:</span>
                <span className={styles.techValue}>TanStack Query + браузер</span>
              </div>
              <div className={styles.techItem}>
                <span className={styles.techLabel}>API интеграция:</span>
                <span className={styles.techValue}>JSONPlaceholder для создания постов</span>
              </div>
              <div className={styles.techItem}>
                <span className={styles.techLabel}>Форма:</span>
                <span className={styles.techValue}>
                  Отправляет POST запросы в JSONPlaceholder API
                </span>
              </div>
              <div className={styles.techItem}>
                <span className={styles.techLabel}>Интерактивность:</span>
                <span className={styles.techValue}>Максимальная с модальными окнами</span>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Modal
        isOpen={isOpen}
        onClose={() => closeModal('contact-modal')}
        title="Связаться с нами (CSR)"
        size="md"
      >
        <ContactForm onSuccess={handleModalSuccess} />
      </Modal>
    </MainLayout>
  );
}
