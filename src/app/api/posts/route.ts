import { NextResponse } from 'next/server';

import { apiClient } from '@/lib/api/api-client';
import { errorResponse } from '@/lib/api/api-helpers';
import { addLocalPost, getLocalPosts } from '@/lib/data/local-posts';
import type { Post } from '@/types';
import type { LocalPost } from '@/types/api';

export async function GET() {
  try {
    const jsonPlaceholderPosts = await apiClient.get<Post[]>('/posts');

    const allPosts = [...getLocalPosts(), ...jsonPlaceholderPosts];

    allPosts.sort((a, b) => b.id - a.id);

    return NextResponse.json({
      success: true,
      posts: allPosts,
      total: allPosts.length,
      localCount: getLocalPosts().length,
      jsonPlaceholderCount: jsonPlaceholderPosts.length,
    });
  } catch (error) {
    return errorResponse<Post[]>(
      'Error fetching posts',
      500,
      error instanceof Error ? error : undefined,
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.body) {
      return errorResponse<LocalPost>('Title and body are required', 400);
    }

    const newPost: LocalPost = {
      id: Date.now(),
      title: body.title,
      body: body.body,
      userId: body.userId || 1,
      fileUrl: body.fileUrl,
      createdAt: new Date().toISOString(),
    };

    addLocalPost(newPost);

    console.log('New post created locally:', newPost);

    return NextResponse.json(
      {
        success: true,
        post: newPost,
        message: 'Post created successfully',
      },
      { status: 201 },
    );
  } catch (error) {
    return errorResponse<LocalPost>(
      'Failed to create post',
      500,
      error instanceof Error ? error : undefined,
    );
  }
}
