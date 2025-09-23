/**
 * ISR Page - Incremental Static Regeneration
 * Статическая страница с перегенерацией по расписанию
 */

import { Navigation } from "@/components/layout/Navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { commentsApi } from "@/lib/api";
import { Comment } from "@/types";
import { Zap, Calendar, User, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import styles from "./page.module.scss";

// ISR: Перегенерация каждые 60 секунд
export const revalidate = 60;

// ISR: Функция для получения данных с перегенерацией
async function getComments(): Promise<Comment[]> {
  try {
    const comments = await commentsApi.getAll();
    return comments.slice(0, 15); // Ограничиваем количество для демонстрации
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

export default async function ISRPage() {
  // ISR: Данные загружаются и кешируются, обновляются по расписанию
  const comments = await getComments();
  const buildTime = new Date();

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
                  <Zap size={32} />
                  ISR - Incremental Static Regeneration
                </h1>
                <p className={styles.description}>
                  Статическая страница с автоматической перегенерацией. Лучшее
                  из SSG и SSR миров - скорость + актуальность данных.
                </p>
                <div className={styles.badge}>
                  <span className={styles.badgeIcon}>
                    <Clock size={16} />
                  </span>
                  Перегенерация: каждые 60 сек
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

          {/* ISR Info */}
          <Card className={styles.isrInfo}>
            <div className={styles.isrContent}>
              <div className={styles.isrTime}>
                <Calendar size={20} />
                <div>
                  <strong>Время последней генерации:</strong>
                  <span>{formatDate(buildTime)}</span>
                </div>
              </div>
              <div className={styles.isrNote}>
                ⚡ Страница статическая, но данные обновляются каждые 60 секунд
              </div>
              <div className={styles.isrStatus}>
                <div className={styles.statusIndicator}></div>
                <span>ISR Активен</span>
              </div>
            </div>
          </Card>

          {/* Comments Grid */}
          <div className={styles.commentsSection}>
            <h2 className={styles.sectionTitle}>
              Комментарии из JSONPlaceholder ({comments.length})
            </h2>
            <p className={styles.sectionDescription}>
              Данные кешированы статически, но обновляются по расписанию
            </p>

            <div className={styles.commentsGrid}>
              {comments.map((comment) => (
                <Card key={comment.id} className={styles.commentCard} hover>
                  <div className={styles.commentHeader}>
                    <div className={styles.commentMeta}>
                      <span className={styles.commentId}>#{comment.id}</span>
                      <span className={styles.postId}>
                        Post #{comment.postId}
                      </span>
                    </div>
                  </div>

                  <div className={styles.commentBody}>
                    <h4 className={styles.commentName}>{comment.name}</h4>
                    <p className={styles.commentText}>{comment.body}</p>
                  </div>

                  <div className={styles.commentFooter}>
                    <div className={styles.commentInfo}>
                      <span className={styles.userInfo}>
                        <User size={14} />
                        {comment.email}
                      </span>
                      <span className={styles.buildTime}>
                        <Calendar size={14} />
                        ISR: {formatDate(buildTime)}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Technical Info */}
          <Card className={styles.techInfo}>
            <h3>Техническая информация ISR</h3>
            <div className={styles.techDetails}>
              <div className={styles.techItem}>
                <strong>Время генерации:</strong> Во время сборки +
                перегенерация по расписанию
              </div>
              <div className={styles.techItem}>
                <strong>Производительность:</strong> Максимальная (статические
                страницы)
              </div>
              <div className={styles.techItem}>
                <strong>SEO:</strong> Отличное (полный HTML на сервере)
              </div>
              <div className={styles.techItem}>
                <strong>Кеширование:</strong> CDN + автоматическая перегенерация
              </div>
              <div className={styles.techItem}>
                <strong>Актуальность данных:</strong> Контролируемая (каждые 60
                сек)
              </div>
              <div className={styles.techItem}>
                <strong>Масштабируемость:</strong> Отличная (статические
                страницы)
              </div>
            </div>
          </Card>

          {/* ISR Demo */}
          <Card className={styles.demoInfo}>
            <h3>Демонстрация ISR</h3>
            <div className={styles.demoContent}>
              <div className={styles.demoStep}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepContent}>
                  <strong>Первое посещение:</strong> Страница генерируется на
                  сервере
                </div>
              </div>
              <div className={styles.demoStep}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <strong>Следующие посещения:</strong> Показывается
                  кешированная версия
                </div>
              </div>
              <div className={styles.demoStep}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <strong>Через 60 секунд:</strong> Страница перегенерируется в
                  фоне
                </div>
              </div>
              <div className={styles.demoStep}>
                <div className={styles.stepNumber}>4</div>
                <div className={styles.stepContent}>
                  <strong>Следующий запрос:</strong> Показывается обновленная
                  версия
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
