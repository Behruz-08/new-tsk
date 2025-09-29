'use client';

import React from 'react';

import { cn } from '@/lib/utils/utils';

import styles from './Card.module.scss';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padding = 'md', hover = false, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          styles.card,
          styles[`card--${variant}`],
          styles[`card--${padding}`],
          {
            [styles['card--hover']]: hover,
          },
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';
