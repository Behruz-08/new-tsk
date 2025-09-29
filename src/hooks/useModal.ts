import { useState, useCallback, useEffect } from 'react';

import { useModalState, useModalActions } from '@/store';

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

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
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

export function useLocalModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  const [isClosing, setIsClosing] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
    setIsClosing(false);
  }, []);

  const close = useCallback(() => {
    setIsClosing(true);
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

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
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
