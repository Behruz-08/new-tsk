/**
 * Utility functions for the application
 * Улучшенные утилиты с расширенной функциональностью
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { FILE_CONFIG } from "@/constants";

/**
 * Utility function for merging Tailwind CSS classes
 * Note: We'll replace this with SCSS utilities later
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Generate random ID for temporary entities
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Sleep function for testing loading states
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if value is empty (null, undefined, empty string, empty array)
 */
export function isEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map((item) => deepClone(item)) as T;
  if (typeof obj === "object") {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Get file type label from MIME type
 */
export function getFileTypeLabel(mimeType: string): string {
  return FILE_CONFIG.TYPE_LABELS[mimeType] || "Unknown File";
}

/**
 * Check if file type is allowed
 */
export function isFileTypeAllowed(mimeType: string): boolean {
  return (FILE_CONFIG.ALLOWED_TYPES as readonly string[]).includes(mimeType);
}

/**
 * Generate unique filename with timestamp
 */
export function generateUniqueFileName(
  originalName: string,
  prefix?: string,
): string {
  const timestamp = Date.now();
  const extension = originalName.split(".").pop();
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
  const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, "_");

  return prefix
    ? `${timestamp}_${prefix}_${sanitizedName}.${extension}`
    : `${timestamp}_${sanitizedName}.${extension}`;
}

/**
 * Validate file before upload
 */
export function validateFile(file: File): { isValid: boolean; error?: string } {
  if (!file) {
    return { isValid: false, error: "Файл не выбран" };
  }

  if (file.size > FILE_CONFIG.MAX_SIZE) {
    return {
      isValid: false,
      error: `Размер файла превышает ${FILE_CONFIG.MAX_SIZE / (1024 * 1024)}MB`,
    };
  }

  if (!isFileTypeAllowed(file.type)) {
    return {
      isValid: false,
      error: "Тип файла не поддерживается",
    };
  }

  return { isValid: true };
}
