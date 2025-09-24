/**
 * Centralized exports for all Zustand stores
 * Централизованный экспорт всех Zustand stores
 */

// Posts store
export {
  usePostsStore,
  usePosts,
  useLocalPosts,
  usePostsLoading,
  usePostsError,
  usePostsActions,
} from './postsStore';

// Files store
export {
  useFilesStore,
  useFiles,
  useUploadedFiles,
  useFilesUploading,
  useUploadProgress,
  useFilesError,
  useFilesActions,
} from './filesStore';

// Custom hooks
export { usePostsWithZustand } from '../hooks/usePostsWithZustand';
