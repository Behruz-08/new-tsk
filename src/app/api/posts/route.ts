/**
 * API endpoint for posts - combines JSONPlaceholder posts with locally created ones
 */

import { NextResponse } from "next/server";
import { Post } from "@/types";

// In-memory storage for demo purposes (in production, use a database)
let localPosts: Post[] = [];

/**
 * Get all posts from JSONPlaceholder and combine with local posts
 */
export async function GET() {
  try {
    // Fetch posts from JSONPlaceholder
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");

    if (!response.ok) {
      throw new Error(`JSONPlaceholder API error: ${response.status}`);
    }

    const jsonPlaceholderPosts: Post[] = await response.json();

    // Combine with local posts
    const allPosts = [...localPosts, ...jsonPlaceholderPosts];

    // Sort by ID (local posts have higher IDs)
    allPosts.sort((a, b) => b.id - a.id);

    return NextResponse.json({
      success: true,
      posts: allPosts,
      total: allPosts.length,
      localCount: localPosts.length,
      jsonPlaceholderCount: jsonPlaceholderPosts.length,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);

    // Return only local posts if JSONPlaceholder is unavailable
    return NextResponse.json({
      success: true,
      posts: localPosts,
      total: localPosts.length,
      localCount: localPosts.length,
      jsonPlaceholderCount: 0,
      error: "JSONPlaceholder unavailable, showing local posts only",
    });
  }
}

/**
 * Create a new post (adds to local storage)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Create new post with unique ID
    const newPost: Post = {
      id: Date.now(), // Use timestamp as unique ID
      title: body.title,
      body: body.body,
      userId: body.userId || 1,
    };

    // Add to local storage
    localPosts.unshift(newPost); // Add to beginning

    // Limit local posts to 50 to prevent memory issues
    if (localPosts.length > 50) {
      localPosts = localPosts.slice(0, 50);
    }

    console.log("New post created locally:", newPost);

    return NextResponse.json(
      {
        success: true,
        post: newPost,
        message: "Post created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating post:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create post",
      },
      { status: 500 },
    );
  }
}
