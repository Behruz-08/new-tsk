/**
 * API endpoint for getting list of uploaded files
 */

import { NextResponse } from "next/server";
import { readdir, stat } from "fs/promises";
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
