import { z } from 'zod';

export const zUser = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  website: z.string().url().optional(),
  avatar: z.string().url().optional(),
});

export const zCurrentUser = zUser.extend({
  isAuthenticated: z.boolean(),
  role: z.enum(['admin', 'user', 'guest']),
});

export const zCreateUserDto = zUser.omit({ id: true });
export const zUpdateUserDto = zCreateUserDto.partial().extend({ id: z.number() });
