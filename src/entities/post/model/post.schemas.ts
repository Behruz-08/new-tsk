import { z } from 'zod';

export const zPost = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string(),
  body: z.string(),
  fileUrl: z.string().url().optional(),
  createdAt: z.string().optional(),
});

export const zPosts = z.array(zPost);

export const zCreatePostDto = zPost.omit({ id: true });
export const zUpdatePostDto = zCreatePostDto.partial().extend({ id: z.number() });
