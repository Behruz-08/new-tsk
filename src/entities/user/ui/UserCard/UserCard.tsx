'use client';

import { Mail, Phone, Globe, User as UserIcon } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

import type { User } from '@/entities/user';
import { Card } from '@/shared/ui/Card';

import styles from './UserCard.module.scss';

interface UserCardProps {
  user: User;
  className?: string;
  compact?: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({ user, className, compact = false }) => {
  return (
    <Card
      className={`${styles.userCard} ${compact ? styles.compact : ''} ${className || ''}`}
      hover
    >
      <div className={styles.userHeader}>
        <div className={styles.userAvatar}>
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name}
              width={48}
              height={48}
              className={styles.avatarImage}
            />
          ) : (
            <UserIcon size={24} />
          )}
        </div>
        <div className={styles.userInfo}>
          <h3 className={styles.userName}>{user.name}</h3>
          <p className={styles.userUsername}>@{user.username}</p>
        </div>
      </div>

      {!compact && (
        <div className={styles.userContacts}>
          <div className={styles.contactItem}>
            <Mail size={16} />
            <a href={`mailto:${user.email}`} className={styles.contactLink}>
              {user.email}
            </a>
          </div>

          {user.phone && (
            <div className={styles.contactItem}>
              <Phone size={16} />
              <a href={`tel:${user.phone}`} className={styles.contactLink}>
                {user.phone}
              </a>
            </div>
          )}

          {user.website && (
            <div className={styles.contactItem}>
              <Globe size={16} />
              <a
                href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactLink}
              >
                {user.website}
              </a>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
