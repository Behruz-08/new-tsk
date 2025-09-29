import type { LucideIcon } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { Button } from '@/components/ui/Button';

import styles from './PageHeader.module.scss';

interface PageHeaderProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  badge?: {
    icon?: LucideIcon;
    text: string;
  };
  backHref?: string;
  backLabel?: string;
  children?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon: Icon,
  badge,
  backHref = '/',
  backLabel = 'На главную',
  children,
  className,
}) => {
  return (
    <div className={`${styles.header} ${className || ''}`}>
      <div className={styles.headerContent}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>
            {Icon && <Icon size={32} />}
            {title}
          </h1>
          <p className={styles.description}>{description}</p>
          {badge && (
            <div className={styles.badge}>
              {badge.icon && (
                <span className={styles.badgeIcon}>
                  <badge.icon size={16} />
                </span>
              )}
              {badge.text}
            </div>
          )}
        </div>

        <div className={styles.headerActions}>
          {children}
          <Button variant="outline" asChild>
            <Link href={backHref}>
              <ArrowLeft size={18} />
              {backLabel}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
