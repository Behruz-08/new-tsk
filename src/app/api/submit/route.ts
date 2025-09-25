import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema } from '@/lib/validations';
import { saveLocalFile } from '@/lib/file-utils';
import { errorResponse } from '@/lib/api-helpers';
import { ApiResponse } from '@/types';
import { SubmitPostResponse } from '@/types/api';

/**
 * Handles POST requests for form submissions.
 * Validates form data, saves attached files locally, and posts data to JSONPlaceholder.
 * It also creates a local post for display in the application.
 * @param request - The incoming Next.js request object containing form data.
 * @returns A NextResponse with submission details or an error response.
 */
export async function POST(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<SubmitPostResponse>>> {
  try {
    // Parse form data
    const formData = await request.formData();

    // Extract form fields
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;
    const file = formData.get('file') as File | null;

    // Validate the data
    const validationResult = contactFormSchema.safeParse({
      name,
      email,
      message,
      file,
    });

    if (!validationResult.success) {
      return errorResponse(
        'Ошибка валидации данных',
        400,
        new Error(validationResult.error.issues.map((issue) => issue.message).join(', ')),
      );
    }

    // Handle file upload
    let filePath: string | null = null;
    if (file && file instanceof File && file.size > 0) {
      filePath = await saveLocalFile(file, name);
    }

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Prepare data for JSONPlaceholder
    const postData = {
      title: `Сообщение от ${name}`,
      body: `Email: ${email}\n\nСообщение: ${message}${
        filePath ? `\n\nПрикрепленный файл: ${file?.name || 'неизвестный файл'}` : ''
      }`,
      userId: 1, // Using fixed userId for demonstration
    };

    // Send POST request to JSONPlaceholder API
    const jsonPlaceholderResponse = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    if (!jsonPlaceholderResponse.ok) {
      throw new Error(`JSONPlaceholder API error: ${jsonPlaceholderResponse.status}`);
    }

    const jsonPlaceholderPost = await jsonPlaceholderResponse.json();

    // Also create a local post to display in the list
    const localPostResponse = await fetch(`${request.url.replace('/submit', '/posts')}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    let localPost = null;
    if (localPostResponse.ok) {
      const localResult = await localPostResponse.json();
      localPost = localResult.post;
    }

    const createdPost = localPost || jsonPlaceholderPost;

    // Log the submission
    console.log('Form submission received and posted to JSONPlaceholder:', {
      name,
      email,
      message,
      fileName: file?.name || null,
      fileSize: file?.size || 0,
      fileType: file?.type || null,
      createdPostId: createdPost.id,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Форма успешно отправлена! Пост создан в JSONPlaceholder.',
        data: {
          postId: createdPost.id,
          title: createdPost.title,
          name,
          email,
          message,
          fileName: file?.name || undefined,
          fileSize: file?.size || 0,
          fileType: file?.type || undefined,
          filePath: filePath || undefined, // Add file path to response
          submittedAt: new Date().toISOString(),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return errorResponse(
      'Внутренняя ошибка сервера',
      500,
      error instanceof Error ? error : new Error('Unknown error'),
    );
  }
}

/**
 * Handles OPTIONS requests for CORS preflight.
 * @returns A NextResponse with appropriate CORS headers.
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
