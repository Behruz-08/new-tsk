/**
 * SSG Page - Static Site Generation
 * Данные генерируются во время сборки
 */

import { Navigation } from '@/components/layout/Navigation';
import { PageHeader } from '@/components/ui/PageHeader';
import { TechInfo } from '@/components/ui/TechInfo';
import { PostCard } from '@/components/posts/PostCard';
import { Post } from '@/types';
import { FileText } from 'lucide-react';
import styles from './page.module.scss';

// SSG: Данные загружаются во время сборки
export async function generateStaticParams() {
  try {
    // Получаем список постов напрямую из JSONPlaceholder для предгенерации
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');

    if (!response.ok) {
      throw new Error(`JSONPlaceholder API error: ${response.status}`);
    }

    const posts: Post[] = await response.json();

    // Генерируем параметры для статических страниц (если нужно)
    return posts.slice(0, 10).map((post) => ({
      id: post.id.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// SSG: Функция для получения данных во время сборки
async function getPosts(): Promise<Post[]> {
  try {
    // Во время сборки обращаемся напрямую к JSONPlaceholder API
    // потому что внутренние API роуты недоступны во время build time
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');

    if (!response.ok) {
      throw new Error(`JSONPlaceholder API error: ${response.status}`);
    }

    const posts: Post[] = await response.json();
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
