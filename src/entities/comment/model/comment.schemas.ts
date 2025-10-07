import { z } from 'zod';

export const zComment = z.object({
  id: z.number(),
  postId: z.number(),
  name: z.string(),
  email: z.string().email(),
  body: z.string(),
});

export const zComments = z.array(zComment);
export const zCreateCommentDto = zComment.omit({ id: true });
