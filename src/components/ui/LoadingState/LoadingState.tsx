/**
 * Loading state component
 * Компонент для отображения состояния загрузки
 */

import React from 'react';
import { Loader } from 'lucide-react';
import styles from './LoadingState.module.scss';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Загрузка...',
  size = 'md',
  className,
}) => {
  return (
    <div className={`${styles.loadingState} ${styles[size]} ${className || ''}`}>
      <Loader className={styles.spinner} />
      <span className={styles.message}>{message}</span>
    </div>
  );
};
