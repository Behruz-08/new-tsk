/**
 * SSG Page - Static Site Generation
 * Данные генерируются во время сборки
 */

import { Navigation } from '@/components/layout/Navigation';
import { PageHeader } from '@/components/ui/PageHeader';
import { TechInfo } from '@/components/ui/TechInfo';
import { PostCard } from '@/components/posts/PostCard';
import { postsService } from '@/lib/services';
import { Post } from '@/types';
import { FileText } from 'lucide-react';
import styles from './page.module.scss';

// SSG: Данные загружаются во время сборки
export async function generateStaticParams() {
  // Получаем список постов для предгенерации
  const posts = await postsService.getAll();

  // Генерируем параметры для статических страниц (если нужно)
  return posts.slice(0, 10).map((post) => ({
    id: post.id.toString(),
  }));
}

// SSG: Функция для получения данных во время сборки
async function getPosts(): Promise<Post[]> {
  try {
    // В реальном приложении здесь может быть кеширование
    const posts = await postsService.getAll();
    return posts.slice(0, 12); // Ограничиваем количество для демонстрации
  } catch (error) {
    console.error('Error fetching posts:', error);
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
          <PageHeader
            title="SSG - Static Site Generation"
            description="Страница сгенерирована статически во время сборки. Данные загружены на сервере и встроены в HTML."
            icon={FileText}
            badge={{
              text: '⚡ Статическая генерация',
            }}
          />

          {/* Posts Grid */}
          <div className={styles.postsSection}>
            <h2 className={styles.sectionTitle}>Посты из JSONPlaceholder ({posts.length})</h2>
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
          <TechInfo
            title="Техническая информация SSG"
            items={[
              { label: 'Время генерации', value: 'Во время сборки (build time)' },
              { label: 'Производительность', value: 'Максимальная (предрендеренный HTML)' },
              { label: 'SEO', value: 'Отличное (полный HTML на сервере)' },
              { label: 'Кеширование', value: 'CDN и браузер' },
              { label: 'Актуальность данных', value: 'На момент сборки' },
            ]}
          />
        </div>
      </main>
    </div>
  );
}
