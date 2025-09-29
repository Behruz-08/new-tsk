import { FileText } from 'lucide-react';

import { Navigation } from '@/components/layout/Navigation';
import { PostCard } from '@/components/posts/PostCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { TechInfo } from '@/components/ui/TechInfo';
import { apiClient } from '@/lib/api/api-client';
import type { Post } from '@/types';

import styles from './page.module.scss';

export async function generateStaticParams() {
  try {
    const posts = await apiClient.get<Post[]>('/posts');

    return posts.slice(0, 10).map((post) => ({
      id: post.id.toString(),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

async function getPosts(): Promise<Post[]> {
  try {
    const posts = await apiClient.get<Post[]>('/posts');
    return posts.slice(0, 12);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export default async function SSGPage() {
  const posts = await getPosts();

  return (
    <div className={styles.page}>
      <Navigation />

      <main className={styles.main}>
        <div className="container">
          <PageHeader
            title="SSG - Static Site Generation"
            description="Страница сгенерирована статически во время сборки. Данные загружены на сервере и встроены в HTML."
            icon={FileText}
            badge={{
              text: '⚡ Статическая генерация',
            }}
          />

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
