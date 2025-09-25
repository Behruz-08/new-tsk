/**
 * Custom hook for managing modal state
 */

import { useState, useCallback, useEffect } from 'react';

interface UseModalState {
  isOpen: boolean;
  isClosing: boolean;
}

interface UseModalActions {
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * Hook for managing modal open/close state with animation support
 */
export function useModal(initialState = false): UseModalState & UseModalActions {
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

/**
 * Hook for managing multiple modals
 */
export function useMultipleModals() {
  const [modals, setModals] = useState<Record<string, boolean>>({});

  const openModal = useCallback((modalId: string) => {
    setModals((prev) => ({
      ...prev,
      [modalId]: true,
    }));
  }, []);

  const closeModal = useCallback((modalId: string) => {
    setModals((prev) => ({
      ...prev,
      [modalId]: false,
    }));
  }, []);

  const toggleModal = useCallback((modalId: string) => {
    setModals((prev) => ({
      ...prev,
      [modalId]: !prev[modalId],
    }));
  }, []);

  const isModalOpen = useCallback(
    (modalId: string) => {
      return modals[modalId] || false;
    },
    [modals],
  );

  const closeAllModals = useCallback(() => {
    setModals({});
  }, []);

  return {
    openModal,
    closeModal,
    toggleModal,
    isModalOpen,
    closeAllModals,
  };
}
