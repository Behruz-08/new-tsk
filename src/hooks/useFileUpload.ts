/**
 * Custom hooks for file upload management
 * Хуки для работы с загрузкой файлов
 */

import { useState, useCallback, useRef } from 'react';
import { validateFile, formatFileSize, generateUniqueFileName } from '@/lib/utils';
import { ERROR_MESSAGES } from '@/constants';

/**
 * Represents a file that has been selected or uploaded, with its current status and progress.
 */
export interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  url?: string;
}

/**
 * A custom hook for managing file uploads within a component.
 * Provides functionalities to add, remove, update status/progress, and get statistics of uploaded files.
 * @returns An object containing the current list of files, upload state, file input ref, and various utility functions.
 */
export function useFileUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add files to the upload queue
  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const validFiles: UploadedFile[] = [];

    fileArray.forEach((file) => {
      const validation = validateFile(file);

      if (validation.isValid) {
        const uploadedFile: UploadedFile = {
          id: generateUniqueFileName(file.name),
          file,
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
          progress: 0,
          status: 'pending',
        };
        validFiles.push(uploadedFile);
      }
    });

    setFiles((prev) => [...prev, ...validFiles]);
    return validFiles;
  }, []);

  // Remove file from upload queue
  const removeFile = useCallback((fileId: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === fileId);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== fileId);
    });
  }, []);

  // Clear all files
  const clearFiles = useCallback(() => {
    setFiles((prev) => {
      prev.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
      return [];
    });
  }, []);

  // Update file progress
  const updateProgress = useCallback((fileId: string, progress: number) => {
    setFiles((prev) => prev.map((file) => (file.id === fileId ? { ...file, progress } : file)));
  }, []);

  // Update file status
  const updateStatus = useCallback(
    (fileId: string, status: UploadedFile['status'], error?: string, url?: string) => {
      setFiles((prev) =>
        prev.map((file) => (file.id === fileId ? { ...file, status, error, url } : file)),
      );
    },
    [],
  );

  // Trigger file input
  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Get file statistics
  const getStats = useCallback(() => {
    const totalFiles = files.length;
    const totalSize = files.reduce((sum, file) => sum + file.file.size, 0);
    const pendingFiles = files.filter((f) => f.status === 'pending').length;
    const uploadingFiles = files.filter((f) => f.status === 'uploading').length;
    const successFiles = files.filter((f) => f.status === 'success').length;
    const errorFiles = files.filter((f) => f.status === 'error').length;

    return {
      totalFiles,
      totalSize,
      totalSizeFormatted: formatFileSize(totalSize),
      pendingFiles,
      uploadingFiles,
      successFiles,
      errorFiles,
    };
  }, [files]);

  return {
    files,
    isUploading,
    fileInputRef,
    addFiles,
    removeFile,
    clearFiles,
    updateProgress,
    updateStatus,
    triggerFileInput,
    getStats,
    setFiles,
    setIsUploading,
  };
}

/**
 * A custom hook for enabling drag and drop file functionality.
 * Manages drag states and handles file drops.
 * @returns An object containing `isDragOver` state and drag event handlers.
 */
export function useDragAndDrop() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => prev + 1);
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragCounter((prev) => prev - 1);
      if (dragCounter === 1) {
        setIsDragOver(false);
      }
    },
    [dragCounter],
  );

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: DragEvent, onFiles: (files: FileList) => void) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDragCounter(0);

    if (e.dataTransfer?.files) {
      onFiles(e.dataTransfer.files);
    }
  }, []);

  return {
    isDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  };
}

/**
 * A custom hook for integrating file upload functionality with an API endpoint.
 * Uses `useFileUpload` for file management and handles XHR requests for upload progress and status.
 * @returns An object combining the functionalities of `useFileUpload` with API upload capabilities.
 */
export function useFileUploadApi() {
  const fileUpload = useFileUpload();
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = useCallback(
    async (file: UploadedFile, endpoint: string, additionalData?: Record<string, unknown>) => {
      try {
        fileUpload.updateStatus(file.id, 'uploading');

        const formData = new FormData();
        formData.append('file', file.file);

        if (additionalData) {
          Object.entries(additionalData).forEach(([key, value]) => {
            formData.append(key, String(value));
          });
        }

        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            fileUpload.updateProgress(file.id, progress);
            setUploadProgress(progress);
          }
        });

        // Handle completion
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            fileUpload.updateStatus(file.id, 'success', undefined, response.url);
          } else {
            fileUpload.updateStatus(
              file.id,
              'error',
              `${ERROR_MESSAGES.UPLOAD_FAILED_HTTP} ${xhr.status}: ${xhr.statusText}`,
            );
          }
        });

        // Handle errors
        xhr.addEventListener('error', () => {
          fileUpload.updateStatus(file.id, 'error', ERROR_MESSAGES.NETWORK);
        });

        // Start upload
        xhr.open('POST', endpoint);
        xhr.send(formData);
      } catch (error) {
        fileUpload.updateStatus(
          file.id,
          'error',
          error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN,
        );
      }
    },
    [fileUpload],
  );

  const uploadAllFiles = useCallback(
    async (endpoint: string, additionalData?: Record<string, unknown>) => {
      const pendingFiles = fileUpload.files.filter((f) => f.status === 'pending');

      if (pendingFiles.length === 0) return;

      fileUpload.setIsUploading(true);
      setUploadProgress(0);

      try {
        await Promise.all(pendingFiles.map((file) => uploadFile(file, endpoint, additionalData)));
      } finally {
        fileUpload.setIsUploading(false);
      }
    },
    [fileUpload, uploadFile],
  );

  return {
    ...fileUpload,
    uploadFile,
    uploadAllFiles,
    uploadProgress,
  };
}
