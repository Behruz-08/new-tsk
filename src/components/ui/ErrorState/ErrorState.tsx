import React from 'react';
import { AlertCircle } from 'lucide-react';
import styles from './ErrorState.module.scss';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  onRetry,
  retryLabel = 'Попробовать снова',
  className,
}) => {
  return (
    <div className={`${styles.errorState} ${className || ''}`}>
      <AlertCircle className={styles.icon} size={20} />
      <span className={styles.message}>{message}</span>
      {onRetry && (
        <button className={styles.retryButton} onClick={onRetry}>
          {retryLabel}
        </button>
      )}
    </div>
  );
};
