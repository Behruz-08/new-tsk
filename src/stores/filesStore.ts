/**
 * Zustand store for file management
 * Хранилище состояния для управления файлами
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface FileInfo {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

interface FilesState {
  // State
  files: FileInfo[];
  uploadedFiles: FileInfo[];
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  
  // Actions
  setFiles: (files: FileInfo[]) => void;
  addFile: (file: FileInfo) => void;
  removeFile: (id: string) => void;
  setUploading: (uploading: boolean) => void;
  setUploadProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Computed
  getFileById: (id: string) => FileInfo | undefined;
  getFilesByType: (type: string) => FileInfo[];
  getTotalSize: () => number;
}

export const useFilesStore = create<FilesState>()(
  devtools(
    (set, get) => ({
      // Initial state
      files: [],
      uploadedFiles: [],
      isUploading: false,
      uploadProgress: 0,
      error: null,

      // Actions
      setFiles: (files) => set({ files }, false, 'setFiles'),
      
      addFile: (file) => set((state) => ({
        files: [...state.files, file],
        uploadedFiles: [...state.uploadedFiles, file],
      }), false, 'addFile'),
      
      removeFile: (id) => set((state) => ({
        files: state.files.filter((file) => file.id !== id),
        uploadedFiles: state.uploadedFiles.filter((file) => file.id !== id),
      }), false, 'removeFile'),
      
      setUploading: (isUploading) => set({ isUploading }, false, 'setUploading'),
      
      setUploadProgress: (uploadProgress) => set({ uploadProgress }, false, 'setUploadProgress'),
      
      setError: (error) => set({ error }, false, 'setError'),
      
      clearError: () => set({ error: null }, false, 'clearError'),

      // Computed getters
      getFileById: (id) => {
        const state = get();
        return state.files.find((file) => file.id === id);
      },
      
      getFilesByType: (type) => {
        const state = get();
        return state.files.filter((file) => file.type.startsWith(type));
      },
      
      getTotalSize: () => {
        const state = get();
        return state.files.reduce((total, file) => total + file.size, 0);
      },
    }),
    {
      name: 'files-store', // Unique name for devtools
    }
  )
);

// Selectors for better performance
export const useFiles = () => useFilesStore((state) => state.files);
export const useUploadedFiles = () => useFilesStore((state) => state.uploadedFiles);
export const useFilesUploading = () => useFilesStore((state) => state.isUploading);
export const useUploadProgress = () => useFilesStore((state) => state.uploadProgress);
export const useFilesError = () => useFilesStore((state) => state.error);

// Action selectors
export const useFilesActions = () => useFilesStore((state) => ({
  setFiles: state.setFiles,
  addFile: state.addFile,
  removeFile: state.removeFile,
  setUploading: state.setUploading,
  setUploadProgress: state.setUploadProgress,
  setError: state.setError,
  clearError: state.clearError,
}));
