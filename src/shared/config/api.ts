import { ENV } from './env';

export const API_CONFIG = {
  BASE_URL: ENV.NEXT_PUBLIC_JSONPLACEHOLDER_BASE_URL,
  TIMEOUT: 10000,
  RETRIES: 3,
  RETRY_DELAY: 1000,
} as const;
