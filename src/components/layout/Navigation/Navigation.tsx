'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/utils';
import { Button } from '@/components/ui/Button';
import { MessageSquare, Home, FileText, Database, Zap, Plus } from 'lucide-react';
import styles from './Navigation.module.scss';

const navigationItems = [
  {
    href: '/',
    label: 'Главная',
    icon: Home,
    description: 'Добро пожаловать на главную страницу',
  },
  {
    href: '/ssg',
    label: 'SSG',
    icon: FileText,
    description: 'Static Site Generation - статическая генерация',
  },
  {
    href: '/ssr',
    label: 'SSR',
    icon: Database,
    description: 'Server-Side Rendering - серверный рендеринг',
  },
  {
    href: '/isr',
    label: 'ISR',
    icon: Zap,
    description: 'Incremental Static Regeneration',
  },
  {
    href: '/csr',
    label: 'CSR',
    icon: MessageSquare,
    description: 'Client-Side Rendering - клиентский рендеринг',
  },
];

export const Navigation: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.navigation} role="navigation" aria-label="Основная навигация">
      <div className="container">
        <div className={styles.navContent}>
          <Link href="/" className={styles.logo}>
            <h1>Next.js Test Task</h1>
          </Link>

          <ul className={styles.navList}>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(styles.navLink, {
                      [styles.navLinkActive]: isActive,
                    })}
                    title={item.description}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                    {isActive && <span className={styles.activeIndicator} />}
                  </Link>
                </li>
              );
            })}
          </ul>

          <Button variant="primary" size="md" asChild leftIcon={<Plus size={18} />}>
            <Link href="/create-post">Создать пост</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};
