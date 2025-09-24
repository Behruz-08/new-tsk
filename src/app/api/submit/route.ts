/**
 * API endpoint for form submission
 * Отправляет данные в JSONPlaceholder API как новый пост
 */

import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations";
import fs from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData();

    // Extract form fields
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;
    const file = formData.get("file") as File;

    // Validate the data
    const validationResult = contactFormSchema.safeParse({
      name,
      email,
      message,
      file,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Ошибка валидации данных",
          errors: validationResult.error.issues,
        },
        { status: 400 },
      );
    }

    // Handle file upload
    let filePath = null;
    if (file && file.size > 0) {
      const uploadDir = path.join(process.cwd(), "uploads");
      await fs.mkdir(uploadDir, { recursive: true });

      const uniqueFileName = `${Date.now()}_${name.replace(/\s/g, "")}_${
        file.name
      }`;
      filePath = path.join(uploadDir, uniqueFileName);
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);
    }

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Подготавливаем данные для отправки в JSONPlaceholder
    const postData = {
      title: `Сообщение от ${name}`,
      body: `Email: ${email}\n\nСообщение: ${message}${
        filePath ? `\n\nПрикрепленный файл: ${file.name}` : ""
      }`,
      userId: 1, // Используем фиксированный userId для демонстрации
    };

    // Отправляем POST запрос в JSONPlaceholder API
    const jsonPlaceholderResponse = await fetch(
      "https://jsonplaceholder.typicode.com/posts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      },
    );

    if (!jsonPlaceholderResponse.ok) {
      throw new Error(
        `JSONPlaceholder API error: ${jsonPlaceholderResponse.status}`,
      );
    }

    const jsonPlaceholderPost = await jsonPlaceholderResponse.json();

    // Также создаем локальный пост для отображения в списке
    const localPostResponse = await fetch(
      `${request.url.replace("/submit", "/posts")}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      },
    );

    let localPost = null;
    if (localPostResponse.ok) {
      const localResult = await localPostResponse.json();
      localPost = localResult.post;
    }

    const createdPost = localPost || jsonPlaceholderPost;

    // Log the submission
    console.log("Form submission received and posted to JSONPlaceholder:", {
      name,
      email,
      message,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      createdPostId: createdPost.id,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Форма успешно отправлена! Пост создан в JSONPlaceholder.",
        data: {
          postId: createdPost.id,
          title: createdPost.title,
          name,
          email,
          message,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          filePath: filePath, // Add file path to response
          submittedAt: new Date().toISOString(),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Form submission error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Внутренняя ошибка сервера",
      },
      { status: 500 },
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
