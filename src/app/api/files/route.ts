/**
 * API endpoint for file upload and listing
 */

import { NextResponse } from "next/server";
import { readdir, stat, mkdir, writeFile } from "fs/promises";
import { join } from "path";

export async function GET() {
  try {
    // For Vercel/serverless environment, return mock data
    // In production, you'd fetch from cloud storage or database
    return NextResponse.json({
      success: true,
      files: [],
      total: 0,
      message: "Demo mode - files are stored temporarily",
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

    // For Vercel/serverless environment, we'll use a mock file URL
    // In production, you'd typically use cloud storage (AWS S3, Cloudinary, etc.)
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    
    // Generate a mock URL for demonstration
    // In real production, this would be a cloud storage URL
    const fileUrl = `https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=${encodeURIComponent(file.name)}`;

    return NextResponse.json({
      success: true,
      message: "Файл успешно загружен (демо режим)",
      url: fileUrl,
      fileName: fileName,
      originalName: file.name,
      size: file.size,
      isDemo: true, // Flag to indicate this is a demo URL
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
