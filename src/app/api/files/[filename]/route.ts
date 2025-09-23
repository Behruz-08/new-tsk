/**
 * API endpoint for downloading uploaded files
 */

import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import { join } from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  try {
    const { filename } = await params;
    const uploadsDir = join(process.cwd(), "uploads");
    const filePath = join(uploadsDir, filename);

    // Check if file exists
    try {
      await stat(filePath);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Файл не найден",
        },
        { status: 404 },
      );
    }

    // Read file
    const fileBuffer = await readFile(filePath);

    // Get file extension for content type
    const extension = filename.split(".").pop()?.toLowerCase();
    let contentType = "application/octet-stream";

    switch (extension) {
      case "jpg":
      case "jpeg":
        contentType = "image/jpeg";
        break;
      case "png":
        contentType = "image/png";
        break;
      case "gif":
        contentType = "image/gif";
        break;
      case "pdf":
        contentType = "application/pdf";
        break;
      case "txt":
        contentType = "text/plain";
        break;
      case "json":
        contentType = "application/json";
        break;
    }

    // Return file with appropriate headers
    return new Response(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error downloading file:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Ошибка при скачивании файла",
      },
      { status: 500 },
    );
  }
}
