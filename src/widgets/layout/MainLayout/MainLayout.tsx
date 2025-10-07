'use client';

import React from 'react';

import { Navigation } from '@/widgets';

import styles from './MainLayout.module.scss';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, className }) => {
  return (
    <div className={`${styles.layout} ${className || ''}`}>
      <Navigation />
      {children}
    </div>
  );
};
