import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowRight, Zap, Database, FileText, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.scss';

export default function HomePage() {
  return (
    <div className={styles.page}>
      <Navigation />

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                Next.js Тестовое Задание
                <span className={styles.highlight}>Frontend Development</span>
              </h1>

              <p className={styles.heroDescription}>
                Демонстрация различных методов рендеринга в Next.js: SSG, SSR, ISR и CSR с
                современным стеком технологий
              </p>

              <div className={styles.heroActions}>
                <Button variant="primary" size="lg" rightIcon={<ArrowRight size={20} />} asChild>
                  <Link href="/ssg">Начать изучение</Link>
                </Button>

                <Button variant="outline" size="lg" asChild>
                  <Link href="#features">Узнать больше</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className={styles.features}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>Методы рендеринга Next.js</h2>
              <p>Изучите различные подходы к рендерингу в современном веб-разработке</p>
            </div>

            <div className={styles.featuresGrid}>
              <Card className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <FileText size={32} />
                </div>
                <h3>SSG - Static Site Generation</h3>
                <p>
                  Статическая генерация сайта во время сборки. Максимальная производительность и
                  SEO-оптимизация.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/ssg">Изучить SSG</Link>
                </Button>
              </Card>

              <Card className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <Database size={32} />
                </div>
                <h3>SSR - Server-Side Rendering</h3>
                <p>
                  Серверный рендеринг на каждый запрос. Актуальные данные и персонализация контента.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/ssr">Изучить SSR</Link>
                </Button>
              </Card>

              <Card className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <Zap size={32} />
                </div>
                <h3>ISR - Incremental Static Regeneration</h3>
                <p>Инкрементальная статическая регенерация. Лучшее из SSG и SSR миров.</p>
                <Button variant="outline" asChild>
                  <Link href="/isr">Изучить ISR</Link>
                </Button>
              </Card>

              <Card className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <MessageSquare size={32} />
                </div>
                <h3>CSR - Client-Side Rendering</h3>
                <p>
                  Клиентский рендеринг с интерактивными формами. Динамический контент и
                  пользовательские взаимодействия.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/csr">Изучить CSR</Link>
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className={styles.techStack}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>Технологический стек</h2>
              <p>Современные инструменты для качественной разработки</p>
            </div>

            <div className={styles.techGrid}>
              <div className={styles.techItem}>
                <h4>Frontend</h4>
                <ul>
                  <li>Next.js 14 (App Router)</li>
                  <li>TypeScript</li>
                  <li>React 18</li>
                  <li>SCSS Modules</li>
                </ul>
              </div>

              <div className={styles.techItem}>
                <h4>State Management</h4>
                <ul>
                  <li>TanStack Query</li>
                  <li>Zustand</li>
                  <li>React Hook Form</li>
                  <li>Zod Validation</li>
                </ul>
              </div>

              <div className={styles.techItem}>
                <h4>UI & UX</h4>
                <ul>
                  <li>Custom Components</li>
                  <li>Accessibility (a11y)</li>
                  <li>Responsive Design</li>
                  <li>Lucide Icons</li>
                </ul>
              </div>

              <div className={styles.techItem}>
                <h4>Development</h4>
                <ul>
                  <li>ESLint & Prettier</li>
                  <li>TypeScript Strict</li>
                  <li>Clean Architecture</li>
                  <li>Custom Hooks</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
