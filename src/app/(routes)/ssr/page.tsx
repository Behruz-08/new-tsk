import { Navigation } from '@/components/layout/Navigation';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { TechInfo } from '@/components/ui/TechInfo';
import { RefreshButton } from '@/components/ui/RefreshButton';
import { PostCard } from '@/components/posts/PostCard';
import { Post } from '@/types';
import { Database, Calendar, RefreshCw } from 'lucide-react';
import { formatDate } from '@/lib/utils/utils';
import styles from './page.module.scss';

export const dynamic = 'force-dynamic';

async function getPosts(): Promise<Post[]> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const response = await fetch('https://jsonplaceholder.typicode.com/posts');

    if (!response.ok) {
      throw new Error(`JSONPlaceholder API error: ${response.status}`);
    }

    const posts: Post[] = await response.json();
    return posts.slice(0, 12);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export default async function SSRPage() {
  const posts = await getPosts();
  const renderTime = new Date();

  return (
    <div className={styles.page}>
      <Navigation />

      <main className={styles.main}>
        <div className="container">
          <PageHeader
            title="SSR - Server-Side Rendering"
            description="Страница рендерится на сервере при каждом запросе. Данные всегда актуальные и персонализированные."
            icon={Database}
            badge={{
              icon: RefreshCw,
              text: 'Серверный рендеринг',
            }}
          />

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

          <div className={styles.postsSection}>
            <h2 className={styles.sectionTitle}>Посты из JSONPlaceholder ({posts.length})</h2>
            <p className={styles.sectionDescription}>
              Данные загружены на сервере при текущем запросе
            </p>

            <div className={styles.postsGrid}>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} showRenderTime={true} renderTime={renderTime} />
              ))}
            </div>
          </div>

          <TechInfo
            title="Техническая информация SSR"
            items={[
              { label: 'Время рендеринга', value: 'При каждом запросе (request time)' },
              { label: 'Производительность', value: 'Хорошая (но медленнее SSG)' },
              { label: 'SEO', value: 'Отличное (полный HTML на сервере)' },
              { label: 'Кеширование', value: 'На уровне приложения' },
              { label: 'Актуальность данных', value: 'Всегда актуальные' },
              { label: 'Персонализация', value: 'Возможна (cookies, headers)' },
            ]}
          />

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
