/**
 * Zustand store for centralized state management
 * Централизованное управление состоянием с помощью Zustand
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Post, Comment } from '@/types';

/**
 * Interface for file information
 * Интерфейс для информации о файлах
 */
export interface FileInfo {
  fileName: string;
  originalName: string;
  size: number;
  uploadDate: string;
  modifiedDate: string;
}

/**
 * Interface for modal state
 * Интерфейс для состояния модальных окон
 */
interface ModalState {
  isOpen: boolean;
  isClosing: boolean;
}

/**
 * Main application state interface
 * Основной интерфейс состояния приложения
 */
interface AppState {
  // Posts state
  posts: Post[];
  postsLoading: boolean;
  postsError: string | null;

  // Comments state
  comments: Comment[];
  commentsLoading: boolean;
  commentsError: string | null;

  // Files state
  files: FileInfo[];
  filesLoading: boolean;
  filesError: string | null;
  fileListRefreshTrigger: number;

  // Modal states
  modals: Record<string, ModalState>;

  // Actions for posts
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  updatePost: (id: number, updates: Partial<Post>) => void;
  deletePost: (id: number) => void;
  setPostsLoading: (loading: boolean) => void;
  setPostsError: (error: string | null) => void;

  // Actions for comments
  setComments: (comments: Comment[]) => void;
  setCommentsLoading: (loading: boolean) => void;
  setCommentsError: (error: string | null) => void;

  // Actions for files
  setFiles: (files: FileInfo[]) => void;
  addFile: (file: FileInfo) => void;
  removeFile: (fileName: string) => void;
  setFilesLoading: (loading: boolean) => void;
  setFilesError: (error: string | null) => void;
  refreshFileList: () => void;

  // Actions for modals
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  toggleModal: (modalId: string) => void;
  isModalOpen: (modalId: string) => boolean;
  closeAllModals: () => void;

  // Reset actions
  resetPosts: () => void;
  resetComments: () => void;
  resetFiles: () => void;
  resetAll: () => void;
}

/**
 * Main application store
 * Основное хранилище приложения
 */
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        posts: [],
        postsLoading: false,
        postsError: null,

        comments: [],
        commentsLoading: false,
        commentsError: null,

        files: [],
        filesLoading: false,
        filesError: null,
        fileListRefreshTrigger: 0,

        modals: {},

        // Posts actions
        setPosts: (posts) => set({ posts }),
        addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
        updatePost: (id, updates) =>
          set((state) => ({
            posts: state.posts.map((post) => (post.id === id ? { ...post, ...updates } : post)),
          })),
        deletePost: (id) =>
          set((state) => ({
            posts: state.posts.filter((post) => post.id !== id),
          })),
        setPostsLoading: (loading) => set({ postsLoading: loading }),
        setPostsError: (error) => set({ postsError: error }),

        // Comments actions
        setComments: (comments) => set({ comments }),
        setCommentsLoading: (loading) => set({ commentsLoading: loading }),
        setCommentsError: (error) => set({ commentsError: error }),

        // Files actions
        setFiles: (files) => set({ files }),
        addFile: (file) => set((state) => ({ files: [...state.files, file] })),
        removeFile: (fileName) =>
          set((state) => ({
            files: state.files.filter((file) => file.fileName !== fileName),
          })),
        setFilesLoading: (loading) => set({ filesLoading: loading }),
        setFilesError: (error) => set({ filesError: error }),
        refreshFileList: async () => {
          // Trigger refresh by incrementing the trigger counter
          // The FileList component will react to this change and fetch files
          set((state) => ({ fileListRefreshTrigger: state.fileListRefreshTrigger + 1 }));
        },

        // Modal actions
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
          const currentState = get().modals[modalId];
          const isOpen = currentState?.isOpen ?? false;
          if (isOpen) {
            get().closeModal(modalId);
          } else {
            get().openModal(modalId);
          }
        },
        isModalOpen: (modalId) => get().modals[modalId]?.isOpen ?? false,
        closeAllModals: () => set({ modals: {} }),

        // Reset actions
        resetPosts: () => set({ posts: [], postsLoading: false, postsError: null }),
        resetComments: () => set({ comments: [], commentsLoading: false, commentsError: null }),
        resetFiles: () => set({ files: [], filesLoading: false, filesError: null }),
        resetAll: () =>
          set({
            posts: [],
            postsLoading: false,
            postsError: null,
            comments: [],
            commentsLoading: false,
            commentsError: null,
            files: [],
            filesLoading: false,
            filesError: null,
            fileListRefreshTrigger: 0,
            modals: {},
          }),
      }),
      {
        name: 'app-store',
        partialize: (state) => ({
          // Persist only essential state
          posts: state.posts,
        }),
      },
    ),
    {
      name: 'app-store',
    },
  ),
);

/**
 * Legacy posts store for backward compatibility
 * Устаревший store для постов для обратной совместимости
 * @deprecated Use usePostsQuery from @/hooks/useApi for data fetching
 */
export const usePostsStore = create<{
  posts: Post[];
  addPost: (post: Post) => void;
  setPosts: (posts: Post[]) => void;
}>((set) => ({
  posts: [],
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  setPosts: (posts) => set(() => ({ posts })),
}));

/**
 * Convenience hooks for specific parts of the store
 * Удобные хуки для конкретных частей store
 */

// Posts hooks - for UI state management only
// Use usePostsQuery from @/hooks/useApi for data fetching
export const usePostsState = () => {
  const posts = useAppStore((state) => state.posts);
  const loading = useAppStore((state) => state.postsLoading);
  const error = useAppStore((state) => state.postsError);

  return { posts, loading, error };
};

export const usePostsActions = () => {
  const setPosts = useAppStore((state) => state.setPosts);
  const addPost = useAppStore((state) => state.addPost);
  const updatePost = useAppStore((state) => state.updatePost);
  const deletePost = useAppStore((state) => state.deletePost);
  const setLoading = useAppStore((state) => state.setPostsLoading);
  const setError = useAppStore((state) => state.setPostsError);
  const reset = useAppStore((state) => state.resetPosts);

  return {
    setPosts,
    addPost,
    updatePost,
    deletePost,
    setLoading,
    setError,
    reset,
  };
};

// Comments hooks - for UI state management only
// Use useCommentsQuery from @/hooks/useApi for data fetching
export const useCommentsState = () => {
  const comments = useAppStore((state) => state.comments);
  const loading = useAppStore((state) => state.commentsLoading);
  const error = useAppStore((state) => state.commentsError);

  return { comments, loading, error };
};

export const useCommentsActions = () => {
  const setComments = useAppStore((state) => state.setComments);
  const setLoading = useAppStore((state) => state.setCommentsLoading);
  const setError = useAppStore((state) => state.setCommentsError);
  const reset = useAppStore((state) => state.resetComments);

  return { setComments, setLoading, setError, reset };
};

// Files hooks - for UI state management only
// Use useFileUpload from @/hooks/useFileUpload for file operations
export const useFilesState = () => {
  const files = useAppStore((state) => state.files);
  const loading = useAppStore((state) => state.filesLoading);
  const error = useAppStore((state) => state.filesError);
  const refreshTrigger = useAppStore((state) => state.fileListRefreshTrigger);

  return { files, loading, error, refreshTrigger };
};

export const useFilesActions = () => {
  const setFiles = useAppStore((state) => state.setFiles);
  const addFile = useAppStore((state) => state.addFile);
  const removeFile = useAppStore((state) => state.removeFile);
  const setLoading = useAppStore((state) => state.setFilesLoading);
  const setError = useAppStore((state) => state.setFilesError);
  const refresh = useAppStore((state) => state.refreshFileList);
  const reset = useAppStore((state) => state.resetFiles);

  return {
    setFiles,
    addFile,
    removeFile,
    setLoading,
    setError,
    refresh,
    reset,
  };
};

// Modal hooks
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
