/**
 * API endpoint for comments - fetches from JSONPlaceholder
 */

import { NextResponse } from "next/server";
import { Comment } from "@/types";

/**
 * Get all comments from JSONPlaceholder
 */
export async function GET() {
  try {
    // Fetch comments from JSONPlaceholder
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/comments",
    );

    if (!response.ok) {
      throw new Error(`JSONPlaceholder API error: ${response.status}`);
    }

    const comments: Comment[] = await response.json();

    return NextResponse.json({
      success: true,
      comments: comments,
      total: comments.length,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch comments",
        comments: [],
        total: 0,
      },
      { status: 500 },
    );
  }
}
