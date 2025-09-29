/**
 * Unified modal hooks with global state management
 * Унифицированные хуки для модальных окон с глобальным управлением состоянием
 */

import { useState, useCallback, useEffect } from 'react';
import { useModalState, useModalActions } from '@/store';

/**
 * Hook for managing modal open/close state with animation support
 * Uses global Zustand store for state management
 */
export function useModal(modalId: string) {
  const { isOpen, isClosing } = useModalState(modalId);
  const { openModal, closeModal, toggleModal } = useModalActions();

  const open = useCallback(() => {
    openModal(modalId);
  }, [modalId, openModal]);

  const close = useCallback(() => {
    closeModal(modalId);
  }, [modalId, closeModal]);

  const toggle = useCallback(() => {
    toggleModal(modalId);
  }, [modalId, toggleModal]);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, close]);

  return {
    isOpen,
    isClosing,
    open,
    close,
    toggle,
  };
}

/**
 * Hook for managing multiple modals
 * Uses global Zustand store for centralized modal management
 */
export function useMultipleModals() {
  const { openModal, closeModal, toggleModal, isModalOpen, closeAllModals } = useModalActions();

  return {
    openModal,
    closeModal,
    toggleModal,
    isModalOpen,
    closeAllModals,
  };
}

/**
 * Hook for managing a single modal with local state (fallback)
 * Use this only when you need isolated modal state
 */
export function useLocalModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  const [isClosing, setIsClosing] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
    setIsClosing(false);
  }, []);

  const close = useCallback(() => {
    setIsClosing(true);
    // Delay the actual closing to allow for exit animations
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 200);
  }, []);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, close]);

  return {
    isOpen,
    isClosing,
    open,
    close,
    toggle,
  };
}
