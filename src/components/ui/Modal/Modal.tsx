/**
 * Reusable Modal component with accessibility features
 */

"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/useModal";
import styles from "./Modal.module.scss";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

/**
 * Modal component with proper accessibility and keyboard navigation
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className,
}) => {
  const { isClosing, close } = useModal(isOpen);

  // Handle close functionality
  const handleClose = React.useCallback(() => {
    close();
    // Delay the actual close callback to allow for exit animation
    setTimeout(() => {
      onClose();
    }, 200);
  }, [close, onClose]);

  // Handle overlay click
  const handleOverlayClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnOverlayClick && event.target === event.currentTarget) {
        handleClose();
      }
    },
    [closeOnOverlayClick, handleClose],
  );

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, closeOnEscape, handleClose]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Focus the modal when it opens
      const modal = document.getElementById("modal-content");
      if (modal) {
        modal.focus();
      }
    }
  }, [isOpen]);

  // Don't render if not open
  if (!isOpen) return null;

  return createPortal(
    <div
      className={cn(styles.overlay, {
        [styles["overlay--closing"]]: isClosing,
      })}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        id="modal-content"
        className={cn(
          styles.content,
          styles[`content--${size}`],
          {
            [styles["content--closing"]]: isClosing,
          },
          className,
        )}
        tabIndex={-1}
      >
        {/* Header */}
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

        {/* Body */}
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body,
  );
};

/**
 * Hook for managing modal state
 */
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
