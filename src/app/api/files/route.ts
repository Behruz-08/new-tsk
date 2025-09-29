import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { FILE_CONFIG } from '@/constants';
import { ApiResponse, FileUploadResponse } from '@/types/api';

import { errorResponse } from '@/lib/api/api-helpers';

export async function GET(): Promise<NextResponse<ApiResponse<FileUploadResponse[]>>> {
  return NextResponse.json({ success: true, files: [] });
}

export async function POST(
  request: Request,
): Promise<NextResponse<ApiResponse<FileUploadResponse>>> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return errorResponse<FileUploadResponse>('Файл не найден', 400);
    }

    if (file.size > FILE_CONFIG.MAX_SIZE) {
      return errorResponse<FileUploadResponse>(
        `Размер файла не должен превышать ${FILE_CONFIG.MAX_SIZE / (1024 * 1024)}MB`,
        400,
      );
    }

    if (
      !FILE_CONFIG.ALLOWED_TYPES.includes(file.type as (typeof FILE_CONFIG.ALLOWED_TYPES)[number])
    ) {
      return errorResponse<FileUploadResponse>('Неподдерживаемый тип файла.', 400);
    }

    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;

    try {
      const blob = await put(fileName, file, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
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

      return errorResponse<FileUploadResponse>(
        'Ошибка при загрузке файла в Vercel Blob',
        500,
        blobError instanceof Error ? blobError : undefined,
      );
    }
  } catch (error) {
    return errorResponse<FileUploadResponse>(
      'Ошибка при загрузке файла',
      500,
      error instanceof Error ? error : undefined,
    );
  }
}
