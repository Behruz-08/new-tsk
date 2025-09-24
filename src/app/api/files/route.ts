/**
 * API endpoint for file upload using Vercel Blob Storage
 */

import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

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
        message: "Файл успешно загружен",
        url: blob.url,
        fileName: fileName,
        originalName: file.name,
        size: file.size,
        blobId: blob.pathname,
      });
    } catch (blobError) {
      console.error("Vercel Blob error:", blobError);
      
      // Fallback to mock URL if Blob storage fails
      const fallbackUrl = `https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=${encodeURIComponent(file.name)}`;
      
      return NextResponse.json({
        success: true,
        message: "Файл загружен (fallback режим)",
        url: fallbackUrl,
        fileName: fileName,
        originalName: file.name,
        size: file.size,
        isDemo: true,
      });
    }
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
