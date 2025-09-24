/**
 * API endpoint for file upload and listing
 */

import { NextResponse } from "next/server";
import { readdir, stat, mkdir, writeFile } from "fs/promises";
import { join } from "path";

export async function GET() {
  try {
    const uploadsDir = join(process.cwd(), "uploads");

    // Check if uploads directory exists
    try {
      await stat(uploadsDir);
    } catch {
      // Directory doesn't exist, return empty array
      return NextResponse.json({
        success: true,
        files: [],
        message: "No files uploaded yet",
      });
    }

    // Read directory contents
    const files = await readdir(uploadsDir);

    // Get file stats for each file
    const fileList = await Promise.all(
      files.map(async (fileName) => {
        const filePath = join(uploadsDir, fileName);
        const stats = await stat(filePath);

        return {
          fileName,
          originalName: fileName.split("_").slice(2).join("_"), // Remove timestamp and name prefix
          size: stats.size,
          uploadDate: stats.birthtime,
          modifiedDate: stats.mtime,
        };
      }),
    );

    // Sort by upload date (newest first)
    fileList.sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime());

    return NextResponse.json({
      success: true,
      files: fileList,
      total: fileList.length,
    });
  } catch (error) {
    console.error("Error reading files:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Ошибка при получении списка файлов",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "Файл не найден",
        },
        { status: 400 },
      );
    }

    // For Vercel deployment - return a mock file URL
    // In production, you should use external storage like Vercel Blob, AWS S3, etc.
    const mockFileUrl = `https://via.placeholder.com/300x200/007bff/ffffff?text=${encodeURIComponent(file.name)}`;

    return NextResponse.json({
      success: true,
      message: "Файл успешно загружен (демо режим)",
      url: mockFileUrl,
      fileName: file.name,
      originalName: file.name,
      size: file.size,
    });
  } catch (error) {
    console.error("Ошибка при загрузке файла:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Ошибка при загрузке файла",
      },
      { status: 500 },
    );
  }
}
