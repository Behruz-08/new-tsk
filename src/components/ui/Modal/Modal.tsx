'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { useLocalModal } from '@/hooks/useModal';
import { cn } from '@/lib/utils/utils';

import styles from './Modal.module.scss';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className,
}) => {
  const { isClosing, close } = useLocalModal(isOpen);

  const handleClose = React.useCallback(() => {
    close();
    setTimeout(() => {
      onClose();
    }, 200);
  }, [close, onClose]);

  const handleOverlayClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnOverlayClick && event.target === event.currentTarget) {
        handleClose();
      }
    },
    [closeOnOverlayClick, handleClose],
  );

  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeOnEscape, handleClose]);

  useEffect(() => {
    if (isOpen) {
      const modal = document.getElementById('modal-content');
      if (modal) {
        modal.focus();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={cn(styles.overlay, {
        [styles['overlay--closing']]: isClosing,
      })}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        id="modal-content"
        className={cn(
          styles.content,
          styles[`content--${size}`],
          {
            [styles['content--closing']]: isClosing,
          },
          className,
        )}
        tabIndex={-1}
      >
        {(title || showCloseButton) && (
          <div className={styles.header}>
            {title && (
              <h2 id="modal-title" className={styles.title}>
                {title}
              </h2>
            )}

            {showCloseButton && (
              <button
                type="button"
                className={styles.closeButton}
                onClick={handleClose}
                aria-label="Закрыть модальное окно"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        )}

        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body,
  );
};

export function useModalState(initialState = false) {
  const [isOpen, setIsOpen] = React.useState(initialState);

  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);
  const toggle = React.useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
