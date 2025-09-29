import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { apiClient } from '@/lib/api/api-client';
import { errorResponse } from '@/lib/api/api-helpers';
import { contactFormSchema } from '@/lib/utils/validations';
import type { ApiResponse } from '@/types';
import type { SubmitPostResponse } from '@/types/api';

export async function POST(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<SubmitPostResponse>>> {
  try {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;
    const fileUrl = formData.get('fileUrl') as string | null;

    const validationResult = contactFormSchema.safeParse({
      name,
      email,
      message,
      file: fileUrl,
    });

    if (!validationResult.success) {
      return errorResponse(
        'Ошибка валидации данных',
        400,
        new Error(validationResult.error.issues.map((issue) => issue.message).join(', ')),
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const postData = {
      title: `Сообщение от ${name}`,
      body: `Email: ${email}\n\nСообщение: ${message}`,
      userId: 1,
      ...(fileUrl && { fileUrl }),
    };

    const jsonPlaceholderPost = await apiClient.post('/posts', postData);

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
          fileUrl: fileUrl || undefined,
          fileName: fileUrl ? fileUrl.split('/').pop() : undefined,
          fileSize: 0,
          fileType: fileUrl ? fileUrl.split('.').pop() : undefined,
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
