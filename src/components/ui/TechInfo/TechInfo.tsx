/**
 * Technical information component
 * Компонент для отображения технической информации
 */

import React from 'react';
import { Card } from '@/components/ui/Card';
import styles from './TechInfo.module.scss';

interface TechInfoItem {
  label: string;
  value: string;
}

interface TechInfoProps {
  title: string;
  items: TechInfoItem[];
  className?: string;
}

export const TechInfo: React.FC<TechInfoProps> = ({ title, items, className }) => {
  return (
    <Card className={`${styles.techInfo} ${className || ''}`}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.techDetails}>
        {items.map((item, index) => (
          <div key={index} className={styles.techItem}>
            <strong>{item.label}:</strong> {item.value}
          </div>
        ))}
      </div>
    </Card>
  );
};
