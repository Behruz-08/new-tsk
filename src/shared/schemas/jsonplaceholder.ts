import { z } from 'zod';

export const zPost = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string(),
  body: z.string(),
  fileUrl: z.string().url().optional(),
  createdAt: z.string().optional(),
});

export const zComment = z.object({
  id: z.number(),
  postId: z.number(),
  name: z.string(),
  email: z.string().email(),
  body: z.string(),
});

export const zPosts = z.array(zPost);
export const zComments = z.array(zComment);
