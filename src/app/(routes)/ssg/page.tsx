/**
 * SSG Page - Static Site Generation
 * Данные генерируются во время сборки
 */

import { Navigation } from "@/components/layout/Navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PostCard } from "@/components/posts/PostCard";
import { postsApi } from "@/lib/api";
import { Post } from "@/types";
import { FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import styles from "./page.module.scss";

// SSG: Данные загружаются во время сборки
export async function generateStaticParams() {
  // Получаем список постов для предгенерации
  const posts = await postsApi.getAll();

  // Генерируем параметры для статических страниц (если нужно)
  return posts.slice(0, 10).map((post) => ({
    id: post.id.toString(),
  }));
}

// SSG: Функция для получения данных во время сборки
async function getPosts(): Promise<Post[]> {
  try {
    // В реальном приложении здесь может быть кеширование
    const posts = await postsApi.getAll();
    return posts.slice(0, 12); // Ограничиваем количество для демонстрации
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export default async function SSGPage() {
  // SSG: Данные загружаются на сервере во время сборки
  const posts = await getPosts();

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
                  <FileText size={32} />
                  SSG - Static Site Generation
                </h1>
                <p className={styles.description}>
                  Страница сгенерирована статически во время сборки. Данные
                  загружены на сервере и встроены в HTML.
                </p>
                <div className={styles.badge}>
                  <span className={styles.badgeIcon}>⚡</span>
                  Статическая генерация
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

          {/* Posts Grid */}
          <div className={styles.postsSection}>
            <h2 className={styles.sectionTitle}>
              Посты из JSONPlaceholder ({posts.length})
            </h2>
            <p className={styles.sectionDescription}>
              Данные загружены во время сборки и встроены в статический HTML
            </p>

            <div className={styles.postsGrid}>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} showRenderTime={false} />
              ))}
            </div>
          </div>

          {/* Technical Info */}
          <Card className={styles.techInfo}>
            <h3>Техническая информация SSG</h3>
            <div className={styles.techDetails}>
              <div className={styles.techItem}>
                <strong>Время генерации:</strong> Во время сборки (build time)
              </div>
              <div className={styles.techItem}>
                <strong>Производительность:</strong> Максимальная
                (предрендеренный HTML)
              </div>
              <div className={styles.techItem}>
                <strong>SEO:</strong> Отличное (полный HTML на сервере)
              </div>
              <div className={styles.techItem}>
                <strong>Кеширование:</strong> CDN и браузер
              </div>
              <div className={styles.techItem}>
                <strong>Актуальность данных:</strong> На момент сборки
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
