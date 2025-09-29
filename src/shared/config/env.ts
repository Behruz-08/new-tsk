import { z } from 'zod';

const EnvSchema = z.object({
  NEXT_PUBLIC_JSONPLACEHOLDER_BASE_URL: z
    .string()
    .url()
    .default('https://jsonplaceholder.typicode.com'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

export const ENV = EnvSchema.parse({
  NEXT_PUBLIC_JSONPLACEHOLDER_BASE_URL: process.env.NEXT_PUBLIC_JSONPLACEHOLDER_BASE_URL,
  NODE_ENV: process.env.NODE_ENV,
});
