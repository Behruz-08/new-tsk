import { FileText } from 'lucide-react';

import type { Post } from '@/entities/post';
import { PostCard } from '@/entities/post';
import { apiClient } from '@/shared/api';
import { PageHeader, TechInfo } from '@/shared/ui';
import { MainLayout } from '@/widgets/layout/MainLayout';

import styles from './SSGPage.module.scss';

export async function generateStaticParams() {
  try {
    const posts = await apiClient.get<Post[]>('/posts');
    return posts.slice(0, 10).map((post) => ({ id: post.id.toString() }));
  } catch {
    return [];
  }
}

async function getPosts(): Promise<Post[]> {
  try {
    const posts = await apiClient.get<Post[]>('/posts');
    return posts.slice(0, 12);
  } catch {
    return [];
  }
}

export default async function SSGPage() {
  const posts = await getPosts();

  return (
    <MainLayout>
      <main className={styles.main}>
        <div className="container">
          <PageHeader
            title="SSG - Static Site Generation"
            description="Страница сгенерирована статически во время сборки. Данные загружены на сервере и встроены в HTML."
            icon={FileText}
            badge={{ text: '⚡ Статическая генерация' }}
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
    </MainLayout>
  );
}
