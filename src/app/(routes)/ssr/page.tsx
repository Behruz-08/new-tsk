/**
 * SSR Page - Server-Side Rendering
 * Данные загружаются на сервере при каждом запросе
 */

import { Navigation } from "@/components/layout/Navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { RefreshButton } from "@/components/ui/RefreshButton";
import { PostCard } from "@/components/posts/PostCard";
import { postsApi } from "@/lib/api";
import { Post } from "@/types";
import { Database, Calendar, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import styles from "./page.module.scss";

// SSR: Отключаем статическую генерацию
export const dynamic = "force-dynamic";

// SSR: Функция для получения данных на сервере при каждом запросе
async function getPosts(): Promise<Post[]> {
  try {
    // Имитируем задержку сервера
    await new Promise((resolve) => setTimeout(resolve, 500));

    const posts = await postsApi.getAll();
    return posts.slice(0, 12); // Ограничиваем количество для демонстрации
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export default async function SSRPage() {
  // SSR: Данные загружаются на сервере при каждом запросе
  const posts = await getPosts();
  const renderTime = new Date();

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
                  <Database size={32} />
                  SSR - Server-Side Rendering
                </h1>
                <p className={styles.description}>
                  Страница рендерится на сервере при каждом запросе. Данные
                  всегда актуальные и персонализированные.
                </p>
                <div className={styles.badge}>
                  <span className={styles.badgeIcon}>
                    <RefreshCw size={16} />
                  </span>
                  Серверный рендеринг
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

          {/* Render Time Info */}
          <Card className={styles.renderInfo}>
            <div className={styles.renderContent}>
              <div className={styles.renderTime}>
                <Calendar size={20} />
                <div>
                  <strong>Время рендеринга:</strong>
                  <span>{formatDate(renderTime)}</span>
                </div>
              </div>
              <div className={styles.renderNote}>
                💡 Данные загружены на сервере в момент запроса
              </div>
            </div>
          </Card>

          {/* Posts Grid */}
          <div className={styles.postsSection}>
            <h2 className={styles.sectionTitle}>
              Посты из JSONPlaceholder ({posts.length})
            </h2>
            <p className={styles.sectionDescription}>
              Данные загружены на сервере при текущем запросе
            </p>

            <div className={styles.postsGrid}>
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  showRenderTime={true}
                  renderTime={renderTime}
                />
              ))}
            </div>
          </div>

          {/* Technical Info */}
          <Card className={styles.techInfo}>
            <h3>Техническая информация SSR</h3>
            <div className={styles.techDetails}>
              <div className={styles.techItem}>
                <strong>Время рендеринга:</strong> При каждом запросе (request
                time)
              </div>
              <div className={styles.techItem}>
                <strong>Производительность:</strong> Хорошая (но медленнее SSG)
              </div>
              <div className={styles.techItem}>
                <strong>SEO:</strong> Отличное (полный HTML на сервере)
              </div>
              <div className={styles.techItem}>
                <strong>Кеширование:</strong> На уровне приложения
              </div>
              <div className={styles.techItem}>
                <strong>Актуальность данных:</strong> Всегда актуальные
              </div>
              <div className={styles.techItem}>
                <strong>Персонализация:</strong> Возможна (cookies, headers)
              </div>
            </div>
          </Card>

          {/* Refresh Button */}
          <div className={styles.refreshSection}>
            <RefreshButton />
            <p className={styles.refreshNote}>
              Нажмите кнопку для демонстрации нового серверного рендеринга
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
