import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ModalState {
  isOpen: boolean;
  isClosing: boolean;
}

interface AppState {
  modals: Record<string, ModalState>;

  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  toggleModal: (modalId: string) => void;
  isModalOpen: (modalId: string) => boolean;
  closeAllModals: () => void;

  resetAll: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      modals: {},

      openModal: (modalId) =>
        set((state) => ({
          modals: {
            ...state.modals,
            [modalId]: { isOpen: true, isClosing: false },
          },
        })),
      closeModal: (modalId) =>
        set((state) => ({
          modals: {
            ...state.modals,
            [modalId]: { isOpen: false, isClosing: true },
          },
        })),
      toggleModal: (modalId) => {
        const isOpen = get().modals[modalId]?.isOpen ?? false;
        if (isOpen) {
          get().closeModal(modalId);
        } else {
          get().openModal(modalId);
        }
      },
      isModalOpen: (modalId) => get().modals[modalId]?.isOpen ?? false,
      closeAllModals: () => set({ modals: {} }),

      resetAll: () =>
        set({
          modals: {},
        }),
    }),
    {
      name: 'app-store',
    },
  ),
);

export const useModalState = (modalId: string) => {
  const isOpen = useAppStore((state) => state.isModalOpen(modalId));
  const isClosing = useAppStore((state) => state.modals[modalId]?.isClosing ?? false);

  return { isOpen, isClosing };
};

export const useModalActions = () => {
  const openModal = useAppStore((state) => state.openModal);
  const closeModal = useAppStore((state) => state.closeModal);
  const toggleModal = useAppStore((state) => state.toggleModal);
  const isModalOpen = useAppStore((state) => state.isModalOpen);
  const closeAllModals = useAppStore((state) => state.closeAllModals);

  return {
    openModal,
    closeModal,
    toggleModal,
    isModalOpen,
    closeAllModals,
  };
};
