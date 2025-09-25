/**
 * API endpoint for posts - combines JSONPlaceholder posts with locally created ones
 */

import { NextResponse } from 'next/server';
import { Post } from '@/types';
import { LocalPost } from '@/types/api';
import { addLocalPost, getLocalPosts } from '@/lib/local-posts';
import { errorResponse } from '@/lib/api-helpers';

/**
 * Handles GET requests to fetch all posts.
 * Combines posts from JSONPlaceholder with locally stored posts.
 * If JSONPlaceholder is unavailable, it returns only local posts.
 * @returns A NextResponse containing an array of posts or an error response.
 */
export async function GET() {
  try {
    // Fetch posts from JSONPlaceholder
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');

    if (!response.ok) {
      throw new Error(`JSONPlaceholder API error: ${response.status}`);
    }

    const jsonPlaceholderPosts: Post[] = await response.json();

    // Combine with local posts
    const allPosts = [...getLocalPosts(), ...jsonPlaceholderPosts];

    // Sort by ID (local posts have higher IDs)
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

/**
 * Handles POST requests to create a new post.
 * Adds the new post to local storage.
 * Performs basic validation on the request body.
 * @param request - The incoming Next.js request object.
 * @returns A NextResponse indicating success or failure of post creation.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.title || !body.body) {
      return errorResponse<LocalPost>('Title and body are required', 400);
    }

    // Create new post with unique ID
    const newPost: LocalPost = {
      id: Date.now(), // Use timestamp as unique ID
      title: body.title,
      body: body.body,
      userId: body.userId || 1,
      fileUrl: body.fileUrl,
      createdAt: new Date().toISOString(),
    };

    // Add to local storage
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
