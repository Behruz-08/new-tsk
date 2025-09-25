/**
 * API endpoint for file upload using Vercel Blob Storage
 */

import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { FILE_CONFIG } from '@/constants';
import { ApiResponse, FileUploadResponse } from '@/types/api';
import type { FileInfo } from '@/store';
import { errorResponse } from '@/lib/api-helpers';
import fs from 'fs';
import path from 'path';

/**
 * Validates a file against predefined size and type constraints.
 * @param file - The file to validate.
 * @returns A string containing an error message if validation fails, otherwise null.
 */
function validateFile(file: File): string | null {
  if (file.size > FILE_CONFIG.MAX_SIZE) {
    return `Размер файла не должен превышать ${FILE_CONFIG.MAX_SIZE / (1024 * 1024)}MB`;
  }

  if (
    !FILE_CONFIG.ALLOWED_TYPES.includes(file.type as (typeof FILE_CONFIG.ALLOWED_TYPES)[number])
  ) {
    return 'Неподдерживаемый тип файла.';
  }
  return null;
}

/**
 * Handles GET requests for file information.
 * Reads local files from the uploads directory.
 * @returns A NextResponse containing file information or an error response.
 */
export async function GET(): Promise<NextResponse<ApiResponse<FileInfo[]>>> {
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads');

    // Check if uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      return NextResponse.json({
        success: true,
        files: [],
        total: 0,
        message: 'Uploads directory does not exist',
      });
    }

    // Read all files from uploads directory
    const files = fs.readdirSync(uploadsDir);
    const fileInfos: FileInfo[] = [];

    for (const fileName of files) {
      const filePath = path.join(uploadsDir, fileName);
      const stats = fs.statSync(filePath);

      // Skip directories
      if (stats.isDirectory()) continue;

      // Parse filename to extract original name and timestamp
      // Format: timestamp_originalName
      const parts = fileName.split('_');
      const timestamp = parts[0];
      const originalName = parts.slice(1).join('_');

      fileInfos.push({
        fileName: fileName,
        originalName: originalName,
        size: stats.size,
        uploadDate: new Date(parseInt(timestamp)).toISOString(),
        modifiedDate: stats.mtime.toISOString(),
      });
    }

    // Sort by upload date (newest first)
    fileInfos.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());

    return NextResponse.json({
      success: true,
      files: fileInfos,
      total: fileInfos.length,
      message: `Found ${fileInfos.length} files`,
    });
  } catch (error) {
    return errorResponse<FileInfo[]>(
      'Error reading files',
      500,
      error instanceof Error ? error : undefined,
    );
  }
}

/**
 * Handles POST requests for file uploads.
 * Uploads the file to Vercel Blob Storage after validation.
 * Provides a fallback URL if Blob storage fails.
 * @param request - The incoming Next.js request object containing the file in FormData.
 * @returns A NextResponse with upload details or an error response.
 */
export async function POST(
  request: Request,
): Promise<NextResponse<ApiResponse<FileUploadResponse>>> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return errorResponse<FileUploadResponse>('Файл не найден', 400);
    }

    // Server-side validation
    const validationError = validateFile(file);
    if (validationError) {
      return errorResponse<FileUploadResponse>(validationError, 400);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;

    try {
      // Upload to Vercel Blob Storage
      const blob = await put(fileName, file, {
        access: 'public',
      });

      return NextResponse.json({
        success: true,
        message: 'Файл успешно загружен',
        url: blob.url,
        fileName: fileName,
        originalName: file.name,
        size: file.size,
        blobId: blob.pathname,
      });
    } catch (blobError) {
      console.error('Vercel Blob error:', blobError);

      // Fallback to mock URL if Blob storage fails
      const fallbackUrl = `https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=${encodeURIComponent(file.name)}`;

      return NextResponse.json({
        success: true,
        message: 'Файл загружен (fallback режим)',
        url: fallbackUrl,
        fileName: fileName,
        originalName: file.name,
        size: file.size,
        isDemo: true,
      });
    }
  } catch (error) {
    return errorResponse<FileUploadResponse>(
      'Ошибка при загрузке файла',
      500,
      error instanceof Error ? error : undefined,
    );
  }
}
